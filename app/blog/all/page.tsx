import { Suspense } from 'react';
import { getSortedPostsData, getCategories } from '@/lib/posts';
import BlogLayout from '@/components/BlogLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'All Posts | Blog',
    description: 'Archive of all technical blog posts.',
    alternates: {
        canonical: 'https://sehooni.github.io/blog/all/',
    },
};

export default function BlogAll() {
    const allPosts = getSortedPostsData();
    const categories = getCategories();

    return (
        <Suspense fallback={<div className="min-h-screen p-6 text-gray-500">Loading posts...</div>}>
            <BlogLayout posts={allPosts} categories={categories} mode="all" />
        </Suspense>
    );
}
