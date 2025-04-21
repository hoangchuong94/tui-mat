import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, genderId } = body;

        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: 'Invalid category name' }, { status: 400 });
        }

        const existing = await prisma.category.findUnique({ where: { name } });

        if (existing) {
            return NextResponse.json({ error: 'Category name already exists' }, { status: 409 });
        }

        const category = await prisma.category.create({
            data: {
                name,
                gender: {
                    connect: { id: genderId },
                },
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('[CATEGORY_POST]', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (id) {
            const category = await prisma.category.findUnique({
                where: { id },
            });

            if (!category) {
                return NextResponse.json({ error: 'Category not found' }, { status: 404 });
            }

            return NextResponse.json(category);
        }

        const categories = await prisma.category.findMany();
        return NextResponse.json(categories);
    } catch (error) {
        console.error('[CATEGORY_GET]', error);
        return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, name, genderId } = body;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid category id' }, { status: 400 });
        }

        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                gender: {
                    connect: { id: genderId },
                },
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('[CATEGORY_PATCH]', error);
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}
