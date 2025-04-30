import { SessionProvider } from 'next-auth/react';
import { EdgeStoreProvider } from '@/lib/edgestore';
import { auth } from '@/auth';

import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';

const Providers = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();

    return (
        <SessionProvider session={session}>
            <EdgeStoreProvider>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    {children}
                </ThemeProvider>
            </EdgeStoreProvider>
        </SessionProvider>
    );
};

export default Providers;
