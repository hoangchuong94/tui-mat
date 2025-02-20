'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface PopoverSelectProps<T> {
    items: T[];
    defaultValue: T | undefined;
    value: T;
    getItemName: (item: T) => string;
    getKey: (item: T) => string | number;
    onChange: (value: T) => void;
    disabled?: boolean;
}

export default function PopoverSelect<T>({
    items = [],
    defaultValue,
    value,
    getItemName,
    getKey,
    onChange,
    disabled = false,
}: PopoverSelectProps<T>) {
    const [open, setOpen] = React.useState(false);
    const selectedItemName = React.useMemo(
        () => (value && getItemName(value).trim().length > 0 ? getItemName(value) : 'Select a item'),
        [value, getItemName],
    );

    const handleSelect = React.useCallback(
        (currentValue: string) => {
            const selectedItem = items.find((item) => getItemName(item) === currentValue);

            if (selectedItem) {
                onChange(selectedItem);
            } else {
                if (defaultValue) {
                    onChange(defaultValue);
                }
            }
            setOpen(false);
        },
        [items, getItemName, onChange, defaultValue],
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-haspopup="listbox"
                    aria-labelledby="custom-select-button"
                    className="w-full justify-between bg-slate-200"
                    disabled={disabled}
                >
                    {selectedItemName}
                    <ChevronsUpDown className={cn('ml-2 h-4 w-4 shrink-0 opacity-50')} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Search..." disabled={disabled} />
                    <CommandList>
                        <CommandEmpty>No data</CommandEmpty>
                        <CommandGroup>
                            {defaultValue && (
                                <CommandItem
                                    className="cursor-pointer capitalize"
                                    key={'default'}
                                    value={getItemName(defaultValue)}
                                    onSelect={() => handleSelect(getItemName(defaultValue))}
                                    disabled={disabled}
                                    aria-selected={defaultValue && getItemName(defaultValue) === '' ? true : false}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            defaultValue && getItemName(value) === '' ? 'opacity-100' : 'opacity-0',
                                        )}
                                    />
                                    Default
                                </CommandItem>
                            )}
                            {items.map((item) => (
                                <CommandItem
                                    className="cursor-pointer capitalize"
                                    key={getKey(item)}
                                    value={getItemName(item)}
                                    onSelect={() => handleSelect(getItemName(item))}
                                    disabled={disabled}
                                    aria-selected={value && getItemName(value) === getItemName(item) ? true : false}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value && getItemName(value) === getItemName(item)
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                    {getItemName(item)}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
