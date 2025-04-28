'use server';
import { DataCreateProduct } from '@/types';
import {
    GenderModalSchema,
    CategoryModalSchema,
    DetailCategoryModalSchema,
    PromotionModalSchema,
    TrademarkModalSchema,
    GenderModalSchemaType,
    CategoryModalSchemaType,
    PromotionModalSchemaType,
    TrademarkModalSchemaType,
    DetailCategoryModalSchemaType,
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

const promotionOptions: CrudOptions<WithSoftDelete<PromotionModalSchemaType>> = {
    schema: PromotionModalSchema,
    model: 'promotion',
    pathToRevalidate: '/dashboard/product',
    uniqueFields: ['name'],
    softDeleteField: 'deletedAt',
};

const trademarkOptions: CrudOptions<WithSoftDelete<TrademarkModalSchemaType>> = {
    schema: TrademarkModalSchema,
    model: 'trademark',
    pathToRevalidate: '/dashboard/product',
    uniqueFields: ['name'],
    softDeleteField: 'deletedAt',
};

const detailCategoryOptions: CrudOptions<WithSoftDelete<DetailCategoryModalSchemaType>> = {
    schema: DetailCategoryModalSchema,
    model: 'detailCategory',
    pathToRevalidate: '/dashboard/product',
    uniqueFields: ['name', 'categoryId'],
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
            categories: {
                include: {
                    detailCategories: true,
                },
            },
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

/** === DetailCategory Actions === */
export const createDetailCategory = async (values: DetailCategoryModalSchemaType) =>
    createItem(values, detailCategoryOptions);

export const updateDetailCategory = async (id: string, values: DetailCategoryModalSchemaType) =>
    updateItem(id, values, detailCategoryOptions);

export const deleteDetailCategory = async (ids: string[] | string) => deleteItems(ids, detailCategoryOptions);

export const getAllDetailCategories = async () => getItems(detailCategoryOptions);

export const getDetailCategoryById = async (id: string) => getItems(detailCategoryOptions, { id });

export const getDetailCategoriesByCategoryId = async (categoryId: string) =>
    getItems(detailCategoryOptions, {
        filters: { categoryId },
    });

/** === Promotion Actions === */
export const createPromotion = async (values: PromotionModalSchemaType) => createItem(values, promotionOptions);

export const updatePromotion = async (id: string, values: PromotionModalSchemaType) =>
    updateItem(id, values, promotionOptions);

export const deletePromotion = async (id: string) => deleteItems(id, promotionOptions);

export const getAllPromotions = async () => getItems(promotionOptions);

export const getPromotionById = async (id: string) => getItems(promotionOptions, { id });

/** === Trademark Actions === */
export const createTrademark = async (values: TrademarkModalSchemaType) => createItem(values, trademarkOptions);

export const updateTrademark = async (id: string, values: TrademarkModalSchemaType) =>
    updateItem(id, values, trademarkOptions);

export const deleteTrademark = async (id: string) => deleteItems(id, trademarkOptions);

export const getAllTrademarks = async () => getItems(trademarkOptions);

export const getTrademarkById = async (id: string) => getItems(trademarkOptions, { id });

export const fetchDataCreateProductForm = async (): Promise<DataCreateProduct> => {
    try {
        const [gendersResult, categoriesResult, detailCategoriesResult, promotionsResult, trademarksResult] =
            await Promise.all([
                getAllGenders(),
                getAllCategories(),
                getAllDetailCategories(),
                getAllPromotions(),
                getAllTrademarks(),
            ]);

        const genders = gendersResult.success ? gendersResult.data : [];
        const categories = categoriesResult.success ? categoriesResult.data : [];
        const detailCategories = detailCategoriesResult.success ? detailCategoriesResult.data : [];
        const promotions = promotionsResult.success ? promotionsResult.data : [];
        const trademarks = trademarksResult.success ? trademarksResult.data : [];

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
