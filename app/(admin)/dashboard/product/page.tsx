'use client';

import { useRouter } from 'next/navigation';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductTable from '@/components/product-table';

export default function ProductPage() {
    const router = useRouter();
    return (
        <div className="relative">
            <Button
                className="absolute right-4 top-4 rounded-3xl bg-green-400 text-white"
                onClick={() => {
                    router.push('/dashboard/product/new');
                }}
            >
                <Plus />
                <span>Create Product</span>
            </Button>
            <div className="pt-4">
                <ProductTable />
            </div>
        </div>
    );
}
