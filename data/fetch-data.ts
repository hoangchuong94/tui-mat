import { DataCreateProduct } from '@/types/index';
import prisma from '@/lib/prisma';

export const fetchDataCreateProductForm = async (): Promise<DataCreateProduct> => {
    try {
        const [categories, genders, detailCategories, promotions] = await Promise.all([
            prisma.category.findMany(),
            prisma.gender.findMany(),
            prisma.detailCategory.findMany(),
            prisma.promotion.findMany(),
        ]);

        return {
            categories,
            genders,
            detailCategories,
            promotions,
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Failed to fetch data for product creation form');
    }
};
