import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

export async function GET() {
    try {
        const genders = await prisma.gender.findMany();
        return NextResponse.json(genders);
    } catch (error) {
        console.error('[GENDER_GET]', error);
        return NextResponse.json({ error: 'Failed to fetch gender list' }, { status: 500 });
    }
}
