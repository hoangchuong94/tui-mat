'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Plus, Trash, Pencil } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Link from 'next/link';

interface PopoverSelectProps<T> {
    items: T[];
    defaultValue?: T;
    value?: T;
    getItemName: (item: T) => string;
    getKey: (item: T) => string | number;
    onChange: (value: T | undefined) => void;
    disabled?: boolean;
    addHref?: string;
    updateHref?: string;
    removeHref?: string;
    defaultLabel?: string;
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
    removeHref,
    disabled = false,
    defaultLabel = 'Select an item',
}: PopoverSelectProps<T>) {
    const [open, setOpen] = React.useState(false);

    const selected = value ?? defaultValue;

    const matchedItem = selected ? items.find((item) => getKey(item) === getKey(selected)) : undefined;

    const selectedName = matchedItem ? getItemName(matchedItem) : defaultLabel;

    const handleSelect = React.useCallback(
        (name: string) => {
            const selectedItem = items.find((item) => getItemName(item) === name);
            if (selectedItem) onChange(selectedItem);
            setOpen(false);
        },
        [items, getItemName, onChange],
    );

    return (
        <div className="flex gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-slate-200"
                        disabled={disabled}
                    >
                        {selectedName || defaultLabel}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 xl:w-96">
                    <Command>
                        <CommandInput placeholder="Search..." disabled={disabled} />
                        <CommandList>
                            <CommandEmpty>No data</CommandEmpty>
                            <CommandGroup>
                                {items.map((item) => {
                                    const itemName = getItemName(item);
                                    const id = getKey(item);
                                    const isSelected = selected && getKey(selected) === getKey(item);

                                    return (
                                        <div className="flex flex-row gap-2" key={getKey(item)}>
                                            <CommandItem
                                                className="flex flex-1 cursor-pointer capitalize"
                                                value={itemName}
                                                onSelect={() => handleSelect(itemName)}
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
                                                            variant="ghost"
                                                            className="text-blue-600 hover:bg-blue-100"
                                                            aria-label="Edit"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}

                                                {removeHref && (
                                                    <Link href={`${removeHref}&id=${id}`}>
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="ghost"
                                                            className="text-red-600 hover:bg-red-100"
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
