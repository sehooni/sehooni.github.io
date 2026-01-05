import { getSortedPostsData, getCategories } from '@/lib/posts';
import Sidebar from '@/components/Sidebar';
import BlogPosts from '@/components/BlogPosts';

export default function Blog() {
    const allPosts = getSortedPostsData();
    const categories = getCategories();

    return (
        <div className="min-h-screen flex flex-col">

            <div className="flex flex-col lg:flex-row w-full max-w-screen-2xl mx-auto items-start">
                <Sidebar categories={categories} />
                <main className="flex-1 w-full p-6 lg:p-12">
                    <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-600 dark:text-gray-400">
                            Writing about technology, learning, experience and especially AI.
                        </p>
                    </div>

                    <BlogPosts posts={allPosts} />
                </main>
            </div>
        </div>
    );
}
