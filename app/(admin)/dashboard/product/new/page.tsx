import React from 'react';
import CreateProductForm from '@/components/create-product-form';
import { fetchDataCreateProductForm } from '@/data/fetch-data';

export default async function NewProductPage() {
    const data = await fetchDataCreateProductForm();

    return <CreateProductForm dataCreateProduct={data} />;
}
