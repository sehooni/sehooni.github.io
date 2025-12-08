import TopNav from '@/components/TopNav';
import ProjectCard from '@/components/ProjectCard';
import { getProjectsData } from '@/lib/projects';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export default async function Projects() {
    const projects = await getProjectsData();

    return (
        <div className="min-h-screen flex flex-col items-center">
            <TopNav title="Projects" />
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 gap-6 items-start">
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
