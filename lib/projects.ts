import fs from 'fs';
import path from 'path';


const projectsFile = path.join(process.cwd(), 'content/projects.json');

export interface ProjectData {
    title: string;
    date: string;
    description: string;
    tags?: string[];
    links: { label: string; url: string; icon?: 'github' | 'external' }[];
    contentMarkdown: string;
}

export async function getProjectsData(): Promise<ProjectData[]> {
    if (!fs.existsSync(projectsFile)) {
        return [];
    }

    const fileContents = fs.readFileSync(projectsFile, 'utf8');
    const projects: ProjectData[] = JSON.parse(fileContents);

    // Sort by date descending (Newest first)
    return projects.sort((a, b) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
    });
}
