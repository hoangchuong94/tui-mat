'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { GenderModalSchema } from '@/schema/product';
import prisma from '@/lib/prisma';

export async function createGender(values: z.infer<typeof GenderModalSchema>) {
    try {
        const validated = GenderModalSchema.safeParse(values);

        if (!validated.success) {
            return {
                success: false,
                message: '',
                error: 'Invalid data',
            };
        }

        const existed = await prisma.gender.findFirst({
            where: {
                name: { equals: validated.data.name, mode: 'insensitive' },
            },
        });

        if (existed) {
            return {
                success: false,
                message: '',
                error: 'Gender already exists',
            };
        }

        await prisma.gender.create({ data: validated.data });
        revalidatePath('/dashboard/product/new');

        return {
            success: true,
            message: 'Gender created successfully',
            error: '',
        };
    } catch (err) {
        console.error('[CreateGenderError]', err);

        return {
            success: false,
            message: '',
            error: 'Internal Server Error',
        };
    }
}

export async function updateGender(id: string, values: z.infer<typeof GenderModalSchema>) {
    const validated = GenderModalSchema.safeParse(values);

    if (!validated.success) {
        return {
            success: false,
            message: '',
            error: 'Invalid data',
        };
    }

    try {
        const gender = await prisma.gender.findUnique({
            where: { id },
        });

        if (!gender) {
            return {
                success: false,
                message: '',
                error: 'Gender not found',
            };
        }

        const existingName = await prisma.gender.findFirst({
            where: {
                name: validated.data.name,
                NOT: { id },
            },
        });

        if (existingName) {
            return {
                success: false,
                message: '',
                error: 'Gender name already exists',
            };
        }

        await prisma.gender.update({
            where: { id },
            data: { name: validated.data.name },
        });

        revalidatePath('/dashboard/product/new');

        return {
            success: true,
            message: 'Gender updated successfully',
            error: '',
        };
    } catch (err) {
        console.error('[UpdateGenderError]', err);

        return {
            success: false,
            message: '',
            error: 'Internal Server Error',
        };
    }
}

export async function deleteGender(id: string) {
    if (!id) {
        return {
            success: false,
            message: '',
            error: 'Invalid data',
        };
    }
    try {
        const gender = await prisma.gender.findUnique({
            where: { id },
        });

        if (!gender) {
            return {
                success: false,
                message: '',
                error: 'Gender not found',
            };
        }

        await prisma.gender.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });

        revalidatePath('/dashboard/product/new');

        return {
            success: true,
            message: 'Gender deleted successfully',
            error: '',
        };
    } catch (err) {
        console.error('[DeleteGenderError]', err);

        return {
            success: false,
            message: '',
            error: 'Internal Server Error',
        };
    }
}
