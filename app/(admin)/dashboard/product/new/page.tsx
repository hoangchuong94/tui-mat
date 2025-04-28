import React from 'react';
import CreateProductForm from '@/components/create-product-form';
import { fetchDataCreateProductForm } from '@/actions/create-product';

export default async function NewProductPage() {
    const data = await fetchDataCreateProductForm();
    return <CreateProductForm dataCreateProduct={data} />;
}
