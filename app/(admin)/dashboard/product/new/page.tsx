import React from 'react';
import CreateProductForm from '@/components/create-product-form';
import { fetchDataCreateProductForm, fetchGenders } from '@/actions/create-product';

export default async function NewProductPage() {
    const data = await fetchDataCreateProductForm();
    const { success, error, data: dataG } = await fetchGenders();

    if (!success) {
        console.log(error);
    } else {
        console.log(JSON.stringify(dataG, null, 2));
    }

    return <CreateProductForm dataCreateProduct={data} />;
}
