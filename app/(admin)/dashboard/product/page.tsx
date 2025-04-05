'use client';
import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import ProductTable from '@/components/product-table';

export default function ProductPage() {
    return (
        <div className="relative">
            <Link href={'/dashboard/product/create'}>
                <Button className="absolute right-4 top-0 bg-green-400 text-white">Create Product</Button>
            </Link>
            <ProductTable />
        </div>
    );
}
