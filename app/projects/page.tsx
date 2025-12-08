import Sidebar from '@/components/Sidebar';
import ProjectCard from '@/components/ProjectCard';
import { getProjectsData } from '@/lib/projects';
import { getCategories, getSortedPostsData } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export default async function Projects() {
    const projects = await getProjectsData();
    const categories = getCategories();
    // Get recent 5 posts for the sidebar
    const recentPosts = getSortedPostsData().slice(0, 5);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            <Sidebar categories={categories} recentPosts={recentPosts} />
            <main className="flex-1 w-full lg:max-w-4xl mx-auto p-4 md:p-8">
                <div className="mb-8 border-b border-gray-200 pb-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Projects
                    </h1>
                </div>

                <div className="space-y-6">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.title}
                            title={project.title}
                            date={project.date}
                            description={project.description}
                            tags={project.tags}
                            links={project.links}
                            details={
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                    className="prose dark:prose-invert max-w-none text-sm"
                                >
                                    {project.contentMarkdown}
                                </ReactMarkdown>
                            }
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
