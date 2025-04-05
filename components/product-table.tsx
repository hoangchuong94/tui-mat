import React from 'react';

import { columns } from '@/components/columns-table';
import { DataTable } from '@/components/data-table';

const ProductTable = () => {
    return <DataTable data={[]} columns={columns} className="px-4" />;
};

export default ProductTable;
