import Link from 'next/link';
import { getSortedPostsData, getCategories } from '@/lib/posts';
import { format } from 'date-fns';
import Sidebar from '@/components/Sidebar';

export async function generateStaticParams() {
    const categories = getCategories();
    return Object.keys(categories).map((category) => ({
        category: category,
    }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const decodedCategory = decodeURIComponent(category);
    const allPostsData = getSortedPostsData();
    const categories = getCategories();
    const recentPosts = allPostsData.slice(0, 5);

    const categoryPosts = allPostsData.filter(post =>
        post.category === decodedCategory || (post.categories && post.categories.includes(decodedCategory))
    );

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            <Sidebar categories={categories} recentPosts={recentPosts} />
            <main className="flex-1 w-full max-w-4xl mx-auto p-6 lg:p-12">
                <header className="mb-12 border-b pb-8">
                    <h1 className="text-4xl font-bold mb-4">Category: {decodedCategory}</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        {categoryPosts.length} posts found.
                    </p>
                </header>

                <div className="space-y-8">
                    {categoryPosts.map(({ slug, date, title }) => (
                        <article key={slug} className="group relative flex flex-col items-start">
                            <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                <Link href={`/${slug}`}>
                                    <span className="absolute inset-0" />
                                    {title}
                                </Link>
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <time dateTime={date}>{format(new Date(date), 'MMMM d, yyyy')}</time>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}
