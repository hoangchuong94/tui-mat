import React from 'react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';

interface ModalProps {
    open: boolean;
    description?: string;
    openChange: (value: boolean) => void;
    title: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
}

export default function Modal({ title, description, header, footer, children, open, openChange }: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={openChange}>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogHeader className="capitalize">
                        {header || <DialogTitle className="text-center font-thin">{title}</DialogTitle>}
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                </DialogHeader>
                <div>{children}</div>
                <DialogFooter className="mt-4">{footer}</DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
