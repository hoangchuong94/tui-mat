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

/** === CRUD Options === */
const genderOptions: CrudOptions<WithSoftDelete<GenderModalSchemaType>> = {
    schema: GenderModalSchema,
    model: 'gender',
    pathToRevalidate: '/dashboard/product',
    uniqueFields: ['name'],
    softDeleteField: 'deletedAt',
};

const categoryOptions: CrudOptions<WithSoftDelete<CategoryModalSchemaType>> = {
    schema: CategoryModalSchema,
    model: 'category',
    pathToRevalidate: '/dashboard/product',
    uniqueFields: ['name', 'genderId'],
    softDeleteField: 'deletedAt',
};

/** === Gender Actions === */
export const createGender = async (values: GenderModalSchemaType) => createItem(values, genderOptions);

export const updateGender = async (id: string, values: GenderModalSchemaType) => updateItem(id, values, genderOptions);

export const deleteGender = async (id: string) => deleteItems(id, genderOptions);

export const getAllGenders = async () => getItems(genderOptions);

export const getGenderById = async (id: string) => getItems(genderOptions, { id });

export const fetchGenders = async () =>
    getItems({
        ...genderOptions,
        include: {
            categories: true,
        },
    });

/** === Category Actions === */
export const createCategory = async (values: CategoryModalSchemaType) => createItem(values, categoryOptions);

export const updateCategory = async (id: string, values: CategoryModalSchemaType) =>
    updateItem(id, values, categoryOptions);

export const deleteCategory = async (ids: string[] | string) => deleteItems(ids, categoryOptions);

export const getAllCategories = async () => getItems(categoryOptions);

export const getCategoryById = async (id: string) => getItems(categoryOptions, { id });

export const getCategoriesByGenderId = async (genderId: string) =>
    getItems(categoryOptions, {
        filters: { genderId },
    });

/** === Form Data Fetch === */
export const fetchDataCreateProductForm = async (): Promise<DataCreateProduct> => {
    try {
        const [categories, genders, detailCategories, promotions, trademarks] = await Promise.all([
            prisma.category.findMany({ where: { deletedAt: null } }),
            prisma.gender.findMany({ where: { deletedAt: null } }),
            prisma.detailCategory.findMany({ where: { deletedAt: null } }),
            prisma.promotion.findMany({ where: { deletedAt: null } }),
            prisma.trademark.findMany({ where: { deletedAt: null } }),
        ]);

        return { categories, genders, detailCategories, promotions, trademarks };
    } catch (error) {
        console.error('Error fetching create product form data:', error);
        return {
            categories: [],
            genders: [],
            detailCategories: [],
            promotions: [],
            trademarks: [],
        };
    }
};
