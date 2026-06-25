import { Suspense } from 'react';
import { getSortedPostsData, getCategories } from '@/lib/posts';
import BlogLayout from '@/components/BlogLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Technical blog posts on AI, Deep Learning, Protein Structure Prediction, and Bioinformatics.',
    alternates: {
        canonical: 'https://sehooni.github.io/blog/',
    },
};

export default function Blog() {
    const allPosts = getSortedPostsData();
    const categories = getCategories();

    return (
        <Suspense fallback={<div className="min-h-screen p-6 text-gray-500">Loading blog...</div>}>
            <BlogLayout posts={allPosts} categories={categories} mode="landing" />
        </Suspense>
    );
}
