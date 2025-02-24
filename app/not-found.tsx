import Link from 'next/link';
import { Frown } from 'lucide-react';
import { NextRequest, NextResponse } from 'next/server';

export default async function NotFound(
    request: NextRequest,
    response: NextResponse,
) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-2">
            <Frown className="w-10 text-gray-400" />
            <h2 className="text-xl font-semibold">404 Not Found</h2>
            <p>Could not find the requested.</p>
            <Link
                href="/"
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
            >
                Go Back
            </Link>
        </main>
    );
}
