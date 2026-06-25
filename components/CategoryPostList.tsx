'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface PostData {
    slug: string;
    date: string;
    title: string;
    excerpt?: string;
    category?: string;
    categories?: string[];
}

interface CategoryPostListProps {
    posts: PostData[];
}

const POSTS_PER_PAGE = 10;

export default function CategoryPostList({ posts }: CategoryPostListProps) {
    const searchParams = useSearchParams();
    const currentPageString = searchParams.get('page');
    const currentPage = currentPageString ? parseInt(currentPageString, 10) : 1;

    // Validate page range
    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));

    // Slice posts
    const startIndex = (validPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    if (totalPosts === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No posts found in this category.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10">
            {/* Posts List */}
            <div className="space-y-10">
                {paginatedPosts.map(({ slug, date, title, excerpt, category }) => (
                    <article key={slug} className="flex flex-col group border-b border-gray-100 dark:border-gray-800 pb-10 last:border-0 last:pb-0">
                        <Link href={`/blog/${slug}/`} className="block">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                                {title}
                            </h2>
                        </Link>
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <time dateTime={date}>{format(new Date(date), 'MMMM d, yyyy')}</time>
                            {category && (
                                <>
                                    <span>•</span>
                                    <span className="text-purple-700 dark:text-purple-400 font-medium capitalize">
                                        {category.split('/').pop()}
                                    </span>
                                </>
                            )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                            {excerpt || "Click to read more..."}
                        </p>
                        <Link
                            href={`/blog/${slug}/`}
                            className="inline-flex items-center gap-1.5 mt-4 text-purple-700 dark:text-purple-400 font-semibold hover:underline"
                        >
                            Read more <ArrowRight size={14} />
                        </Link>
                    </article>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <nav className="flex justify-center items-center gap-2 pt-6 border-t border-gray-100 dark:border-gray-800" aria-label="Pagination">
                    {/* Previous Button */}
                    {validPage > 1 ? (
                        <Link
                            href={`?page=${validPage - 1}`}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-purple-700 dark:hover:text-purple-400 transition-all duration-200"
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                    ) : (
                        <span className="p-2 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed">
                            <ChevronLeft className="w-5 h-5" />
                        </span>
                    )}

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                            const isActive = pageNum === validPage;
                            return (
                                <Link
                                    key={pageNum}
                                    href={`?page=${pageNum}`}
                                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? 'bg-purple-700 dark:bg-purple-600 text-white border border-purple-700 dark:border-purple-600'
                                            : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-purple-700 dark:hover:text-purple-400'
                                    }`}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {pageNum}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Next Button */}
                    {validPage < totalPages ? (
                        <Link
                            href={`?page=${validPage + 1}`}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-purple-700 dark:hover:text-purple-400 transition-all duration-200"
                            aria-label="Next page"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    ) : (
                        <span className="p-2 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed">
                            <ChevronRight className="w-5 h-5" />
                        </span>
                    )}
                </nav>
            )}
        </div>
    );
}
