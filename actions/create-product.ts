import { DataCreateProduct } from '@/types/index';
import prisma from '@/lib/prisma';

export const fetchDataCreateProductForm = async (): Promise<DataCreateProduct> => {
    try {
        const [categories, genders, detailCategories, promotions, trademark] = await Promise.all([
            prisma.category.findMany({
                where: { deletedAt: null },
            }),
            prisma.gender.findMany({
                where: { deletedAt: null },
            }),
            prisma.detailCategory.findMany({
                where: { deletedAt: null },
            }),
            prisma.promotion.findMany({
                where: { deletedAt: null },
            }),
            prisma.trademark.findMany({
                where: { deletedAt: null },
            }),
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
