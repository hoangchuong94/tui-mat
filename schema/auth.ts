import { z } from 'zod';

export const SignInSchema = z.object({
    email: z.string({ required_error: 'Email is required' }).min(1, 'Email is required').email('Invalid email'),
    password: z
        .string({ required_error: 'Password is required' })
        .min(1, 'Password is required')
        .min(6, 'Password must be more than 6 characters')
        .max(32, 'Password must be less than 32 characters'),
});

export const SignUpSchema = z
    .object({
        name: z
            .string({ required_error: 'Name is required' })
            .min(1, 'Name is required')
            .min(6, 'Name must be more than 6 characters')
            .max(32, 'Name must be less than 32 characters'),
        email: z.string({ required_error: 'Email is required' }).min(1, 'Email is required').email('Invalid email'),
        password: z
            .string({ required_error: 'Password is required' })
            .min(1, 'Password is required')
            .min(6, 'Password must be more than 6 characters')
            .max(32, 'Password must be less than 32 characters'),
        passwordConfirm: z
            .string({
                required_error: 'Please confirm your password',
            })
            .min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        path: ['passwordConfirm'],
        message: 'Password confirmation is incorrect',
    });

export const EmailSchema = z.object({
    email: z.string({ required_error: 'Email is required' }).min(1, 'Email is required').email('Invalid email'),
});

export const ForgotPasswordSchema = z
    .object({
        password: z
            .string({ required_error: 'Password is required' })
            .min(1, 'Password is required')
            .min(6, 'Password must be more than 6 characters')
            .max(32, 'Password must be less than 32 characters'),
        passwordConfirm: z
            .string({
                required_error: 'Please confirm your password',
            })
            .min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        path: ['passwordConfirm'],
        message: 'Password confirmation is incorrect',
    });

export type SignInForm = z.infer<typeof SignInSchema>;
export type SignUpForm = z.infer<typeof SignUpSchema>;
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;
export type SendVerificationEmailForm = z.infer<typeof EmailSchema>;
