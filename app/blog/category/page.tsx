import { getCategories } from '@/lib/posts';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { CATEGORY_ORDER, CATEGORY_DISPLAY_NAMES, CATEGORY_DESCRIPTIONS } from '@/lib/category-config';

const getCumulativeCount = (catPath: string, categories: Record<string, number>) => {
    return Object.entries(categories).reduce((sum, [path, count]) => {
        if (path === catPath || path.startsWith(`${catPath}/`)) {
            return sum + count;
        }
        return sum;
    }, 0);
};

export default function CategoryIndex() {
    const categories = getCategories();

    // Group categories by root
    const rootCategories: Record<string, {
        path: string;
        count: number;
        subcategories: { name: string; path: string; count: number }[];
    }> = {};

    Object.entries(categories).forEach(([path, count]) => {
        const parts = path.split('/');
        const root = parts[0];

        if (!rootCategories[root]) {
            rootCategories[root] = {
                path: root,
                count: 0,
                subcategories: []
            };
        }

        if (parts.length > 1) {
            rootCategories[root].subcategories.push({
                name: parts[parts.length - 1],
                path: path,
                count: count
            });
        }
    });

    // Calculate cumulative counts for roots
    Object.keys(rootCategories).forEach(root => {
        rootCategories[root].count = getCumulativeCount(root, categories);
    });

    // Sort root categories using CATEGORY_ORDER
    const sortedRoots = Object.values(rootCategories).sort((a, b) => {
        const indexA = CATEGORY_ORDER.indexOf(a.path);
        const indexB = CATEGORY_ORDER.indexOf(b.path);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.path.localeCompare(b.path);
    });

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-col lg:flex-row w-full max-w-screen-2xl mx-auto items-start">
                <Sidebar categories={categories} />
                <main className="flex-1 w-full p-6 lg:p-12">
                    <header className="mb-12 border-b pb-8">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl font-bold">Categories</h1>
                            <p className="text-lg text-gray-500 dark:text-gray-400">
                                Explore all topics and series written in this blog.
                            </p>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sortedRoots.map((root) => {
                            const displayName = CATEGORY_DISPLAY_NAMES[root.path] || root.path;
                            const description = CATEGORY_DESCRIPTIONS[root.path] || `Posts related to ${root.path}`;

                            return (
                                <div
                                    key={root.path}
                                    className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <h2 className="text-2xl font-bold group-hover:text-[#4D7CFF] transition-colors">
                                                <Link href={`/blog/category/${root.path}/`}>
                                                    {displayName}
                                                </Link>
                                            </h2>
                                            <span className="text-xs font-semibold px-2.5 py-1 bg-[#4D7CFF]/10 text-[#4D7CFF] rounded-full">
                                                {root.count} {root.count === 1 ? 'post' : 'posts'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                            {description}
                                        </p>
                                    </div>

                                    {root.subcategories.length > 0 && (
                                        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-auto">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
                                                Subcategories
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {root.subcategories.map((sub) => (
                                                    <Link
                                                        key={sub.path}
                                                        href={`/blog/category/${sub.path}/`}
                                                        className="text-xs px-2.5 py-1 bg-gray-50 hover:bg-[#4D7CFF]/10 dark:bg-gray-800 dark:hover:bg-[#4D7CFF]/10 text-gray-600 hover:text-[#4D7CFF] dark:text-gray-400 dark:hover:text-[#4D7CFF] rounded-lg transition-colors border border-gray-100 dark:border-gray-800"
                                                    >
                                                        {CATEGORY_DISPLAY_NAMES[sub.name] || sub.name} ({sub.count})
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>
        </div>
    );
}
