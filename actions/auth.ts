'use server';

import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

import prisma from '@/lib/prisma';

import { signIn } from '@/auth';
import { sendVerificationEmail } from '@/lib/mail';
import { hashPassword } from '@/actions/hash-password';
import { generateVerificationToken } from '@/lib/tokens';
import { SignInSchema, SignUpSchema, type SignInSchemaType, type SignUpSchemaType } from '@/schema/auth';
import { DEFAULT_ADMIN_SIGN_IN_REDIRECT } from '@/routes';

export async function authenticate(values: SignInSchemaType) {
    let redirectTo = '';

    const validatedFields = SignInSchema.safeParse(values);

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

        redirectTo = user.role === 'ADMIN' ? DEFAULT_ADMIN_SIGN_IN_REDIRECT : user.role === 'USER' ? '/' : '/feedback';
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

export async function signUp(values: SignUpSchemaType) {
    try {
        const validatedFields = SignUpSchema.safeParse(values);
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
