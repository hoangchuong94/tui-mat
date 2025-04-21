'use server';

import { revalidatePath } from 'next/cache';
import { CreateGender } from '@/schema/product';
import prisma from '@/lib/prisma';

export async function createGender(values: unknown) {
    const validated = CreateGender.safeParse(values);

    if (!validated.success) {
        throw new Error('Dữ liệu không hợp lệ');
    }

    const { name } = validated.data;

    const existed = await prisma.gender.findFirst({
        where: {
            name: {
                equals: name,
                mode: 'insensitive',
            },
        },
    });

    if (existed) {
        throw new Error('Gender đã tồn tại');
    }

    await prisma.gender.create({
        data: { name },
    });

    revalidatePath('/dashboard/product/new');
}

export async function updateGender(id: string, values: unknown) {
    const validated = CreateGender.safeParse(values);

    if (!validated.success) {
        throw new Error('Dữ liệu không hợp lệ');
    }

    const gender = await prisma.gender.findUnique({
        where: { id },
    });

    if (!gender) {
        throw new Error('Gender không tồn tại');
    }

    await prisma.gender.update({
        where: { id },
        data: { name: validated.data.name },
    });

    revalidatePath('/dashboard/product/new');
}

export async function deleteGender(id: string) {
    const gender = await prisma.gender.findUnique({
        where: { id },
    });

    if (!gender) {
        throw new Error('Gender không tồn tại');
    }

    await prisma.gender.delete({
        where: { id },
    });

    revalidatePath('/dashboard/product/new');
}
