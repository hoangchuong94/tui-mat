import React from 'react';
import CreateProductForm from '@/components/create-product-form';
import { fetchDataCreateProductForm } from '@/data/fetch-data';

export default async function page() {
    const data = await fetchDataCreateProductForm();
    if (!data) {
        return (
            <>
                <h1>error</h1>
            </>
        );
    }
    return <CreateProductForm dataCreateProduct={data} />;
}
