import ProjectCard from '@/components/ProjectCard';
import { getProjectsData } from '@/lib/projects';
import TopNav from '@/components/TopNav';

export default async function Projects() {
    const projects = await getProjectsData();

    return (
        <div className="min-h-screen flex flex-col items-center">
            <TopNav title="Projects" />
            <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        tags = { project.tags }
                            links = { project.links }
                            details = {
                                < ReactMarkdown
                                    remarkPlugins = { [remarkGfm, remarkBreaks]}
                                    rehypePlugins = { [rehypeRaw, rehypeHighlight]}
                                    className = "prose dark:prose-invert max-w-none text-sm"
                        >
                        { project.contentMarkdown }
                                </ReactMarkdown>
                            }
                        />
                    ))}
        </div>
            </main >
        </div >
    );
}
