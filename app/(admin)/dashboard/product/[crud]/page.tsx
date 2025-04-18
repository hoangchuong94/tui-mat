import React from 'react';
import CreateProductForm from '@/components/create-product-form';
import { fetchDataCreateProductForm } from '@/data/fetch-data';

export default async function page({ params }: { params: Promise<{ crud: string }> }) {
    const { crud } = await params;

    switch (crud) {
        case 'create':
            const data = await fetchDataCreateProductForm();
            if (!data) {
                return (
                    <div>
                        <h1>error</h1>
                    </div>
                );
            }
            return <CreateProductForm dataCreateProduct={data} />;

        default:
            return <div>❓ not work </div>;
    }
}
