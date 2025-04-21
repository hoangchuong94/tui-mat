import React from 'react';
import Link from 'next/link';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductTable from '@/components/product-table';

export default async function ProductPage() {
    return (
        <div className="relative">
            <Link href={'/dashboard/product/new'}>
                <Button className="absolute right-4 top-0 rounded-3xl bg-green-400 text-white">
                    <Plus />
                    Create Product
                </Button>
            </Link>
            <ProductTable />
        </div>
    );
}
