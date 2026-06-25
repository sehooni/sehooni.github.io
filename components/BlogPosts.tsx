"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PostData } from '@/lib/posts';

interface BlogPostsProps {
    posts: PostData[];
    mode?: 'landing' | 'all';
}

export default function BlogPosts({ posts, mode = 'all' }: BlogPostsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchQuery = searchParams ? searchParams.get('q') || '' : '';

    const [currentPage, setCurrentPage] = useState(1);
    const POSTS_PER_PAGE = 10;

    // Reset to page 1 when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

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
    const featuredPost = (mode === 'landing') && isSearchEmpty && posts.length > 0 ? posts[0] : null;

    // Posts to be listed in the pagination area
    const listPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

    const totalPages = Math.ceil(listPosts.length / POSTS_PER_PAGE);

    const currentPosts = listPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    // Dynamic Popular posts mapping
    const popularPostSlugs = [
        "Projects/Hackathon/gemini-3-seoul-hackathon-alpha-agent",
        "Projects/Hackathon/ai-hackathon-2025-lg-aimers-7-ai-hackathon",
        "AI/LLM/LangChain-introduction"
    ];

    const popularPosts = popularPostSlugs
        .map(slug => posts.find(p => p.slug === slug))
        .filter((post): post is PostData => !!post);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearSearch = () => {
        router.push('/blog/all');
    };

    if (mode === 'landing') {
        return (
            <div className="space-y-10">
                {/* Description Banner - Swapped position to the very top */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400">
                        Writing about technology, learning, experience and especially AI.
                    </p>
                </div>

                {/* Featured Hero Area (Latest + Popular Grid) - Positioned below the banner */}
                {featuredPost && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Side: Latest Post Card */}
                        <Link
                            href={`/blog/${featuredPost.slug}/`}
                            className="group flex flex-col justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-8 transition-all duration-300 hover:border-purple-500 dark:hover:border-purple-600 hover:shadow-md h-full"
                        >
                            <div>
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
                                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors mb-3 leading-tight line-clamp-2">
                                    {featuredPost.title}
                                </h2>
                                {featuredPost.excerpt && (
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {featuredPost.excerpt}
                                    </p>
                                )}
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 dark:text-purple-400 group-hover:underline mt-4">
                                Read post <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>

                        {/* Right Side: Popular Posts Card */}
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-8 flex flex-col justify-between h-full">
                            <div>
                                <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-400">
                                        ★ Popular
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">인기 포스트</span>
                                </div>
                                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {popularPosts.map((post) => (
                                        <Link
                                            key={post.slug}
                                            href={`/blog/${post.slug}/`}
                                            className="group/item block py-3.5 first:pt-0 last:pb-0"
                                        >
                                            <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover/item:text-purple-700 dark:group-hover/item:text-purple-400 transition-colors line-clamp-2 leading-snug">
                                                {post.title}
                                            </h3>
                                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <time dateTime={post.date}>
                                                    {post.date ? format(new Date(post.date), 'MMM d, yyyy') : ''}
                                                </time>
                                                {post.category && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="capitalize">{post.category.split('/').pop()}</span>
                                                    </>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Link to All Posts (Yellow Box position replacement) */}
                <div className="flex justify-center pt-8 border-t border-gray-100 dark:border-gray-800 mt-8">
                    <Link
                        href="/blog/all"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-700 hover:bg-purple-800 text-white font-semibold transition-all shadow-sm hover:shadow-md group"
                    >
                        <span>전체글 보기</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        );
    }

    // Default mode === 'all'
    return (
        <div className="space-y-10">
            {/* Search feedback */}
            {!isSearchEmpty && (
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Found {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} matching &ldquo;{searchQuery}&rdquo;
                </div>
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
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
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
