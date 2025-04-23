'use server';
import prisma from '@/lib/prisma';
import { DataCreateProduct } from '@/types';
import {
    GenderModalSchema,
    CategoryModalSchema,
    GenderModalSchemaType,
    CategoryModalSchemaType,
} from '@/schema/product';

import {
    createItem,
    updateItem,
    deleteItems,
    getItems,
    type CrudOptions,
    type WithSoftDelete,
} from '@/actions/crud-service';

const genderOptions: CrudOptions<WithSoftDelete<GenderModalSchemaType>> = {
    schema: GenderModalSchema,
    model: 'gender',
    pathToRevalidate: '/dashboard/product/new',
    uniqueField: 'name',
    softDeleteField: 'deletedAt',
};

const categoryOptions: CrudOptions<WithSoftDelete<CategoryModalSchemaType>> = {
    schema: CategoryModalSchema,
    model: 'category',
    pathToRevalidate: '/dashboard/product/new',
    uniqueField: 'name',
    softDeleteField: 'deletedAt',
};

export const createGender = async (values: GenderModalSchemaType) => {
    return createItem(values, genderOptions);
};

export const updateGender = async (id: string, values: GenderModalSchemaType) => {
    return updateItem(id, values, genderOptions);
};

export const deleteGender = async (id: string) => {
    const gitListCategoryByGenderId = await getItems(categoryOptions, { filters: { genderId: id } });

    if (gitListCategoryByGenderId.success) {
        const ids: string[] = gitListCategoryByGenderId.data.map((item: { id: string }) => item.id);
        const result = await deleteItems(ids, categoryOptions);

        console.log(result.success);
    }

    const result2 = await getItems<Category>(categoryOptions, { id });
    if (result2.success) {
        console.log(result2.data);
    }

    return deleteItems(id, genderOptions);
};

export const getAllGenders = async () => {
    return getItems(genderOptions);
};

export const getGenderById = async (id: string) => {
    return getItems(genderOptions, { id });
};

export const createCategory = async (values: CategoryModalSchemaType) => {
    return createItem(values, categoryOptions);
};

export const updateCategory = async (id: string, values: CategoryModalSchemaType) => {
    return updateItem(id, values, categoryOptions);
};

export const deleteCategory = async (id: string) => {
    return deleteItems(id, categoryOptions);
};

export const getAllCategory = async () => {
    return getItems(categoryOptions);
};

interface Category {
    name: string;
    genderId: string;
}

export const getCategoryById = async (id: string) => {
    return getItems<Category>(categoryOptions, { id });
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
