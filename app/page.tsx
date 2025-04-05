import { auth } from '@/auth';

export default async function Home() {
    const session = await auth();

    if (!session) {
        return <div>Not authenticated</div>;
    }
    return (
        <main>
            <div className="flex h-screen items-center justify-center">
                <div>{session.user && <pre>{JSON.stringify(session, null, 2)}</pre>}</div>
            </div>
        </main>
    );
}
