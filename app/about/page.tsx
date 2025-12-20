import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
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
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                components={{
                                    // Basic custom components if needed, similar to blog posts
                                    img: ({ node, ...props }: any) => (
                                        <span className="block w-full overflow-visible">
                                            <img
                                                {...props}
                                                className="block mx-auto my-8 max-w-full h-auto rounded-lg shadow-sm"
                                            />
                                        </span>
                                    ),
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
