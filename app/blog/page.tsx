import Link from 'next/link';
import { getSortedPostsData, getCategories, PostData } from '@/lib/posts';
import Sidebar from '@/components/Sidebar';
import { format } from 'date-fns';
import TopNav from '@/components/TopNav';

export default function Blog() {
    const posts = getSortedPostsData();
    const categories = getCategories();
    const recentPosts = posts.slice(0, 5);

    return (
        <div className="min-h-screen flex flex-col">
            <TopNav title="Blog" />

            <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto">
                <Sidebar categories={categories} recentPosts={recentPosts} />
                <main className="flex-1 w-full p-6 lg:p-12">
                    {/* Header 'Blog' removed as it's in TopNav now, or kept as page title? TopNav has title 'Blog'. So maybe reduce redundancy. */}
                    {/* User image shows 'Résumé' as big text on left of Nav. */}
                    {/* My TopNav code has the title. */}
                    <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-gray-600 dark:text-gray-400">
                            Writing about technology, learning, experience and especially AI.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {posts.map((post) => (
                            <article key={post.slug} className="flex flex-col group border-b border-gray-100 dark:border-gray-800 pb-12 last:border-0">
                                <Link href={`/${post.slug}/`} className="block">
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
                                    href={`/${post.slug}/`}
                                    className="inline-block mt-4 text-primary font-medium hover:underline"
                                >
                                    Read more →
                                </Link>
                            </article>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
