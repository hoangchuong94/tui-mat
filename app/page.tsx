import { auth, signOut } from '@/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Home() {
    const session = await auth();

    if (!session) {
        return (
            <main className="flex h-screen flex-col bg-slate-200">
                <div className="p-4">
                    <Button type="submit" asChild>
                        <Link className="float-right" href={'/sign-in'}>
                            Sign In
                        </Link>
                    </Button>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <span>Not authenticated</span>
                </div>
            </main>
        );
    }
    return (
        <main className="flex h-screen flex-col bg-slate-200">
            <form
                className="p-4"
                action={async () => {
                    'use server';
                    await signOut();
                }}
            >
                <Button className="float-right" type="submit">
                    Sign Out
                </Button>
            </form>
            <div className="flex flex-1 items-center justify-center">
                <div>{session.user && <pre>{JSON.stringify(session, null, 2)}</pre>}</div>
            </div>
        </main>
    );
}
