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
        case 'edit':
            return <div>✏️ Trang chỉnh sửa, ID: </div>;
        case 'view':
            return <div>🔍 Trang xem chi tiết, ID:</div>;
        default:
            return <div>❓ Hành động không hợp lệ: </div>;
    }
}
