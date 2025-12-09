"use client";

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { PostData } from '@/lib/posts';

interface BlogPostsProps {
    posts: PostData[];
}

export default function BlogPosts({ posts }: BlogPostsProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const POSTS_PER_PAGE = 10;
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

    const currentPosts = posts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (posts.length === 0) {
        return <div className="text-gray-500">No posts found.</div>;
    }

    return (
        <>
            <div className="space-y-12">
                {currentPosts.map((post) => (
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                    {currentPage > 1 && (
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Previous page"
                        >
                            &lt;
                        </button>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={`px-3 py-1 rounded border ${currentPage === p
                                    ? 'bg-primary text-white border-primary'
                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                                } transition-colors`}
                        >
                            {p}
                        </button>
                    ))}

                    {currentPage < totalPages && (
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Next page"
                        >
                            &gt;
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
