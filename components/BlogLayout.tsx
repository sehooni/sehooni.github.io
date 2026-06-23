"use client";

import Sidebar from './Sidebar';
import BlogPosts from './BlogPosts';
import { PostData } from '@/lib/posts';

interface BlogLayoutProps {
    posts: PostData[];
    categories: Record<string, number>;
}

export default function BlogLayout({ posts, categories }: BlogLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-col lg:flex-row w-full max-w-screen-2xl mx-auto items-start">
                <Sidebar categories={categories} />
                <main className="flex-1 w-full p-6 lg:p-12">
                    <BlogPosts posts={posts} />
                </main>
            </div>
        </div>
    );
}
