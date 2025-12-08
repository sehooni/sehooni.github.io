"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { format } from 'date-fns';
import { PostData } from '@/lib/posts';
import { FaSearch } from 'react-icons/fa';

interface SearchablePostListProps {
    initialPosts: PostData[];
}

export default function SearchablePostList({ initialPosts }: SearchablePostListProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize from URL or default to empty
    // We use a separate state to control the input immediately
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    // Sync URL with search term (debounced slightly or just effect)
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
            params.set('q', searchTerm);
        } else {
            params.delete('q');
        }

        // Update URL without full reload
        // replace to avoid building huge history stack
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchTerm, pathname, router, searchParams]);

    const filteredPosts = useMemo(() => {
        if (!searchTerm.trim()) return initialPosts;

        const lowerTerm = searchTerm.toLowerCase();
        return initialPosts.filter(post => {
            const titleMatch = post.title.toLowerCase().includes(lowerTerm);
            const excerptMatch = (post.excerpt || '').toLowerCase().includes(lowerTerm);
            const categoryMatch = (post.category || '').toLowerCase().includes(lowerTerm);
            // If we have tags in posts, we should search them too.
            // Check if tags exists and is an array
            const tagsMatch = Array.isArray(post.tags) && post.tags.some((tag: string) => tag.toLowerCase().includes(lowerTerm));

            return titleMatch || excerptMatch || categoryMatch || tagsMatch;
        });
    }, [initialPosts, searchTerm]);

    return (
        <div className="space-y-8">
            {/* Search Input */}
            <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaSearch />
                </div>
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                {searchTerm && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>

            {/* Post List */}
            <div className="space-y-12">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <article key={post.slug} className="flex flex-col group">
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
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        No posts found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    );
}
