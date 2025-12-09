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

import TopNav from '@/components/TopNav';

// ... (existing imports)

export default async function Category({ params }: { params: Promise<{ category: string[] }> }) {
    // ... (existing logic)
    const { category } = await params;
    // decode title part for share buttons if needed, usually slug parts are url-encoded
    const decodedCategory = category.map(c => decodeURIComponent(c)).join('/');
    const allPostsData = getSortedPostsData();
    const categories = getCategories();


    const categoryPosts = allPostsData.filter(post => {
        // ... (filtering logic)
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
        <div className="min-h-screen flex flex-col">
            <TopNav title="Blog" />

            <div className="flex flex-col lg:flex-row w-full max-w-screen-2xl mx-auto">
                <Sidebar categories={categories} />
                <main className="flex-1 w-full p-6 lg:p-12">
                    <header className="mb-12 border-b pb-8">
                        <h1 className="text-4xl font-bold mb-4">Category: {decodedCategory}</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            {categoryPosts.length} posts found.
                        </p>
                    </header>

                    <div className="space-y-8">
                        {categoryPosts.map(({ slug, date, title }) => (
                            <article key={slug} className="group relative flex flex-col items-start border-b border-gray-100 dark:border-gray-800 pb-8 last:border-0 last:pb-0">
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
        </div>
    );
}
