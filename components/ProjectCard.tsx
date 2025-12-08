"use client";

import { useState } from 'react';
import { FaChevronDown, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

export interface ProjectLink {
    label: string;
    url: string;
    icon?: 'github' | 'external';
}

interface ProjectCardProps {
    title: string;
    date: string;
    description: string;
    details: React.ReactNode;
    links?: ProjectLink[];
    tags?: string[];
}

// Function to generate consistent pastel color from string
function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    const hex = "00000".substring(0, 6 - c.length) + c;

    // Convert hex to specific pastel variations
    // Simplifying: Use a fixed set of nice tailwind colors based on modulo
    const colors = [
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
        'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    ];

    const index = Math.abs(hash) % colors.length;
    return colors[index];
}

export default function ProjectCard({ title, date, description, details, links, tags }: ProjectCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={`border rounded-xl transition-all duration-300 overflow-hidden bg-card ${isOpen ? 'shadow-lg ring-1 ring-primary/20' : 'hover:shadow-md'
                }`}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-6 focus:outline-none"
            >
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-2">
                            <h3 className="text-xl font-bold text-foreground">{title}</h3>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/10 text-secondary whitespace-nowrap">
                                {date}
                            </span>
                            {tags && tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {tags.map(tag => (
                                        <span
                                            key={tag}
                                            className={`text-xs font-semibold px-2 py-0.5 rounded-md ${stringToColor(tag)}`}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {description}
                        </p>
                    </div>
                    <div className={`mt-1 text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <FaChevronDown />
                    </div>
                </div>
            </button>

            <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="p-6 pt-0 border-t border-border/50 bg-gray-50/50 dark:bg-gray-900/20">
                        <div className="prose dark:prose-invert max-w-none text-sm py-4">
                            {details}
                        </div>

                        {links && links.length > 0 && (
                            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border/50">
                                {links.map((link) => (
                                    <a
                                        key={link.url}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-white dark:bg-gray-800 border border-border hover:border-primary hover:text-primary transition-colors shadow-sm"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {link.icon === 'github' ? <FaGithub /> : <FaExternalLinkAlt size={12} />}
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
