import { getPostData, getAllPostIds, getCategories, getSortedPostsData } from '@/lib/posts';
import { format } from 'date-fns';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import 'highlight.js/styles/github-dark.css'; // Import highlight.js style
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
                <span className="block w-full overflow-visible">
                    <img
                        {...props}
                        className="block mx-auto my-8 max-w-full h-auto rounded-lg shadow-sm"
                        style={{ display: 'block', margin: '2rem auto' }}
                    />
                </span>
            );
        },

        // Custom pre component to handle the Toggle logic
        pre: ({ node, children, ...props }: any) => {
            // console.log('Pre render:', { childrenProps: children?.props });
            let isOutput = true;
            if (children && children.props && children.props.className) {
                if (children.props.className.includes('language-')) {
                    isOutput = false;
                }
            }

            // If it's an output block (no language class), wrap in Details
            if (isOutput) {
                return (
                    <details className="my-4 bg-gray-900 rounded-lg overflow-hidden group">
                        <summary className="cursor-pointer px-4 py-2 text-sm text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors select-none list-none flex items-center">
                            <span className="mr-2 transform group-open:rotate-90 transition-transform">▶</span>
                            Code output
                        </summary>
                        <div className="p-4 overflow-x-auto text-white font-mono whitespace-pre">
                            <pre className="!m-0 !p-0 !bg-transparent" {...props}>
                                {children}
                            </pre>
                        </div>
                    </details>
                );
            }

            // Otherwise render normal pre
            return <pre {...props}>{children}</pre>;
        },
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* TopNav for Blog Section */}
            <TopNav title="Blog" />

            <div className="flex flex-col lg:flex-row w-full max-w-screen-2xl mx-auto">
                <Sidebar categories={categories} />
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
                                remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
                                rehypePlugins={[rehypeRaw, [rehypeHighlight, { detect: false, ignoreMissing: true }], rehypeKatex]}
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
