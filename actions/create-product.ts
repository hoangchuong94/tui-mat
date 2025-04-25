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
    uniqueFields: ['name'],
    softDeleteField: 'deletedAt',
};

const categoryOptions: CrudOptions<WithSoftDelete<CategoryModalSchemaType>> = {
    schema: CategoryModalSchema,
    model: 'category',
    pathToRevalidate: '/dashboard/product/new',
    uniqueFields: ['name', 'genderId'],
    softDeleteField: 'deletedAt',
};

export const createGender = async (values: GenderModalSchemaType) => {
    return createItem(values, genderOptions);
};

export const updateGender = async (id: string, values: GenderModalSchemaType) => {
    return updateItem(id, values, genderOptions);
};

export const deleteGender = async (genderId: string) => {
    return await prisma.$transaction(async () => {
        const { data } = await getCategoryByIdGender(genderId);

        const categoryIds = Array.isArray(data) ? data.map((item) => item.id) : [];

        const promises = [];

        if (categoryIds.length > 0) {
            promises.push(deleteCategory(categoryIds));
        }

        promises.push(deleteItems(genderId, genderOptions));

        await Promise.all(promises);

        return {
            success: true,
            message: 'items deleted successfully.',
            data: null,
            error: '',
        };
    });
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

export const deleteCategory = async (ids: string[] | string) => {
    return deleteItems(ids, categoryOptions);
};

export const getAllCategory = async () => {
    return getItems(categoryOptions);
};

export const getCategoryByIdGender = async (genderId: string) => {
    return getItems(categoryOptions, {
        filters: {
            genderId,
        },
    });
};

export const getCategoryById = async (id: string) => {
    return getItems(categoryOptions, { id });
};

export const fetchDataCreateProductForm = async (): Promise<DataCreateProduct> => {
    try {
        const [categories, genders, detailCategories, promotions, trademarks] = await Promise.all([
            prisma.category.findMany({ where: { deletedAt: null } }),
            prisma.gender.findMany({ where: { deletedAt: null } }),
            prisma.detailCategory.findMany({ where: { deletedAt: null } }),
            prisma.promotion.findMany({ where: { deletedAt: null } }),
            prisma.trademark.findMany({ where: { deletedAt: null } }),
        ]);

        return {
            categories,
            genders,
            detailCategories,
            promotions,
            trademarks,
        };
    } catch (error) {
        return {
            categories: [],
            genders: [],
            detailCategories: [],
            promotions: [],
            trademarks: [],
        };
    }
};
