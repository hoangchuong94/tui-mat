'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import {
    CirclePercent,
    CreditCard,
    LayoutDashboard,
    Store,
    ChartNoAxesCombined,
    NotebookText,
    HandCoins,
    ListRestart,
    ChevronsUpDown,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarSeparator,
    useSidebar,
} from '@/components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import logo from '@/public/static/logo-1.png';

interface Profile {
    username: string;
    email: string;
    avatar: string;
}

interface DashboardSidebarProps {
    profile: Profile;
}

const menuItems = [
    { path: 'overview', label: 'Overview', icon: <LayoutDashboard /> },
    { path: 'analytics', label: 'Analytics', icon: <ChartNoAxesCombined /> },
    { path: 'product', label: 'Product', icon: <Store /> },
    { path: 'sales', label: 'Sales', icon: <CirclePercent /> },
];

const transactionItems = [
    { path: 'payment', label: 'Payment', icon: <CreditCard /> },
    { path: 'returns', label: 'Returns', icon: <HandCoins /> },
    { path: 'invoice', label: 'Invoice', icon: <NotebookText /> },
    { path: 'refunds', label: 'Refunds', icon: <ListRestart /> },
];

export default function DashboardSidebar({ profile }: DashboardSidebarProps) {
    const pathname = usePathname();
    const { open, setOpen } = useSidebar();
    const isActive = (path: string) => pathname.includes(`/dashboard/${path}`);

    return (
        <Sidebar variant="floating" collapsible="icon" className="bg-slate-300">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center justify-center" onClick={() => setOpen(!open)}>
                        <Image src={logo} alt="logo" quality={100} priority className="cursor-pointer" />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                    <SidebarMenu>
                        {menuItems.map(({ path, label, icon }) => (
                            <SidebarMenuItem key={path} className="flex items-center justify-center">
                                <SidebarMenuButton
                                    asChild
                                    className={
                                        isActive(path)
                                            ? 'bg-green-400 text-white hover:bg-green-400 hover:text-white'
                                            : ''
                                    }
                                >
                                    <Link href={`/dashboard/${path}`}>
                                        {icon}
                                        <span>{label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Transaction</SidebarGroupLabel>
                    <SidebarMenu>
                        {transactionItems.map(({ path, label, icon }) => (
                            <SidebarMenuItem key={path} className="flex items-center justify-center">
                                <SidebarMenuButton asChild className={isActive(path) ? 'bg-green-400 text-white' : ''}>
                                    <Link href={`/dashboard/${path}`}>
                                        {icon}
                                        <span>{label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarSeparator />
            <SidebarFooter>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem className="flex items-center justify-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex w-full items-center justify-center">
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src={profile.avatar} alt={profile.username} />
                                        </Avatar>
                                        <SidebarMenuButton className={`flex justify-between ${!open && 'hidden'}`}>
                                            <span>{profile.username}</span>
                                            <ChevronsUpDown />
                                        </SidebarMenuButton>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <Button variant="outline" onClick={() => signOut()} className="w-full">
                                        Sign Out
                                    </Button>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
            </SidebarFooter>
        </Sidebar>
    );
}
