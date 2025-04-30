'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TagList } from '@/components/tag-list';

interface PopoverCheckboxProps<T> {
    items: T[];
    value: T[];
    onChange: (value: T[]) => void;
    getItemName: (item: T) => string;
    getItemKey: (item: T) => string | number;
    placeholder?: string;
    disabled?: boolean;
}

export const PopoverCheckbox = <T,>({
    items,
    value,
    onChange,
    getItemName,
    getItemKey,
    placeholder = 'Select item',
    disabled = false,
}: PopoverCheckboxProps<T>) => {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (item: T) => {
        if (disabled) return;

        const itemKey = getItemKey(item);
        const isSelected = value.some((selected) => getItemKey(selected) === itemKey);

        const newSelected = isSelected
            ? value.filter((selected) => getItemKey(selected) !== itemKey)
            : [...value, item];

        onChange(newSelected);
    };

    const handleRemove = (item: T) => {
        const newSelected = value.filter((selected) => getItemKey(selected) !== getItemKey(item));
        onChange(newSelected);
    };

    return (
        <div className={`flex flex-col space-y-2 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="min-w-[200px] justify-between border" disabled={disabled}>
                        {value.length > 0 ? `${value.length} selected` : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="min-w-96 p-0" disablePortal>
                    <Command>
                        <CommandInput placeholder="Search item..." disabled={disabled} />
                        <CommandList>
                            {items.length > 0 ? (
                                <CommandGroup>
                                    {items.map((item) => {
                                        const itemKey = getItemKey(item);
                                        const isChecked = value.some((selected) => getItemKey(selected) === itemKey);

                                        return (
                                            <CommandItem
                                                key={itemKey}
                                                className="cursor-pointer"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    handleSelect(item);
                                                }}
                                            >
                                                <div className="pointer-events-none flex w-full items-center space-x-2">
                                                    <Checkbox
                                                        id={String(itemKey)}
                                                        checked={isChecked}
                                                        disabled={disabled}
                                                    />
                                                    <label htmlFor={String(itemKey)} className="text-sm font-medium">
                                                        {getItemName(item)}
                                                    </label>
                                                </div>
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            ) : (
                                <CommandEmpty>No item found.</CommandEmpty>
                            )}
                        </CommandList>
                    </Command>
                    <Separator />
                </PopoverContent>
            </Popover>
            <TagList tagList={value} getItemName={getItemName} onRemove={handleRemove} className="min-h-12" />
        </div>
    );
};

export default PopoverCheckbox;
