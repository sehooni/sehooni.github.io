import { getSortedPostsData, getCategories } from '@/lib/posts';
import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
    const allPosts = getSortedPostsData();
    const categories = getCategories();
    const baseUrl = 'https://sehooni.github.io';

    // Base routes
    const routes = [
        '',
        '/about',
        '/blog',
        '/projects',
        '/resume',
    ].map((route) => ({
        url: `${baseUrl}${route}${route === '' ? '' : '/'}`, // Ensure trailing slash for pages (except root which usually has it implicitly, but let's be consistent)
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Post routes
    const postRoutes = allPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}/`, // Explicit trailing slash with /blog prefix
        lastModified: new Date(post.date).toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Category routes
    const categoryRoutes = Object.keys(categories).map((category) => ({
        url: `${baseUrl}/blog/category/${category}/`, // Explicit trailing slash with /blog/category prefix
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...routes, ...postRoutes, ...categoryRoutes];
}
