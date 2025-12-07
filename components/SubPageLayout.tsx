import Link from 'next/link';

export default function SubPageLayout({
    children,
    title,
}: {
    children: React.ReactNode;
    title: string;
}) {
    return (
        <div className="max-w-4xl mx-auto w-full p-8">
            <header className="flex flex-col md:flex-row justify-between items-center mb-12 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
                    {title}
                </h1>
                <nav className="flex space-x-6 text-sm uppercase tracking-wide">
                    <Link href="/" className="hover:text-purple-700 transition-colors pointer-events-auto">Home</Link>
                    <Link href="/blog" className="hover:text-purple-700 transition-colors pointer-events-auto">Blog</Link>
                    <Link href="/projects" className="hover:text-purple-700 transition-colors pointer-events-auto">Projects</Link>
                    <Link href="/about" className="hover:text-purple-700 transition-colors pointer-events-auto">About</Link>
                    <Link href="/resume" className="hover:text-purple-700 transition-colors pointer-events-auto">Résumé</Link>
                </nav>
            </header>
            <main>
                {children}
            </main>
        </div>
    );
}
