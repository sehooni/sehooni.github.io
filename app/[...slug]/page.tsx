import { getPostData, getAllPostIds, getCategories, getSortedPostsData } from '@/lib/posts';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import TableOfContents from '@/components/TableOfContents';
import 'highlight.js/styles/github-dark.css'; // Import highlight.js style

export async function generateStaticParams() {
    const paths = getAllPostIds();
    return paths.map((path) => path.params);
}

import Comments from '@/components/Comments';
import ScrollToTop from '@/components/ScrollToTop';
import ShareButtons from '@/components/ShareButtons';
import PostNavigation from '@/components/PostNavigation';
import Sidebar from '@/components/Sidebar';

import TopNav from '@/components/TopNav';

// ... (existing imports)

export default async function Post({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    // slug is an array: [category, title]
    const postData = await getPostData(slug);
    // decode title part for share buttons if needed, usually slug parts are url-encoded
    const decodedSlug = slug.map(s => decodeURIComponent(s)).join('/');
    const categories = getCategories();
    const allPosts = getSortedPostsData(); // Fetch all posts to get recent ones
    const recentPosts = allPosts.slice(0, 5);

    // Helper helper to extract text from React children
    const getTextFromChildren = (children: any): string => {
        if (!children) return '';
        if (typeof children === 'string') return children;
        if (Array.isArray(children)) return children.map(getTextFromChildren).join('');
        if (children.props && children.props.children) return getTextFromChildren(children.props.children);
        return '';
    };

    const generateId = (children: any) => {
        const text = getTextFromChildren(children);
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    // Custom components for ReactMarkdown to add IDs to headings for TOC
    const components = {
        h1: ({ node, ...props }: any) => {
            const id = generateId(props.children);
            return <h1 id={id} className="text-3xl font-bold mt-8 mb-4" {...props} />;
        },
        h2: ({ node, ...props }: any) => {
            const id = generateId(props.children);
            return <h2 id={id} className="text-2xl font-bold mt-8 mb-4" {...props} />;
        },
        h3: ({ node, ...props }: any) => {
            const id = generateId(props.children);
            return <h3 id={id} className="text-xl font-bold mt-6 mb-3" {...props} />;
        },
        img: ({ node, ...props }: any) => {
            return (
                <img
                    {...props}
                    className="block mx-auto my-8 max-w-full rounded-lg shadow-sm"
                    style={{ display: 'block', margin: '2rem auto' }}
                />
            );
        },
        code: ({ node, inline, className, children, ...props }: any) => {
            if (inline) {
                return (
                    <code
                        className="bg-yellow-200 text-gray-900 dark:bg-yellow-500/30 dark:text-gray-100 rounded px-1.5 py-0.5 font-mono text-sm before:content-none after:content-none"
                        style={{ backgroundColor: '#fef08a', color: '#111827' }} // Inline style fallback for maximum specificity
                        {...props}
                    >
                        {children}
                    </code>
                );
            }
            return (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* TopNav for Blog Section */}
            <TopNav title="Blog" />

            <div className="flex flex-col lg:flex-row w-full max-w-screen-2xl mx-auto">
                <Sidebar categories={categories} recentPosts={recentPosts} />
                <main className="flex-1 w-full p-6 lg:p-12">
                    <div className="flex gap-8">
                        <ScrollToTop />
                        <article className="flex-1 min-w-0 prose prose-slate dark:prose-invert max-w-none">
                            <PostNavigation />
                            <header className="mb-8 not-prose border-b pb-8">
                                <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <time dateTime={postData.date}>{format(new Date(postData.date), 'MMMM d, yyyy')}</time>
                                    {postData.category && (
                                        <>
                                            <span>•</span>
                                            <span className="font-medium text-primary">{postData.category}</span>
                                        </>
                                    )}
                                </div>
                            </header>

                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                components={components}
                            >
                                {postData.content}
                            </ReactMarkdown>

                            <ShareButtons title={postData.title} slug={decodedSlug} />
                            <Comments />
                        </article>

                        <TableOfContents content={postData.content} />
                    </div>
                </main>
            </div>
        </div>
    );
}
