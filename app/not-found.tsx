import Link from 'next/link';
import TopNav from '@/components/TopNav';
import NotFoundRedirect from '@/components/NotFoundRedirect';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center">
            <TopNav title="404" />

            <main className="flex-1 w-full max-w-xl mx-auto p-8 flex flex-col items-center justify-center text-center">
                {/* Logic to attempt redirect for legacy URLs */}
                <NotFoundRedirect />

                <h2 className="text-6xl font-black text-gray-200 dark:text-gray-800 mb-6">404</h2>
                <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                    The page you are looking for might have been moved, deleted, or possibly never existed.
                </p>

                <Link
                    href="/"
                    className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                    Return Home
                </Link>
            </main>
        </div>
    );
}
