import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid gender id' }, { status: 400 });
        }

        const existing = await prisma.gender.findUnique({ where: { id } });

        if (!existing) {
            return NextResponse.json({ error: 'Gender not found' }, { status: 404 });
        }

        const deleted = await prisma.gender.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return NextResponse.json(deleted);
    } catch (error) {
        console.error('[GENDER_DELETE]', error);
        return NextResponse.json({ error: 'Failed to delete gender' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid gender id' }, { status: 400 });
        }

        const body = await req.json();
        const { name } = body;

        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: 'Invalid gender name' }, { status: 400 });
        }

        const existing = await prisma.gender.findFirst({
            where: {
                name,
                NOT: { id },
            },
        });

        if (existing) {
            return NextResponse.json({ error: 'Gender name already exists' }, { status: 409 });
        }

        const gender = await prisma.gender.update({
            where: { id },
            data: { name },
        });

        return NextResponse.json(gender);
    } catch (error) {
        console.error('[GENDER_PATCH]', error);
        return NextResponse.json({ error: 'Failed to update gender' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name } = body;

        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: 'Invalid gender name' }, { status: 400 });
        }

        const existing = await prisma.gender.findUnique({ where: { name } });

        if (existing) {
            return NextResponse.json({ error: 'Gender name already exists' }, { status: 409 });
        }

        const gender = await prisma.gender.create({
            data: { name },
        });

        return NextResponse.json(gender);
    } catch (error) {
        console.error('[GENDER_POST]', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (id) {
            const gender = await prisma.gender.findUnique({
                where: { id },
            });

            if (!gender) {
                return NextResponse.json({ error: 'Gender not found' }, { status: 404 });
            }

            return NextResponse.json(gender);
        }

        const genders = await prisma.gender.findMany();
        return NextResponse.json(genders);
    } catch (error) {
        console.error('[GENDER_GET]', error);
        return NextResponse.json({ error: 'Failed to fetch gender list' }, { status: 500 });
    }
}
