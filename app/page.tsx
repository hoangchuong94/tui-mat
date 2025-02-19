import { auth } from '@/auth';

export default async function Home() {
    const session = await auth();

    if (!session) {
        return <div>Not authenticated</div>;
    }
    return (
        <main>
            <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
                <div className="container">
                    <pre>{JSON.stringify(session, null, 2)}</pre>
                </div>
            </div>
        </main>
    );
}
