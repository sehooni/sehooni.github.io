import Link from 'next/link';
import { getSortedPostsData, getCategories, PostData } from '@/lib/posts';
import Sidebar from '@/components/Sidebar';
import { format } from 'date-fns';

export default function Blog() {
    const posts = getSortedPostsData();
    const categories = getCategories();

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            <Sidebar categories={categories} />
            <main className="flex-1 w-full max-w-4xl mx-auto p-6 lg:p-12">
                <header className="mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Blog</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Writing about technology, learning, and life.
                    </p>
                </header>

                <div className="space-y-12">
                    {posts.map((post) => (
                        <article key={post.slug} className="flex flex-col group">
                            <Link href={`/${post.slug}`} className="block">
                                <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                                    {post.title}
                                </h2>
                            </Link>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <time dateTime={post.date}>
                                    {format(new Date(post.date), 'MMMM d, yyyy')}
                                </time>
                                {post.category && (
                                    <>
                                        <span>•</span>
                                        <span className="text-primary font-medium">{post.category}</span>
                                    </>
                                )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                                {post.excerpt || "Click to read more..."}
                            </p>
                            <Link
                                href={`/${post.slug}`}
                                className="inline-block mt-4 text-primary font-medium hover:underline"
                            >
                                Read more →
                            </Link>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}
