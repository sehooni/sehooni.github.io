import { getPostData, getAllPostIds, getCategories } from '@/lib/posts';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const postData = await getPostData(decodedSlug);
    const categories = getCategories();

    // Custom components for ReactMarkdown to add IDs to headings for TOC
    const components = {
        h1: ({ node, ...props }: any) => {
            const id = props.children[0]?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            return <h1 id={id} className="text-3xl font-bold mt-8 mb-4" {...props} />;
        },
        h2: ({ node, ...props }: any) => {
            const id = props.children[0]?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            return <h2 id={id} className="text-2xl font-bold mt-8 mb-4" {...props} />;
        },
        h3: ({ node, ...props }: any) => {
            const id = props.children[0]?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
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
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            <Sidebar categories={categories} />
            <main className="flex-1 w-full max-w-4xl mx-auto p-6 lg:p-12">
                <div className="flex gap-10">
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
                            remarkPlugins={[remarkGfm]}
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
    );
}
