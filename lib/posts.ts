import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostData {
    slug: string; // Keep as string for links, e.g. "category/title"
    slugArray: string[]; // For localized params, e.g. ["category", "title"]
    title: string;
    date: string;
    category?: string;
    categories?: string[];
    content: string;
    [key: string]: any;
}

export function getSortedPostsData(): PostData[] {
    const allPosts: PostData[] = [];

    function traverseDirectory(dir: string) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                traverseDirectory(fullPath);
            } else if (file.endsWith('.md')) {
                // Determine category from directory name relative to postsDirectory
                const relativeDir = path.relative(postsDirectory, dir);
                // If the file is directly in postsDirectory, relativeDir is ''
                const category = relativeDir || 'uncategorized';

                // Strip Date from Filename: YYYY-MM-DD-Title.md -> Title
                const fileName = file.replace(/\.md$/, '');
                const titleMatch = fileName.match(/^\d{4}-\d{2}-\d{2}-(.*)$/);
                const titleSlug = titleMatch ? titleMatch[1] : fileName;

                // Construct new slug: category/title
                // Handle nested categories by splitting relativeDir
                const categorySegments = category !== 'uncategorized' ? category.split(path.sep) : ['uncategorized'];
                const slugArray = [...categorySegments, titleSlug];
                const slug = slugArray.join('/');

                const fileContents = fs.readFileSync(fullPath, 'utf8');
                const matterResult = matter(fileContents);

                let date = matterResult.data.date;
                if (date instanceof Date) {
                    date = date.toISOString().split('T')[0];
                }

                if (!date) {
                    const match = file.match(/^(\d{4}-\d{2}-\d{2})/);
                    if (match) {
                        date = match[1];
                    }
                }

                allPosts.push({
                    slug,
                    slugArray,
                    content: matterResult.content,
                    ...matterResult.data,
                    date,
                    category, // Ensure category is set from dir if not in frontmatter, or override? 
                    // Usually frontmatter category is preferred content-wise, 
                    // but for URL structure we rely on file path. 
                    // Let's preserve frontmatter category if distinct, or default to dir.
                } as PostData);
            }
        }
    }

    traverseDirectory(postsDirectory);

    // Sort posts by date
    return allPosts.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getAllPostIds() {
    const paths: { params: { slug: string[] } }[] = [];

    function traverseDirectory(dir: string) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                traverseDirectory(fullPath);
            } else if (file.endsWith('.md')) {
                const relativeDir = path.relative(postsDirectory, dir);
                const category = relativeDir || 'uncategorized';

                const fileName = file.replace(/\.md$/, '');
                const titleMatch = fileName.match(/^\d{4}-\d{2}-\d{2}-(.*)$/);
                const titleSlug = titleMatch ? titleMatch[1] : fileName;

                // Flatten category path for [...slug]
                const categorySegments = category !== 'uncategorized' ? category.split(path.sep) : ['uncategorized'];

                paths.push({
                    params: {
                        slug: [...categorySegments, titleSlug],
                    },
                });
            }
        }
    }

    traverseDirectory(postsDirectory);
    return paths;
}

export async function getPostData(slugArray: string[]): Promise<PostData> {
    // Decode all segments to handle URL encoding (e.g., "Computer%20Science" -> "Computer Science")
    const decodedSlugArray = slugArray.map(segment => decodeURIComponent(segment));

    // slugArray: [...categorySegments, titleSlug]
    // Last element is title
    const titleSlug = decodedSlugArray[decodedSlugArray.length - 1];
    // Rest is category path
    const categorySegments = decodedSlugArray.slice(0, -1);
    const category = categorySegments.join(path.sep) || 'uncategorized';

    const targetDir = path.join(postsDirectory, category);

    if (!fs.existsSync(targetDir)) {
        // Try decoding segments just in case. Next.js usually provides decoded params but FS paths might need care?
        // Actually on Mac/Linux path.sep is / which matches URL. 
        // If category was 'Projects%2FJetson', decoding is needed.
        // But here we constructed it from split, so it should be clean segments.

        // Fallback/Error check
        throw new Error(`Category directory not found: ${targetDir} (from slug: ${slugArray})`);
    }

    const files = fs.readdirSync(targetDir);
    let targetFile = '';

    // Find file that ends with titleSlug.md (ignoring date prefix)
    for (const file of files) {
        // Try matching both raw and decoded to be safe
        if (file.endsWith(`${titleSlug}.md`)) {
            targetFile = file;
            break;
        }
    }

    if (!targetFile) {
        throw new Error(`Post not found for slug: ${slugArray.join('/')} (looking for *${titleSlug}.md in ${targetDir})`);
    }

    const fullPath = path.join(targetDir, targetFile);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    let date = matterResult.data.date;
    if (!date) {
        const match = targetFile.match(/^(\d{4}-\d{2}-\d{2})/);
        if (match) {
            date = match[1];
        }
    }

    return {
        slug: slugArray.join('/'),
        slugArray,
        content: matterResult.content,
        ...matterResult.data,
        date,
        category,
    } as PostData;
}

export function getCategories(): Record<string, number> {
    const posts = getSortedPostsData();
    const categories: Record<string, number> = {};

    posts.forEach(post => {
        // Use directory-based category for counting to match URL structure
        // or prioritize frontmatter? 
        // User wants sidebar links /category/[name]. 
        // Logic should align. Let's use the explicit category derived from folder structure 
        // if we want strict folder-based routing.

        // Actually, the previous implementation used frontmatter. 
        // Let's stick to 'category' property we set in getSortedPostsData (which relies on dir).
        const cat = post.category || 'uncategorized';
        if (categories[cat]) {
            categories[cat]++;
        } else {
            categories[cat] = 1;
        }
    });

    return categories;
}
