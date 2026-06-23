"use client";

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';
import { PostData } from '@/lib/posts';

interface BlogPostsProps {
    posts: PostData[];
}

export default function BlogPosts({ posts }: BlogPostsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const POSTS_PER_PAGE = 10;

    // Search filter logic
    const filteredPosts = posts.filter((post) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;

        const titleMatch = post.title?.toLowerCase().includes(query);
        const excerptMatch = post.excerpt?.toLowerCase().includes(query);
        const contentMatch = post.content?.toLowerCase().includes(query);
        const categoryMatch = post.category?.toLowerCase().includes(query);
        const tagMatch = post.tags?.some((tag: string) => tag.toLowerCase().includes(query));

        return titleMatch || excerptMatch || contentMatch || categoryMatch || tagMatch;
    });

    // When search is empty, the first post is highlighted as Featured (Latest)
    // and pagination is applied to the remaining posts.
    const isSearchEmpty = searchQuery.trim() === '';
    const featuredPost = isSearchEmpty && posts.length > 0 ? posts[0] : null;

    // Posts to be listed in the pagination area
    const listPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

    const totalPages = Math.ceil(listPosts.length / POSTS_PER_PAGE);

    const currentPosts = listPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const clearSearch = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };

    return (
        <div className="space-y-10">
            {/* Search Bar */}
            <div className="relative w-full max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search posts by title, tag, or content..."
                    className="w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent transition-all"
                />
                {searchQuery && (
                    <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        aria-label="Clear search"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Search feedback */}
            {!isSearchEmpty && (
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Found {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} matching &ldquo;{searchQuery}&rdquo;
                </div>
            )}

            {/* Featured Post Card */}
            {featuredPost && (
                <Link
                    href={`/blog/${featuredPost.slug}/`}
                    className="group block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-8 transition-all duration-300 hover:border-purple-500 dark:hover:border-purple-600 hover:shadow-md"
                >
                    <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-black dark:bg-white px-3 py-1 text-xs font-semibold text-white dark:text-black">
                            <BookOpen size={13} /> Latest
                        </span>
                        <time dateTime={featuredPost.date}>
                            {featuredPost.date ? format(new Date(featuredPost.date), 'MMMM d, yyyy') : ''}
                        </time>
                        {featuredPost.category && (
                            <>
                                <span>•</span>
                                <span className="font-medium text-purple-700 dark:text-purple-400 capitalize">{featuredPost.category}</span>
                            </>
                        )}
                    </div>
                    <h2 className="max-w-3xl text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors mb-3 leading-tight">
                        {featuredPost.title}
                    </h2>
                    {featuredPost.excerpt && (
                        <p className="max-w-2xl text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
                            {featuredPost.excerpt}
                        </p>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 dark:text-purple-400 group-hover:underline">
                        Read post <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </Link>
            )}

            {/* Blog Post List */}
            {currentPosts.length > 0 ? (
                <div className="space-y-10">
                    {currentPosts.map((post) => (
                        <article
                            key={post.slug}
                            className="flex flex-col group border-b border-gray-100 dark:border-gray-800 pb-10 last:border-0 last:pb-0"
                        >
                            <Link href={`/blog/${post.slug}/`} className="block">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                                    {post.title}
                                </h2>
                            </Link>
                            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <time dateTime={post.date}>
                                    {post.date ? format(new Date(post.date), 'MMMM d, yyyy') : ''}
                                </time>
                                {post.category && (
                                    <>
                                        <span>•</span>
                                        <span className="text-purple-700 dark:text-purple-400 font-medium capitalize">{post.category}</span>
                                    </>
                                )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                                {post.excerpt || "Click to read more..."}
                            </p>
                            <Link
                                href={`/blog/${post.slug}/`}
                                className="inline-flex items-center gap-1.5 mt-4 text-purple-700 dark:text-purple-400 font-semibold hover:underline"
                            >
                                Read more <ArrowRight size={14} />
                            </Link>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No posts found matching your search.</p>
                    <button
                        onClick={clearSearch}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-lg transition-colors font-medium text-sm"
                    >
                        Clear search filter
                    </button>
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-6">
                    {currentPage > 1 && (
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                            aria-label="Previous page"
                        >
                            &lt;
                        </button>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={`px-3 py-1 rounded border transition-colors ${currentPage === p
                                ? 'bg-purple-700 dark:bg-purple-600 text-white border-purple-700 dark:border-purple-600 font-medium'
                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            {p}
                        </button>
                    ))}

                    {currentPage < totalPages && (
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                            aria-label="Next page"
                        >
                            &gt;
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

