'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

type ModelName = Extract<keyof typeof prisma, string>;

export type WithSoftDelete<T> = T & {
    deletedAt?: Date | null;
};

export interface CrudOptions<T> {
    schema: z.ZodSchema<T>;
    model: ModelName;
    pathToRevalidate: string;
    uniqueFields: (keyof T)[];
    softDeleteField?: keyof (T & { deletedAt?: Date | null });
    hardDelete?: boolean;
    include?: Record<string, any>;
}

function getModel<T = any>(model: ModelName): T {
    const client = prisma[model];
    if (!client) throw new Error(`Model "${model}" not found in Prisma`);
    return client as T;
}

function getWhereClause<T>(field: keyof T, value: any) {
    if (typeof value === 'string') {
        return { [field]: { equals: value, mode: 'insensitive' } };
    }
    return { [field]: value };
}

function buildUniqueWhere<T>(fields: (keyof T)[], data: T) {
    return fields.map((field) => getWhereClause(field, data[field]));
}

async function executeWithCatch<T>(fn: () => Promise<T>) {
    try {
        return await fn();
    } catch (error: any) {
        console.error('Error in executeWithCatch:', error);
        return {
            success: false,
            message: '',
            data: null,
            error: error?.message || String(error) || 'Unexpected error occurred',
        };
    }
}

export async function createItem<T>(values: T, options: CrudOptions<T>) {
    return executeWithCatch(async () => {
        const { schema, model, pathToRevalidate, uniqueFields, softDeleteField } = options;

        const validated = schema.safeParse(values);
        if (!validated.success) {
            return { success: false, message: '', data: null, error: validated.error.format() };
        }

        const data = validated.data;
        const client = getModel(model);

        const whereConditions = buildUniqueWhere(uniqueFields, data);

        console.log(whereConditions);
        const where = softDeleteField
            ? { AND: [...whereConditions, { [softDeleteField as string]: null }] }
            : { AND: whereConditions };

        console.log(where);

        const exists = await client.findFirst({ where });
        if (exists) {
            return {
                success: false,
                message: '',
                data: null,
                error: `${model} already exists with the same unique fields.`,
            };
        }

        console.log(data);

        await client.create({ data });
        revalidatePath(pathToRevalidate);

        return {
            success: true,
            message: `${model} created successfully.`,
            data: null,
            error: '',
        };
    });
}

export async function updateItem<T>(id: string, values: T, options: CrudOptions<T>) {
    return executeWithCatch(async () => {
        const { schema, model, pathToRevalidate, uniqueFields, softDeleteField } = options;

        const validated = schema.safeParse(values);
        if (!validated.success) {
            return { success: false, message: '', data: null, error: validated.error.format() };
        }

        const data = validated.data;
        const client = getModel(model);

        const current = await client.findUnique({ where: { id } });
        if (!current) {
            return { success: false, message: '', data: null, error: `${model} not found.` };
        }

        const whereConditions = buildUniqueWhere(uniqueFields, data);
        const where = {
            AND: [
                ...whereConditions,
                { NOT: { id } },
                ...(softDeleteField ? [{ [softDeleteField as string]: null }] : []),
            ],
        };

        const duplicate = await client.findFirst({ where });
        if (duplicate) {
            return {
                success: false,
                message: '',
                data: null,
                error: `${model} with the same unique fields already exists.`,
            };
        }

        await client.update({ where: { id }, data });
        revalidatePath(pathToRevalidate);

        return {
            success: true,
            message: `${model} updated successfully.`,
            data: null,
            error: '',
        };
    });
}

export async function deleteItems(ids: string | string[], options: CrudOptions<any>) {
    return executeWithCatch(async () => {
        const { model, pathToRevalidate, softDeleteField = 'deletedAt', hardDelete = false } = options;

        const idsArray = Array.isArray(ids) ? ids : [ids];
        if (idsArray.length === 0) {
            return { success: false, message: '', data: null, error: 'Invalid ID list' };
        }

        const client = getModel(model);
        const existingItems = await client.findMany({ where: { id: { in: idsArray } } });

        if (existingItems.length !== idsArray.length) {
            return {
                success: false,
                message: '',
                data: null,
                error: `${model} not found for some of the provided IDs.`,
            };
        }

        for (const id of idsArray) {
            if (hardDelete && client.delete) {
                await client.delete({ where: { id } });
            } else {
                await client.update({ where: { id }, data: { [softDeleteField]: new Date() } });
            }
        }

        revalidatePath(pathToRevalidate);

        return {
            success: true,
            message: `${model} items deleted successfully.`,
            data: null,
            error: '',
        };
    });
}

export async function getItems<T>(
    options: CrudOptions<T> & { include?: Record<string, any> },
    params?: { id?: string; filters?: Record<string, any> },
) {
    return executeWithCatch(async () => {
        const { model, softDeleteField, include } = options;
        const client = getModel(model);

        const where: Record<string, any> = {
            ...(softDeleteField ? { [softDeleteField as string]: null } : {}),
            ...(params?.filters ?? {}),
        };

        if (params?.id) {
            where.id = params.id;
            const item = await client.findFirst({ where, include });

            if (!item) {
                return {
                    success: false,
                    message: '',
                    data: null,
                    error: `${model} not found.`,
                };
            }

            return {
                success: true,
                message: `${model} fetched successfully.`,
                data: item as T,
                error: '',
            };
        } else {
            const list = await client.findMany({ where, include });
            return {
                success: true,
                message: `${model} list fetched successfully.`,
                data: list,
                error: '',
            };
        }
    });
}
