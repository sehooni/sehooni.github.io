import { getSortedPostsData, getCategories } from '@/lib/posts';
import BlogLayout from '@/components/BlogLayout';

export default function Blog() {
    const allPosts = getSortedPostsData();
    const categories = getCategories();

    return <BlogLayout posts={allPosts} categories={categories} />;
}
