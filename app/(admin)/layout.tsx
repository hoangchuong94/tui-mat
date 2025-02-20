import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

import DashboardSidebar from '@/components/sidebar';
import DashboardHeader from '@/components/dashboard-header copy';

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

    return (
        <SidebarProvider defaultOpen={defaultOpen || true}>
            <DashboardSidebar />
            <SidebarInset className="custom-scrollbar">
                <DashboardHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
