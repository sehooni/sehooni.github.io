import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';
import { getCategories } from '@/lib/posts';
import ScrollToTop from '@/components/ScrollToTop';

interface AboutPostData {
    content: string;
    title?: string;
    [key: string]: any;
}

async function getAboutData(): Promise<AboutPostData> {
    const fullPath = path.join(process.cwd(), 'content/about.md');
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
        content: matterResult.content,
        ...matterResult.data,
    };
}

export default async function About() {
    const postData = await getAboutData();
    const categories = getCategories();

    return (
        <div className="min-h-screen flex flex-col">
            <TopNav title="About" />

            <div className="flex flex-col lg:flex-row w-full max-w-screen-2xl mx-auto">
                <Sidebar categories={categories} />
                <main className="flex-1 w-full p-6 lg:p-12">
                    <div className="flex gap-8">
                        <ScrollToTop />
                        <article className="flex-1 min-w-0 prose prose-slate dark:prose-invert max-w-none">
                            <h1 className="text-4xl font-bold mb-8 border-b pb-4">
                                {postData.title || 'About'}
                            </h1>

                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
                                rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
                                components={{
                                    h1: ({ node, ...props }: any) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                                    h2: ({ node, ...props }: any) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
                                    h3: ({ node, ...props }: any) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
                                    img: ({ node, ...props }: any) => (
                                        <span className="block w-full overflow-visible">
                                            <img
                                                {...props}
                                                className="block mx-auto my-8 max-w-full h-auto rounded-lg shadow-sm"
                                            />
                                        </span>
                                    ),
                                    code: ({ node, inline, className, children, ...props }: any) => {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const isInline = inline || !match;
                                        if (isInline) {
                                            return (
                                                <code
                                                    className="!bg-[#ffff00] !text-gray-900 rounded px-1.5 py-0.5 font-mono text-sm before:content-none after:content-none font-bold"
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
                                    pre: ({ node, children, ...props }: any) => {
                                        let isOutput = true;
                                        if (children && children.props && children.props.className) {
                                            if (children.props.className.includes('language-')) {
                                                isOutput = false;
                                            }
                                        }
                                        if (isOutput) {
                                            return (
                                                <details className="my-4 bg-gray-900 rounded-lg overflow-hidden">
                                                    <summary className="cursor-pointer px-4 py-2 text-sm text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors select-none">
                                                        Click to see output
                                                    </summary>
                                                    <div className="p-4 overflow-x-auto text-sm text-gray-300 font-mono whitespace-pre">
                                                        {children}
                                                    </div>
                                                </details>
                                            );
                                        }
                                        return <pre {...props}>{children}</pre>;
                                    },
                                }}
                            >
                                {postData.content}
                            </ReactMarkdown>
                        </article>
                    </div>
                </main>
            </div>
        </div>
    );
}
