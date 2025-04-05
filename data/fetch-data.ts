import { DataCreateProduct } from '@/types/index';
import prisma from '@/lib/prisma';

export const fetchDataCreateProductForm = async (): Promise<DataCreateProduct> => {
    try {
        const [categories, genders, detailCategories, promotions, trademark] = await Promise.all([
            prisma.category.findMany(),
            prisma.gender.findMany(),
            prisma.detailCategory.findMany(),
            prisma.promotion.findMany(),
            prisma.trademark.findMany(),
        ]);

        return {
            categories,
            genders,
            detailCategories,
            promotions,
            trademark,
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Failed to fetch data for product creation form');
    }
};
