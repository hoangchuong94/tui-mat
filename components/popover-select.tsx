'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Check, ChevronsUpDown, Plus, Trash, Pencil } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface PopoverSelectProps<T> {
    items: T[];
    defaultValue?: T | string;
    value?: T | string;
    getItemName: (item: T) => string;
    getKey: (item: T) => string;
    onChange: (value: T | string | undefined) => void;
    disabled?: boolean;
    createHref?: string;
    updateHref?: string;
    deleteHref?: string;
    defaultLabel?: string;
    className?: string;
}

export const PopoverSelect = <T,>({
    items = [],
    defaultValue,
    value,
    getItemName,
    getKey,
    onChange,
    createHref,
    updateHref,
    deleteHref,
    disabled = false,
    defaultLabel = 'Select an item',
    className,
}: PopoverSelectProps<T>) => {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    const selected = React.useMemo(() => {
        const selectedItem = value ?? defaultValue;
        if (!selectedItem) return undefined;
        const selectedKey = typeof selectedItem === 'string' ? selectedItem : getKey(selectedItem);
        return items.find((item) => getKey(item) === selectedKey);
    }, [value, defaultValue, items, getKey]);

    const selectedName = selected ? getItemName(selected) : defaultLabel;

    const handleSelect = React.useCallback(
        (key: string) => {
            const selectedItem = items.find((item) => getKey(item).toString() === key);
            if (selectedItem) {
                onChange(typeof value === 'string' ? key : selectedItem);
            }
            setOpen(false);
        },
        [items, value, getKey, onChange],
    );

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.stopPropagation();
    };

    return (
        <div className="flex gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn('w-full justify-between capitalize', { 'bg-slate-200': disabled })}
                        disabled={disabled}
                    >
                        {selectedName}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={cn('w-96 p-0', { 'ml-11': createHref }, className)}>
                    <Command>
                        <CommandInput placeholder="Search..." disabled={disabled} />
                        <CommandList>
                            <CommandEmpty>No data</CommandEmpty>
                            <CommandGroup>
                                {items.map((item) => {
                                    const itemName = getItemName(item);
                                    const id = getKey(item).toString();
                                    const isSelected = selected && getKey(selected) === id;

                                    return (
                                        <CommandItem
                                            key={id}
                                            className="flex flex-1 cursor-pointer capitalize"
                                            value={itemName}
                                            onSelect={() => handleSelect(id)}
                                            disabled={disabled}
                                        >
                                            <div className="flex flex-1">
                                                <Check
                                                    className={cn(
                                                        'mr-2 h-4 w-4',
                                                        isSelected ? 'opacity-100' : 'opacity-0',
                                                    )}
                                                />
                                                {itemName}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {updateHref && (
                                                    <Button
                                                        asChild
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-blue-600 hover:bg-blue-500 hover:text-white"
                                                    >
                                                        <Link href={`${updateHref}&id=${id}`} onClick={handleLinkClick}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                )}
                                                {deleteHref && (
                                                    <Button
                                                        asChild
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-red-600 hover:bg-red-500 hover:text-white"
                                                    >
                                                        <Link href={`${deleteHref}&id=${id}`} onClick={handleLinkClick}>
                                                            <Trash className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {!disabled && createHref && (
                <div className="flex items-center">
                    <Button type="button" size="icon" variant="outline" onClick={() => router.push(createHref)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};
