import SubPageLayout from '@/components/SubPageLayout';
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
        <SubPageLayout title="Projects">
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
        </SubPageLayout>
    );
}
