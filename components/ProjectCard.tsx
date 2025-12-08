"use client";

import { useState } from 'react';
import { FaChevronDown, FaGithub, FaExternalLinkAlt, FaBook } from 'react-icons/fa';

export interface ProjectLink {
    label: string;
    url: string;
    icon?: 'github' | 'external' | 'blog';
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
        'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200',
        'bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200',
        'bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200',
        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
        'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
        'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
        'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
        'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200',
        'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
        'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
        // Intensity variations (50 for lighter background, 200 for simpler look)
        'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-100',
        'bg-red-50 text-red-700 dark:bg-red-800 dark:text-red-100',
        'bg-orange-50 text-orange-700 dark:bg-orange-800 dark:text-orange-100',
        'bg-amber-50 text-amber-700 dark:bg-amber-800 dark:text-amber-100',
        'bg-yellow-50 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100',
        'bg-lime-50 text-lime-700 dark:bg-lime-800 dark:text-lime-100',
        'bg-green-50 text-green-700 dark:bg-green-800 dark:text-green-100',
        'bg-emerald-50 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100',
        'bg-teal-50 text-teal-700 dark:bg-teal-800 dark:text-teal-100',
        'bg-cyan-50 text-cyan-700 dark:bg-cyan-800 dark:text-cyan-100',
        'bg-sky-50 text-sky-700 dark:bg-sky-800 dark:text-sky-100',
        'bg-blue-50 text-blue-700 dark:bg-blue-800 dark:text-blue-100',
        'bg-indigo-50 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100',
        'bg-violet-50 text-violet-700 dark:bg-violet-800 dark:text-violet-100',
        'bg-purple-50 text-purple-700 dark:bg-purple-800 dark:text-purple-100',
        'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-800 dark:text-fuchsia-100',
        'bg-pink-50 text-pink-700 dark:bg-pink-800 dark:text-pink-100',
        'bg-rose-50 text-rose-700 dark:bg-rose-800 dark:text-rose-100',
        // Stronger variations (bg-200)
        'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100',
        'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100',
        'bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100',
        'bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100',
        'bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100',
        'bg-teal-200 text-teal-900 dark:bg-teal-800 dark:text-teal-100',
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
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            {description}
                        </p>

                        {links && links.length > 0 && (
                            <div className="flex flex-wrap gap-3 mt-3">
                                {links.map((link) => (
                                    <a
                                        key={link.url}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-gray-50 dark:bg-gray-800 border border-border hover:border-primary hover:text-primary hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm z-10 relative"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {link.icon === 'github' ? <FaGithub /> : link.icon === 'blog' ? <FaBook /> : <FaExternalLinkAlt size={12} />}
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        )}
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


                    </div>
                </div>
            </div>
        </div>
    );
}
