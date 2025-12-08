import Link from 'next/link';
import { getSortedPostsData, getCategories, PostData } from '@/lib/posts';
import Sidebar from '@/components/Sidebar';
import SearchablePostList from '@/components/SearchablePostList';

export default function Blog() {
    const posts = getSortedPostsData();
    const categories = getCategories();
    const recentPosts = posts.slice(0, 5);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            <Sidebar categories={categories} recentPosts={recentPosts} />
            <main className="flex-1 w-full max-w-4xl mx-auto p-6 lg:p-12">
                <header className="mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Blog</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Writing about technology, learning, experience and especially AI.
                    </p>
                </header>

                <SearchablePostList initialPosts={posts} />
            </main>
        </div>
    );
}
