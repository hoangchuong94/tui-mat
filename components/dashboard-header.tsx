import React from 'react';
import { Slash } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import LinkHierarchy from '@/components/link-hierarchy';
import { ModeToggle } from './mode-toggle';

export default function DashboardHeader() {
    return (
        <div className="bg-slate-200 px-2 py-4">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="dark:text-black" />
                    <BreadcrumbSeparator className="list-none dark:text-black">
                        <Slash />
                    </BreadcrumbSeparator>
                    <LinkHierarchy />
                </div>
                <ModeToggle />
            </div>
        </div>
    );
}
