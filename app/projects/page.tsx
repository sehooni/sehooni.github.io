'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Github, ExternalLink, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { ABOUT_DATA } from '@/lib/about-data';
import ReactMarkdown from 'react-markdown';
import ProjectItem from '@/components/ProjectItem';

export default function Projects() {
    const [expandedProjectIndex, setExpandedProjectIndex] = useState<number | null>(null);
    const projects = ABOUT_DATA.projects;

    return (
        <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900">
            <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8">
                <h1 className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white mt-8">
                    Projects
                    <span className="block w-16 h-1 bg-[#4D7CFF] mx-auto mt-2 rounded-full"></span>
                </h1>

                <div className="space-y-24">
                    {projects?.map((project, index) => (
                        <ProjectItem
                            key={index}
                            project={project}
                            index={index}
                            isExpanded={expandedProjectIndex === index}
                            onToggle={() => setExpandedProjectIndex(expandedProjectIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
