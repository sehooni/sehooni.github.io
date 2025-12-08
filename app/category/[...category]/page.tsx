import Link from 'next/link';
import { getSortedPostsData, getCategories } from '@/lib/posts';
import { format } from 'date-fns';
import Sidebar from '@/components/Sidebar';

export async function generateStaticParams() {
    const categories = getCategories();
    // Use a Set to store unique paths including intermediates
    const allPaths = new Set<string>();

    Object.keys(categories).forEach((category) => {
        const parts = category.split('/');
        // Add all intermediate paths
        // e.g. "Projects/AI_Contest" -> adds "Projects" and "Projects/AI_Contest"
        parts.forEach((_, index) => {
            const path = parts.slice(0, index + 1).join('/');
            allPaths.add(path);
        });
    });

    return Array.from(allPaths).map((category) => ({
        category: category.split('/'),
    }));
}

export default async function Category({ params }: { params: Promise<{ category: string[] }> }) {
    const { category } = await params;
    // category is array: ['Projects', 'AI_Contest']
    // Decode and join to match the keys in our categories object/post.category
    const decodedCategory = category.map(c => decodeURIComponent(c)).join('/');
    const allPostsData = getSortedPostsData();
    const categories = getCategories();
    const recentPosts = allPostsData.slice(0, 5);

    const categoryPosts = allPostsData.filter(post => {
        // Match exact category OR subcategories
        // e.g. decodedCategory="DL", post.category="DL/NLP" -> should match
        // Check if post.category starts with decodedCategory AND is followed by a separator or end of string
        // But since we use '/' as separator and it is consistent:
        if (!post.category) return false;

        const isDirectMatch = post.category === decodedCategory;
        const isSubCategory = post.category.startsWith(`${decodedCategory}/`);

        // Also check legacy multiple categories array if it exists (though we primarily use string category now)
        const isIncludedInList = post.categories && post.categories.some(c =>
            c === decodedCategory || c.startsWith(`${decodedCategory}/`)
        );

        return isDirectMatch || isSubCategory || isIncludedInList;
    }).sort((a, b) => {
        // Sort by date DESCENDING (Newest first)
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
    });

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
                                <Link href={`/${slug}/`}>
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
