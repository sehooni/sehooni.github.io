import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostData {
    slug: string;
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
                const slug = file.replace(/\.md$/, '');
                const fileContents = fs.readFileSync(fullPath, 'utf8');
                const matterResult = matter(fileContents);

                let date = matterResult.data.date;
                if (!date) {
                    const match = file.match(/^(\d{4}-\d{2}-\d{2})/);
                    if (match) {
                        date = match[1];
                    }
                }

                allPosts.push({
                    slug,
                    content: matterResult.content,
                    ...matterResult.data,
                    date,
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
    const paths: { params: { slug: string } }[] = [];

    function traverseDirectory(dir: string) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                traverseDirectory(fullPath);
            } else if (file.endsWith('.md')) {
                paths.push({
                    params: {
                        slug: file.replace(/\.md$/, ''),
                    },
                });
            }
        }
    }

    traverseDirectory(postsDirectory);
    return paths;
}

export async function getPostData(slug: string): Promise<PostData> {
    let fullPath = '';

    function findFile(dir: string, targetSlug: string) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const currentPath = path.join(dir, file);
            const stat = fs.statSync(currentPath);

            if (stat.isDirectory()) {
                findFile(currentPath, targetSlug);
            } else if (file === `${targetSlug}.md`) {
                fullPath = currentPath;
                return;
            }
        }
    }

    findFile(postsDirectory, slug);

    if (!fullPath) {
        throw new Error(`Post not found: ${slug}`);
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    let date = matterResult.data.date;
    if (!date) {
        const fileName = path.basename(fullPath);
        const match = fileName.match(/^(\d{4}-\d{2}-\d{2})/);
        if (match) {
            date = match[1];
        }
    }

    return {
        slug,
        content: matterResult.content,
        ...matterResult.data,
        date,
    } as PostData;
}

export function getCategories(): Record<string, number> {
    const posts = getSortedPostsData();
    const categories: Record<string, number> = {};

    posts.forEach(post => {
        const postCategories = post.categories || (post.category ? [post.category] : []);
        postCategories.forEach(category => {
            if (categories[category]) {
                categories[category]++;
            } else {
                categories[category] = 1;
            }
        });
    });

    return categories;
}
