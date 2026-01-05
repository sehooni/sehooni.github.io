'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Github, ExternalLink, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { ABOUT_DATA } from '@/lib/about-data';
import ReactMarkdown from 'react-markdown';

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

function ProjectItem({ project, index, isExpanded, onToggle }: { project: any, index: number, isExpanded: boolean, onToggle: () => void }) {
    const [language, setLanguage] = useState<'en' | 'ko'>('en');
    const isEven = index % 2 === 0;

    const detailsContent = typeof project.details === 'string'
        ? project.details
        : project.details[language] || project.details['en'];

    return (
        <div className={`flex flex-col gap-8 items-center transition-all duration-700 ${isExpanded ? 'lg:flex-col' : (isEven ? 'lg:flex-row' : 'lg:flex-row-reverse')}`}>
            {/* Image Section */}
            <div className={`w-full ${isExpanded ? 'lg:w-3/4' : 'lg:w-1/2'} transition-all duration-700 ease-in-out`}>
                <div
                    onClick={onToggle}
                    className={`relative rounded-xl overflow-hidden shadow-2xl ${isExpanded ? 'aspect-video' : 'aspect-[4/3]'} bg-black/5 dark:bg-black/20 group cursor-pointer hover:ring-4 ring-[#4D7CFF]/50 transition-all duration-300`}
                >
                    {project.video && !project.video.toLowerCase().endsWith('.gif') ? (
                        <video
                            src={project.video}
                            className="w-full h-full object-contain"
                            autoPlay
                            muted
                            loop
                            playsInline
                            controls={isExpanded}
                        />
                    ) : (project.video || project.image) ? (
                        <Image
                            src={project.video || project.image}
                            alt={project.title}
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">No Media</div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className={`w-full ${isExpanded ? 'lg:w-3/4 text-center' : 'lg:w-1/2'} transition-all duration-700 ease-in-out`}>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{project.title}</h3>

                {/* Tags */}
                <div className={`flex flex-wrap gap-2 mb-6 ${isExpanded ? 'justify-center' : ''}`}>
                    {project.tags.map((tag: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-[#4D7CFF]/10 text-[#4D7CFF] rounded-full text-sm font-semibold">
                            {tag}
                        </span>
                    ))}
                </div>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap">
                    {project.description}
                </p>

                {/* Expanded Details */}
                <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[1500px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-gray-50 dark:bg-[#1e293b] p-8 rounded-xl text-left">

                        {/* Period & Language Toggle Header */}
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[#4D7CFF] font-bold text-lg bg-[#4D7CFF]/10 px-4 py-1.5 rounded-full">
                                {project.period}
                            </span>

                            {typeof project.details === 'object' && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setLanguage('en'); }}
                                        className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${language === 'en' ? 'bg-[#4D7CFF] text-white shadow-lg scale-105' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                    >
                                        English
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setLanguage('ko'); }}
                                        className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${language === 'ko' ? 'bg-[#4D7CFF] text-white shadow-lg scale-105' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                    >
                                        한글
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="prose dark:prose-invert max-w-none">
                            <ReactMarkdown>{detailsContent || ""}</ReactMarkdown>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start" style={{ justifyContent: isExpanded ? 'center' : undefined }}>
                    <button
                        onClick={onToggle}
                        className="flex items-center gap-2 text-[#4D7CFF] font-bold hover:underline"
                    >
                        {isExpanded ? (
                            <>Show Less <ChevronUp size={20} /></>
                        ) : (
                            <>Read More <ChevronDown size={20} /></>
                        )}
                    </button>

                    {/* Render Links */}
                    {project.links && project.links.map((link: any, i: number) => {
                        let Icon = ExternalLink;
                        if (link.icon === 'github') Icon = Github;
                        if (link.icon === 'blog') Icon = BookOpen;

                        return (
                            <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-[#4D7CFF] hover:text-white transition-colors"
                            >
                                <Icon size={16} />
                                {link.label}
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
