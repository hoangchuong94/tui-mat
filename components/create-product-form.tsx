'use client';
import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, SquarePen } from 'lucide-react';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DataCreateProduct } from '@/types/index';
import { useFilteredGender } from '@/hooks/use-filtered-gender';
import { CreateProductSchemaType, CreateProductSchema } from '@/schema/product';
import { ImageField, ImagesField, InputField, PopoverSelectField } from '@/components/custom-field';

interface CreateProductFormProps {
    dataCreateProduct: DataCreateProduct;
}

export default function CreateProductForm({ dataCreateProduct }: CreateProductFormProps) {
    // const [isPending, startTransition] = useTransition();
    const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const form = useForm<CreateProductSchemaType>({
        resolver: zodResolver(CreateProductSchema),
        defaultValues: {
            name: '',
            description: '',
            thumbnailFile: '',
            price: 0,
            stock: 0,
            quantity: 0,
            discount: 0,
            imageFiles: [],
            origin: '',
            gender: { id: '', name: '' },
            category: { id: '', name: '', genderId: '' },
            detailCategory: { id: '', name: '', categoryId: '' },
            trademark: { id: '', name: '' },
            promotions: {
                id: '',
                name: '',
                description: '',
            },
        },
    });

    const { control, resetField } = form;

    const selectedGender = useWatch({ control, name: 'gender' });
    const selectedCategory = useWatch({ control, name: 'category' });
    const discount = useWatch({ control, name: 'discount' });

    const { filteredCategories, filteredDetailCategories } = useFilteredGender(
        selectedGender,
        selectedCategory,
        dataCreateProduct.categories,
        dataCreateProduct.detailCategories,
        resetField,
    );

    const onSubmit = (values: CreateProductSchemaType) => {
        console.log(`thumbnailUrl : ${thumbnailUrl}`);
        console.log(`imageUrls : ${imageUrls}`);
        console.log(values);
    };

    return (
        <div className="px-4 py-4">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid-cols-10 gap-2 pb-2 max-md:space-y-2 md:grid"
                >
                    <div className="col-span-10 mb-2">
                        <div className="flex w-full items-center justify-between">
                            <h1 className="flex items-center justify-center">
                                <SquarePen className="mr-2" />
                                <span>Create Product</span>
                            </h1>
                            <Button className="rounded-3xl bg-green-400 text-white hover:bg-blue-500">
                                <Check />
                                Add Product
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2 rounded-2xl bg-slate-100 p-4 md:col-span-5 lg:col-span-6 xl:col-span-7">
                        <InputField
                            name="name"
                            label="Name"
                            className="bg-slate-200 focus:bg-white dark:text-black"
                            placeholder="Please enter your name"
                        />

                        <div className="md:grid md:grid-cols-2 md:gap-2">
                            <InputField
                                type="number"
                                name="quantity"
                                className="bg-slate-200 focus:bg-white dark:text-black"
                                label="Quantity"
                                placeholder="Please enter your price"
                            />
                            <PopoverSelectField
                                createHref="/dashboard/product/gender?action=create"
                                updateHref="/dashboard/product/gender?action=update"
                                deleteHref="/dashboard/product/gender?action=delete"
                                name="gender"
                                label="Gender"
                                items={dataCreateProduct.genders}
                                getItemKey={(item) => item.id}
                                getItemName={(item) => item.name}
                                defaultLabel="Select an gender"
                            />
                        </div>

                        <InputField
                            type="area"
                            name="description"
                            label="Description Product"
                            className="h-56 bg-slate-200 focus:bg-white"
                            placeholder="Please enter your description"
                        />
                    </div>

                    <div className="flex flex-col space-y-2 rounded-2xl bg-slate-100 p-4 md:col-span-5 lg:col-span-4 xl:col-span-3">
                        <ImageField
                            className="bg-white"
                            control={form.control}
                            name="thumbnailFile"
                            setUrl={setThumbnailUrl}
                        />

                        <ImagesField
                            className="bg-white"
                            control={form.control}
                            name="imageFiles"
                            setUrls={setImageUrls}
                        />
                    </div>

                    <div className="space-y-2 rounded-2xl bg-slate-100 p-4 md:col-span-5 lg:col-span-6 xl:col-span-7">
                        <div className="grid-cols-2 gap-2 max-lg:space-y-2 lg:grid">
                            <InputField
                                type="number"
                                className="bg-slate-200 focus:bg-white"
                                label="Price"
                                name="price"
                                placeholder="Please enter your price "
                            />
                            <InputField
                                type="number"
                                className="bg-slate-200 focus:bg-white"
                                label="Stock"
                                name="stock"
                                placeholder="Please enter your stock "
                            />
                        </div>
                        <div className="grid-cols-2 gap-2 max-lg:space-y-2 lg:grid">
                            <InputField
                                type="number"
                                className="bg-slate-200 focus:bg-white"
                                label="Discount"
                                name="discount"
                                placeholder="Please enter your discount"
                            />
                            <PopoverSelectField
                                createHref="/dashboard/product/promotion?action=create"
                                updateHref="/dashboard/product/promotion?action=update"
                                deleteHref="/dashboard/product/promotion?action=delete"
                                name="promotion"
                                label="Promotion"
                                items={dataCreateProduct.promotions}
                                getItemKey={(item) => item.id}
                                getItemName={(item) => item.name}
                                disabled={!discount}
                            />
                        </div>
                        <div className="grid-cols-2 gap-2 max-lg:space-y-2 lg:grid">
                            <InputField
                                type="text"
                                className="bg-slate-200 focus:bg-white"
                                label="Origin"
                                name="origin"
                                placeholder="Please enter your origin"
                            />

                            <PopoverSelectField
                                createHref="/dashboard/product/trademark?action=create"
                                updateHref="/dashboard/product/trademark?action=update"
                                deleteHref="/dashboard/product/trademark?action=delete"
                                name="trademark"
                                label="Trademark"
                                items={dataCreateProduct.trademarks}
                                getItemKey={(item) => item.id}
                                getItemName={(item) => item.name}
                            />
                        </div>
                    </div>
                    <div className="space-y-2 rounded-2xl bg-slate-100 p-4 md:col-span-5 lg:col-span-4 xl:col-span-3">
                        <PopoverSelectField
                            className="w-80"
                            createHref={`/dashboard/product/category?action=create&genderId=${selectedGender.id}`}
                            updateHref="/dashboard/product/category?action=update"
                            deleteHref="/dashboard/product/category?action=delete"
                            name="category"
                            label="Category"
                            items={filteredCategories}
                            getItemKey={(item) => item.id}
                            getItemName={(item) => item.name}
                            description="Please select a gender."
                            disabled={selectedGender.id ? false : true}
                            defaultLabel="Select an category"
                        />

                        <PopoverSelectField
                            className="w-80"
                            createHref={`/dashboard/product/detail-category?action=create&genderId=${selectedGender.id}`}
                            updateHref="/dashboard/product/detail-category?action=update"
                            deleteHref="/dashboard/product/detail-category?action=delete"
                            name="detailCategory"
                            label="Detail Category"
                            items={filteredDetailCategories}
                            getItemKey={(item) => item.id}
                            getItemName={(item) => item.name}
                            description="Please select a category."
                            disabled={selectedCategory.id ? false : true}
                            defaultLabel="Select an detail category"
                        />
                    </div>
                </form>
            </Form>
        </div>
    );
}
