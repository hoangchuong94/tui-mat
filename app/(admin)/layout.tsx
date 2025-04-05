import type { Metadata } from 'next';
import { auth } from '@/auth';
import { cookies } from 'next/headers';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

import { Profile } from '@/types';
import DashboardSidebar from '@/components/sidebar';
import DashboardHeader from '@/components/dashboard-header';

export const metadata: Metadata = {
    title: 'admin page',
    description: 'clothing store admin page',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
    const session = await auth();

    if (!session?.user) return null;

    const profile: Profile = {
        username: session.user.name || '',
        email: session.user.email || '',
        avatar: session.user.image || 'https://github.com/shadcn.png',
    };

    return (
        <SidebarProvider defaultOpen={defaultOpen || true}>
            {session.user && <DashboardSidebar profile={profile} />}
            <SidebarInset className="custom-scrollbar">
                <DashboardHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
