import { useCallback } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FieldValues, FieldPath, UseControllerProps, ControllerRenderProps, Path, PathValue } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';

import UploadImage from '@/components/uploader-image';
import UploadImages from '@/components/uploader-images';
import PopoverCheckbox from '@/components/popover-checkbox';
import PopoverSelect from '@/components/popover-select';

interface GenericFieldProps<TFieldValues extends FieldValues> {
    label?: string;
    description?: string;
    renderInput: (field: ControllerRenderProps<TFieldValues>) => React.ReactNode;
}

interface InputFieldProps<TFieldValues extends FieldValues> extends UseControllerProps<TFieldValues> {
    className?: string;
    label: string;
    placeholder: string;
    type?: string;
    disabled?: boolean;
}

interface PopoverSelectFieldProps<TFieldValues extends FieldValues, TItem> extends UseControllerProps<TFieldValues> {
    className?: string;
    defaultLabel?: string;
    defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>;
    label: string;
    items: TItem[];
    getItemKey: (item: TItem) => string;
    getItemName: (item: TItem) => string;
    disabled?: boolean;
    description?: string;
    addHref?: string;
    updateHref?: string;
    deleteHref?: string;
}

interface PopoverCheckboxFieldProps<TFieldValues extends FieldValues, TItem> extends UseControllerProps<TFieldValues> {
    label: string;
    items: TItem[];
    getItemKey: (item: TItem) => string | number;
    getItemName: (item: TItem) => string;
    disabled?: boolean;
}

interface ToggleGroupFieldProps<TFieldValues extends FieldValues, TItem> extends UseControllerProps<TFieldValues> {
    label: string;
    items: TItem[];
    getItemKey: (item: TItem) => string | number;
    getItemName: (item: TItem) => string;
    description: string;
    className?: string;
}

interface RadioGroupFieldProps<TFieldValues extends FieldValues, TItem> extends UseControllerProps<TFieldValues> {
    label: string;
    items: TItem[];
    getItemKey: (item: TItem) => string | number;
    getItemName: (item: TItem) => string;
    description: string;
    className?: string;
}

interface ImageFieldProps<TFieldValues extends FieldValues> extends UseControllerProps<TFieldValues> {
    className?: string;
    label?: string;
    setUrl: React.Dispatch<React.SetStateAction<string>>;
}

interface ImagesFieldProps<TFieldValues extends FieldValues> extends UseControllerProps<TFieldValues> {
    className?: string;
    label?: string;
    setUrls: React.Dispatch<React.SetStateAction<string[]>>;
}

export const GenericField = <TFieldValues extends FieldValues>({
    label,
    description,
    renderInput,
    ...fieldProps
}: GenericFieldProps<TFieldValues> & UseControllerProps<TFieldValues>) => (
    <FormField
        control={fieldProps.control}
        name={fieldProps.name as FieldPath<TFieldValues>}
        render={({ field }) => (
            <FormItem className="w-full">
                {label && <FormLabel>{label}</FormLabel>}
                <FormControl>{renderInput(field)}</FormControl>
                {description && <FormDescription>{description}</FormDescription>}
                <FormMessage />
            </FormItem>
        )}
    />
);

export const InputField = <TFieldValues extends FieldValues>({
    className,
    label,
    placeholder,
    type = 'text',
    disabled = false,
    ...fieldProps
}: InputFieldProps<TFieldValues>) => {
    const renderInput = useCallback(
        (field: ControllerRenderProps<TFieldValues>) => {
            switch (type) {
                case 'number':
                    return (
                        <Input
                            {...field}
                            placeholder={placeholder}
                            type="number"
                            inputMode="numeric"
                            className={className}
                            value={(field.value === 0 ? '' : field.value) ?? ''}
                            onKeyDown={preventInvalidNumberInput}
                            disabled={disabled}
                        />
                    );
                case 'password':
                    return (
                        <Input
                            {...field}
                            className={className}
                            placeholder={placeholder}
                            type="password"
                            value={field.value}
                            disabled={disabled}
                        />
                    );
                case 'area':
                    return <Textarea disabled={disabled} placeholder={placeholder} className={className} {...field} />;
                default:
                    return (
                        <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder={placeholder}
                            type={type}
                            className={className}
                            disabled={disabled}
                        />
                    );
            }
        },
        [type, className, placeholder, disabled],
    );

    return <GenericField label={label} {...fieldProps} renderInput={renderInput} />;
};

export const PopoverSelectField = <TFieldValues extends FieldValues, TItem>({
    label,
    defaultLabel,
    addHref,
    updateHref,
    deleteHref,
    items = [],
    getItemKey,
    getItemName,
    disabled,
    defaultValue,
    description,
    className,
    ...fieldProps
}: PopoverSelectFieldProps<TFieldValues, TItem>) => {
    const memoizedGetItemName = useCallback((item: TItem) => getItemName(item), [getItemName]);

    const renderInput = useCallback(
        (field: ControllerRenderProps<TFieldValues>) => (
            <PopoverSelect
                className={className}
                defaultLabel={defaultLabel}
                addHref={addHref}
                updateHref={updateHref}
                deleteHref={deleteHref}
                defaultValue={defaultValue}
                items={items}
                value={field.value}
                getItemName={memoizedGetItemName}
                getKey={getItemKey}
                onChange={field.onChange}
                disabled={disabled}
            />
        ),
        [
            className,
            defaultLabel,
            addHref,
            updateHref,
            deleteHref,
            defaultValue,
            items,
            memoizedGetItemName,
            getItemKey,
            disabled,
        ],
    );

    return <GenericField label={label} description={description} {...fieldProps} renderInput={renderInput} />;
};

export const PopoverCheckboxField = <TFieldValues extends FieldValues, TItem>({
    label,
    items,
    getItemKey,
    getItemName,
    disabled,
    ...fieldProps
}: PopoverCheckboxFieldProps<TFieldValues, TItem>) => {
    const memoizedGetItemName = useCallback((item: TItem) => getItemName(item), [getItemName]);

    const renderInput = useCallback(
        (field: ControllerRenderProps<TFieldValues>) => (
            <PopoverCheckbox
                items={items}
                value={field.value}
                onChange={field.onChange}
                getItemName={memoizedGetItemName}
                getItemKey={getItemKey}
                disabled={disabled}
            />
        ),
        [items, memoizedGetItemName, getItemKey, disabled],
    );

    return <GenericField label={label} {...fieldProps} renderInput={renderInput} />;
};

export const ImageField = <TFieldValues extends FieldValues>({
    label,
    setUrl,
    className,
    ...fieldProps
}: ImageFieldProps<TFieldValues>) => {
    const renderInput = useCallback(
        (field: ControllerRenderProps<TFieldValues>) => (
            <UploadImage
                initialFile={field.value as File | string}
                onChange={field.onChange}
                setUrl={setUrl}
                className={className}
            />
        ),
        [className, setUrl],
    );

    return <GenericField label={label} {...fieldProps} renderInput={renderInput} />;
};

export const ImagesField = <TFieldValues extends FieldValues>({
    label,
    setUrls,
    className,
    ...fieldProps
}: ImagesFieldProps<TFieldValues>) => {
    const renderInput = useCallback(
        (field: ControllerRenderProps<TFieldValues>) => (
            <UploadImages
                setUrls={setUrls}
                onChange={field.onChange}
                initialFilesState={field.value}
                className={className}
            />
        ),
        [setUrls, className],
    );

    return <GenericField label={label} {...fieldProps} renderInput={renderInput} />;
};

export const RadioGroupField = <TFieldValues extends FieldValues, TItem>({
    label,
    items = [],
    getItemKey,
    getItemName,
    description,
    className,
    ...fieldProps
}: RadioGroupFieldProps<TFieldValues, TItem>) => {
    const renderInput = useCallback(
        (field: ControllerRenderProps<TFieldValues>) => (
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-1 space-y-1">
                {items.map((item) => (
                    <FormItem className="flex items-center space-x-3 space-y-0" key={getItemKey(item)}>
                        <FormControl>
                            <RadioGroupItem value={getItemName(item)} className={className} />
                        </FormControl>
                        <FormLabel className="font-normal">{getItemName(item)}</FormLabel>
                    </FormItem>
                ))}
            </RadioGroup>
        ),
        [items, getItemKey, getItemName, className],
    );

    return <GenericField label={label} description={description} {...fieldProps} renderInput={renderInput} />;
};

export const ToggleGroupField = <TFieldValues extends FieldValues, TItem>({
    label,
    items = [],
    getItemKey,
    getItemName,
    description,
    className,
    ...fieldProps
}: ToggleGroupFieldProps<TFieldValues, TItem>) => {
    const renderInput = useCallback(
        (field: ControllerRenderProps<TFieldValues>) => (
            <ToggleGroup
                type="multiple"
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex justify-start"
            >
                {items.map((item) => (
                    <ToggleGroupItem key={getItemKey(item)} value={getItemName(item)} className={className}>
                        {getItemName(item)}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        ),
        [items, getItemKey, getItemName, className],
    );

    return <GenericField label={label} description={description} {...fieldProps} renderInput={renderInput} />;
};

const preventInvalidNumberInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const invalidChars = ['e', 'E', '+', '-', ',', '.'];
    if ((event.currentTarget.value === '' && ['0'].includes(event.key)) || invalidChars.includes(event.key)) {
        event.preventDefault();
    }
};
