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
}

export default function ProjectCard({ title, date, description, details, links }: ProjectCardProps) {
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
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-foreground">{title}</h3>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                                {date}
                            </span>
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
