'use server';
import * as z from 'zod';
import { signIn } from '@/auth';
import prisma from '@/lib/prisma';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { LoginSchema, RegisterSchema } from '@/schema/auth';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { hashPassword } from '@/actions/hash-password';

export async function authenticate(values: z.infer<typeof LoginSchema>) {
    let redirectTo = '';

    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' };
    }

    const { email, password } = validatedFields.data;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.email || !user.password) {
            return { error: 'Email does not exist!' };
        }

        if (!user.emailVerified) {
            const verificationToken = await generateVerificationToken(user.email);
            if (verificationToken) {
                await sendVerificationEmail({
                    email: verificationToken.email,
                    token: verificationToken.token,
                });
                return { success: 'Confirmation email sent successfully. Please check your email' };
            }
        }

        await signIn('credentials', { email, password, redirect: false });

        redirectTo = user.role === 'ADMIN' ? '/dashboard/overview' : user.role === 'USER' ? '/' : '/feedback';
    } catch (error) {
        if (error instanceof AuthError) {
            return {
                error:
                    error.type === 'CredentialsSignin'
                        ? 'Invalid credentials!'
                        : error.type === 'OAuthAccountNotLinked'
                          ? 'Invalid account not linked'
                          : 'Something went wrong!',
            };
        }

        console.error('Authentication error:', error);
        return { error: 'Something went wrong!' };
    }
    redirect(redirectTo);
}

export async function register(values: z.infer<typeof RegisterSchema>) {
    try {
        const validatedFields = RegisterSchema.safeParse(values);
        if (!validatedFields.success) {
            return { error: 'Invalid fields!' };
        }

        const { email, password, name } = validatedFields.data;
        const hashedPassword = await hashPassword(password);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: 'Email already in use!' };
        }

        await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        const verificationEmail = await generateVerificationToken(email);

        if (verificationEmail) {
            await sendVerificationEmail({
                email: verificationEmail.email,
                token: verificationEmail.token,
            });
        }

        return {
            success: 'Confirmation email sent successfully. Please check your email',
        };
    } catch (error) {
        console.error('Error during registration:', error);
        return {
            error: 'Database Error: Failed to register user.',
        };
    }
}
