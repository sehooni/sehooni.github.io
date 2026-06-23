import { Suspense } from 'react';
import { getSortedPostsData, getCategories } from '@/lib/posts';
import BlogLayout from '@/components/BlogLayout';

export default function Blog() {
    const allPosts = getSortedPostsData();
    const categories = getCategories();

    return (
        <Suspense fallback={<div className="min-h-screen p-6 text-gray-500">Loading blog...</div>}>
            <BlogLayout posts={allPosts} categories={categories} />
        </Suspense>
    );
}
