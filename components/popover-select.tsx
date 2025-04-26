'use client';

import * as React from 'react';
import Link from 'next/link';

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
    addHref?: string;
    updateHref?: string;
    deleteHref?: string;
    defaultLabel?: string;
    className?: string;
}

export default function PopoverSelect<T>({
    items = [],
    defaultValue,
    value,
    getItemName,
    getKey,
    onChange,
    addHref,
    updateHref,
    deleteHref,
    disabled = false,
    defaultLabel = 'Select an item',
    className,
}: PopoverSelectProps<T>) {
    const [open, setOpen] = React.useState(false);

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

    return (
        <div className="flex gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-slate-200 capitalize"
                        disabled={disabled}
                    >
                        {selectedName}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={cn('w-96 p-0', { 'ml-11': addHref }, className)}>
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
                                        <div className="flex flex-row gap-1 pb-1" key={id}>
                                            <CommandItem
                                                className="flex flex-1 cursor-pointer capitalize"
                                                value={id}
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
                                            </CommandItem>
                                            <div className="flex items-center gap-1">
                                                {updateHref && (
                                                    <Link href={`${updateHref}&id=${id}`}>
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="outline"
                                                            className="text-blue-600 hover:bg-blue-500 hover:text-white"
                                                            aria-label="Edit"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}

                                                {deleteHref && (
                                                    <Link href={`${deleteHref}&id=${id}`}>
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="outline"
                                                            className="text-red-600 hover:bg-red-500 hover:text-white"
                                                            aria-label="Delete"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {!disabled && addHref && (
                <div className="flex items-center">
                    <Link href={addHref}>
                        <Button type="button" size="icon" variant="outline">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
