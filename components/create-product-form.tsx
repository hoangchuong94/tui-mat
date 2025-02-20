'use client';
import z from 'zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, SquarePen } from 'lucide-react';

import { DataCreateProduct } from '@/types/index';
import { CreateProductSchema } from '@/schema/product';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ImageField, ImagesField, InputField, PopoverSelectField } from '@/components/custom-field';
import { useFilteredGender } from '@/hooks/use-filtered-gender';

interface CreateProductFormProps {
    dataCreateProduct: DataCreateProduct;
}

export default function CreateProductForm({ dataCreateProduct }: CreateProductFormProps) {
    // const [isPending, startTransition] = useTransition();
    const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const form = useForm<z.infer<typeof CreateProductSchema>>({
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
            promotions: {
                id: '',
                name: '',
                description: '',
                startDay: new Date(),
                endDay: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            gender: { id: '', name: '', createdAt: new Date(), updatedAt: new Date() },
            category: { id: '', name: '', genderId: '', createdAt: new Date(), updatedAt: new Date() },
            detailCategory: { id: '', name: '', categoryId: '', createdAt: new Date(), updatedAt: new Date() },
        },
    });

    console.log(thumbnailUrl);
    console.log(imageUrls);

    const { watch, resetField } = form;

    const selectedGender = watch('gender');
    const selectedCategory = watch('category');

    const { filteredCategories, filteredDetailCategories } = useFilteredGender(
        selectedGender,
        selectedCategory,
        dataCreateProduct.categories,
        dataCreateProduct.detailCategories,
        resetField,
    );

    const onSubmit = (values: z.infer<typeof CreateProductSchema>) => {
        console.log(values);
    };
    return (
        <div className="px-4">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid-cols-10 gap-2 pb-2 max-md:space-y-2 md:grid"
                >
                    <div className="col-span-10">
                        <div className="flex w-full items-center justify-between">
                            <h1 className="flex items-center justify-center">
                                <SquarePen className="mr-2" />
                                <span>Create Product</span>
                            </h1>
                            <Button className="rounded-3xl bg-green-400 text-white">
                                <Check />
                                Add Product
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2 rounded-2xl bg-slate-100 p-4 md:col-span-5 lg:col-span-6 xl:col-span-7">
                        <InputField
                            name="name"
                            label="Name"
                            className="bg-slate-200 focus:bg-white"
                            placeholder="Please enter your name"
                        />

                        <InputField
                            type="number"
                            name="quantity"
                            className="bg-slate-200 focus:bg-white"
                            label="Quantity"
                            placeholder="Please enter your price quantity"
                        />
                        <PopoverSelectField
                            name="gender"
                            label="Gender"
                            items={dataCreateProduct.genders}
                            getItemKey={(item) => item.id}
                            renderItem={(item) => item.name}
                        />
                        <InputField
                            type="area"
                            name="description"
                            label="Description Product"
                            className="h-40 bg-slate-200 focus:bg-white"
                            placeholder="Type your message here."
                        />
                    </div>

                    <div className="space-y-2 rounded-2xl bg-slate-100 p-4 md:col-span-5 lg:col-span-4 xl:col-span-3">
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
                                placeholder="Please enter your price product"
                            />
                            <InputField
                                type="number"
                                className="bg-slate-200 focus:bg-white"
                                label="Stock"
                                name="stock"
                                placeholder="Please enter your stock product"
                            />
                        </div>
                        <div className="grid-cols-2 gap-2 max-lg:space-y-2 lg:grid">
                            <InputField
                                type="number"
                                className="bg-slate-200 focus:bg-white"
                                label="Discount"
                                name="discount"
                                placeholder="Enter your discount"
                            />
                            <PopoverSelectField
                                name="discountType"
                                label="Discount Type"
                                items={dataCreateProduct.promotions}
                                getItemKey={(item) => item.id}
                                renderItem={(item) => item.name}
                            />
                        </div>
                        <div className="grid-cols-2 gap-2 max-lg:space-y-2 lg:grid">
                            <InputField
                                type="number"
                                className="bg-slate-200 focus:bg-white"
                                label="Discount"
                                name="discount"
                                placeholder="Enter your discount"
                            />
                            <PopoverSelectField
                                name="discountType"
                                label="Discount Type"
                                items={dataCreateProduct.promotions}
                                getItemKey={(item) => item.id}
                                renderItem={(item) => item.name}
                            />
                        </div>
                    </div>
                    <div className="space-y-2 rounded-2xl bg-slate-100 p-4 md:col-span-5 lg:col-span-4 xl:col-span-3">
                        <PopoverSelectField
                            name="category"
                            label="Category"
                            items={filteredCategories}
                            getItemKey={(item) => item.id}
                            renderItem={(item) => item.name}
                            description="Please select a gender."
                            disabled={filteredCategories.length > 0 ? false : true}
                        />
                        <PopoverSelectField
                            name="detailCategory"
                            label="Detail Category"
                            items={filteredDetailCategories}
                            getItemKey={(item) => item.id}
                            renderItem={(item) => item.name}
                            description="Please select a category."
                            disabled={filteredDetailCategories.length > 0 ? false : true}
                        />
                    </div>
                </form>
            </Form>
        </div>
    );
}
