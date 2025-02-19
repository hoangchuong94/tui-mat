import NextAuth from 'next-auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

import { comparePassword } from '@/actions/hash-password';
import { DEFAULT_ADMIN_SIGN_IN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from '@/routes';
import { UserRole } from '@prisma/client';

export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
        signIn: '/sign-in',
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    providers: [
        GitHub,
        Google,
        Credentials({
            async authorize(credentials) {
                try {
                    if (!credentials.email || !credentials.password) {
                        return null;
                    }
                    const user = await prisma.user.findUnique({
                        where: {
                            email: String(credentials.email),
                        },
                    });
                    if (!user || !(await comparePassword(String(credentials.password), user.password!))) {
                        return null;
                    }
                    return user;
                } catch (error) {
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
            const isAuthRoute = authRoutes.includes(nextUrl.pathname);
            const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

            if (isApiAuthRoute) {
                if (nextUrl.href.includes('error')) {
                    return NextResponse.redirect(new URL(`/sign-in${nextUrl.search}`, nextUrl));
                }
                return true;
            }

            if (isAuthRoute) {
                if (isLoggedIn && auth.user.role && auth.user.role === 'ADMIN') {
                    return NextResponse.redirect(new URL(DEFAULT_ADMIN_SIGN_IN_REDIRECT, nextUrl));
                }
                if (isLoggedIn && auth.user.role && auth.user.role === 'USER') {
                    return NextResponse.redirect(new URL('/', nextUrl));
                }
                return true;
            }

            if (!isPublicRoute) {
                if (isLoggedIn && auth.user.role && auth.user.role !== 'ADMIN') {
                    let callbackUrl = nextUrl.pathname;
                    if (nextUrl.search) {
                        callbackUrl += nextUrl.search;
                    }
                    const encodedUrl = encodeURIComponent(callbackUrl);
                    return NextResponse.redirect(new URL(`/feedback?callbackUrl=${encodedUrl}`, nextUrl));
                }

                if (!isLoggedIn) {
                    return NextResponse.redirect(new URL('/sign-in', nextUrl));
                }
                return true;
            }

            return true;
        },
        jwt: async ({ token, user }) => {
            if (user) {
                token.role = user.role;
                return token;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (token.sub && token.role) {
                session.user.id = token.sub;
                session.user.role = token.role as UserRole;
                return session;
            }
            return session;
        },
        signIn: async ({ user, account }) => {
            if (account?.provider !== 'credentials') return true;

            if (user && user.id) {
                const exitingUser = await prisma.user.findUnique({
                    where: {
                        id: user.id,
                    },
                });

                if (!exitingUser?.emailVerified) {
                    return false;
                }
            }

            return true;
        },
    },
    events: {
        linkAccount: async ({ user }) => {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: new Date(),
                },
            });
        },
    },
});
