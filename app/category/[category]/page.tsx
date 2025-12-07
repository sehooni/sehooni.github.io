import Link from 'next/link';
import { getSortedPostsData, getCategories } from '@/lib/posts';
import { format } from 'date-fns';

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
    const categoryPosts = allPostsData.filter(post =>
        post.category === decodedCategory || (post.categories && post.categories.includes(decodedCategory))
    );

    return (
        <div className="max-w-3xl mx-auto">
            <header className="mb-12 border-b pb-8">
                <h1 className="text-4xl font-bold mb-4">Category: {decodeURIComponent(category)}</h1>
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
        </div>
    );
}
