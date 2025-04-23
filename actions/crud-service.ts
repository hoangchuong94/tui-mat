'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { GenderModalSchema } from '@/schema/product';

export type WithSoftDelete<T> = T & {
    deletedAt?: Date | null;
};

type ModelName = Extract<keyof typeof prisma, string>;

interface GetItemOptions {
    model: ModelName;
    id?: string;
}

export interface CrudOptions<T> {
    schema: z.ZodSchema<T>;
    model: ModelName;
    pathToRevalidate: string;
    uniqueField: keyof T;
    softDeleteField?: keyof (T & { deletedAt?: Date | null });
    hardDelete?: boolean;
}

function getModel<T>(model: ModelName) {
    return prisma[model] as unknown as {
        findFirst: (args: any) => Promise<any>;
        findUnique: (args: any) => Promise<any>;
        create: (args: any) => Promise<any>;
        update: (args: any) => Promise<any>;
        delete?: (args: any) => Promise<any>;
        findMany: (args: any) => Promise<any>;
    };
}

function getWhereClauseForUniqueField<T>(field: keyof T, value: any) {
    if (typeof value === 'string') {
        return { [field]: { equals: value, mode: 'insensitive' } };
    }
    return { [field]: value };
}

export async function createItem<T>(values: T, options: CrudOptions<T>) {
    try {
        const { schema, model, pathToRevalidate, uniqueField, softDeleteField } = options;
        const validated = schema.safeParse(values);

        if (!validated.success) {
            return { success: false, message: '', error: 'Invalid data' };
        }

        const data = validated.data;
        const modelClient = getModel<T>(model);

        const baseCondition = getWhereClauseForUniqueField(uniqueField, data[uniqueField]);

        const where = softDeleteField ? { AND: [baseCondition, { [softDeleteField as string]: null }] } : baseCondition;

        const existing = await modelClient.findFirst({ where });

        if (existing) {
            return {
                success: false,
                message: '',
                error: `${String(model)} already exists`,
            };
        }

        await modelClient.create({ data });
        revalidatePath(pathToRevalidate);

        return {
            success: true,
            message: `${String(model)} created successfully`,
            error: '',
        };
    } catch (error: any) {
        console.error(`Error creating ${options.model}:`, error);
        return {
            success: false,
            message: '',
            error: error?.message || String(error) || 'Unexpected error while creating item',
        };
    }
}

export async function updateItem<T>(id: string, values: T, options: CrudOptions<T>) {
    try {
        const { schema, model, pathToRevalidate, uniqueField, softDeleteField } = options;
        const validated = schema.safeParse(values);

        if (!validated.success) {
            return { success: false, message: '', error: 'Invalid data' };
        }

        const data = validated.data;
        const modelClient = getModel<T>(model);

        const item = await modelClient.findUnique({ where: { id } });

        if (!item) {
            return { success: false, message: '', error: `${String(model)} not found` };
        }

        const baseCondition = getWhereClauseForUniqueField(uniqueField, data[uniqueField]);

        const where = {
            AND: [baseCondition, { NOT: { id } }, ...(softDeleteField ? [{ [softDeleteField as string]: null }] : [])],
        };

        const existing = await modelClient.findFirst({ where });

        if (existing) {
            return {
                success: false,
                message: '',
                error: `${String(model)} with the same ${String(uniqueField)} already exists`,
            };
        }

        await modelClient.update({ where: { id }, data });
        revalidatePath(pathToRevalidate);

        return {
            success: true,
            message: `${String(model)} updated successfully`,
            error: '',
        };
    } catch (error: any) {
        console.error(`Error updating ${options.model} (id: ${id}):`, error);
        return {
            success: false,
            message: '',
            error: error?.message || String(error) || 'Unexpected error while creating item',
        };
    }
}

export async function deleteItem(id: string, options: CrudOptions<any>) {
    try {
        const { model, pathToRevalidate, softDeleteField = 'deletedAt', hardDelete = false } = options;

        if (!id) {
            return { success: false, message: '', error: 'Invalid data' };
        }

        const modelClient = getModel<any>(model);
        const item = await modelClient.findUnique({ where: { id } });

        if (!item) {
            return { success: false, message: '', error: `${String(model)} not found` };
        }

        if (hardDelete && modelClient.delete) {
            await modelClient.delete({ where: { id } });
        } else {
            await modelClient.update({
                where: { id },
                data: { [softDeleteField]: new Date() },
            });
        }

        revalidatePath(pathToRevalidate);

        return {
            success: true,
            message: `${String(model)} deleted successfully`,
            error: '',
        };
    } catch (error: any) {
        console.error(`Error deleting ${options.model} (id: ${id}):`, error);
        return {
            success: false,
            message: '',
            error: error?.message || String(error) || 'Unexpected error while creating item',
        };
    }
}

export async function getItems<T>({ model, id }: GetItemOptions) {
    try {
        const modelClient = getModel<T>(model);

        let items;

        if (id) {
            items = await modelClient.findUnique({ where: { id } });
        } else {
            items = await modelClient.findMany({});
        }

        if (!items) {
            return { success: false, data: null, error: `${model} not found` };
        }

        const parsedData = Array.isArray(items)
            ? items.map((item) => GenderModalSchema.safeParse(item))
            : GenderModalSchema.safeParse(items);

        if (Array.isArray(parsedData)) {
            const errors = parsedData.filter((result) => !result.success);
            if (errors.length > 0) {
                return {
                    success: false,
                    data: null,
                    error: 'Data does not match schema',
                };
            }
        } else if (!parsedData.success) {
            return { success: false, data: null, error: 'Data does not match schema' };
        }

        return { success: true, data: items, error: '' };
    } catch (error: any) {
        console.error(`Error fetching ${model}:`, error);
        return {
            success: false,
            message: '',
            error: error?.message || String(error) || 'Unexpected error while creating item',
        };
    }
}
