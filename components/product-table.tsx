'use client';
import React from 'react';

import { productTableColumn } from '@/components/columns-table';
import { DataTable } from '@/components/data-table';

const ProductTable = () => {
    return <DataTable data={[]} columns={productTableColumn} className="px-4" />;
};

export default ProductTable;
