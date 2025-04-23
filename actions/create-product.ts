'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { CategoryModalSchema, GenderModalSchema } from '@/schema/product';
import { DataCreateProduct } from '@/types/index';
import {
    createItem,
    updateItem,
    deleteItem,
    type CrudOptions,
    type WithSoftDelete,
    getItems,
} from '@/actions/crud-service';

type CategoryInput = z.infer<typeof CategoryModalSchema>;

type GenderInput = z.infer<typeof GenderModalSchema>;

const categoryOptions = {
    schema: CategoryModalSchema,
    model: 'category' as const,
    pathToRevalidate: '/dashboard/product/new',
    uniqueField: 'name' as const,
};

const genderOptions: CrudOptions<WithSoftDelete<{ name: string }>> = {
    schema: GenderModalSchema,
    model: 'gender',
    pathToRevalidate: '/dashboard/product/new',
    uniqueField: 'name',
    softDeleteField: 'deletedAt',
};

console.log(genderOptions);

export const createGender = async (values: GenderInput) => {
    return createItem(values, genderOptions);
};

export const updateGender = async (id: string, values: GenderInput) => {
    return updateItem(id, values, genderOptions);
};

export const deleteGender = async (id: string) => {
    return deleteItem(id, genderOptions);
};

export const getGenders = async () => {
    return await getItems({ model: 'gender' });
};

export const getGenderById = async (id?: string) => {
    return await getItems({ model: 'gender', id });
};

export const createCategory = async (values: CategoryInput) => {
    return createItem(values, categoryOptions);
};

export const updateCategory = async (id: string, values: CategoryInput) => {
    return updateItem(id, values, categoryOptions);
};

export const deleteCategory = async (id: string) => {
    return deleteItem(id, categoryOptions);
};

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
