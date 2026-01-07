'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Github, Linkedin, ExternalLink, ChevronRight, Brain, Dna, Code, Trophy, Mic, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { ABOUT_DATA } from '@/lib/about-data';
import ReactMarkdown from 'react-markdown';
import ProjectItem from '@/components/ProjectItem';

export default function About() {
    const [activeSection, setActiveSection] = useState('about');
    const [expandedProjectIndex, setExpandedProjectIndex] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['about', 'education', 'experience', 'projects', 'awards', 'contact'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
                    setActiveSection(section);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const targetId = id === 'about' ? 'about-me-content' : id;
        const element = document.getElementById(targetId);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    const NavItem = ({ id, label }: { id: string, label: string }) => (
        <button
            onClick={() => scrollToSection(id)}
            className={`text-sm uppercase tracking-widest py-3 block w-full text-center lg:text-left hover:text-white transition-colors
                ${activeSection === id ? 'text-white font-bold' : 'text-white/50 font-normal'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
            {/* Resume Layout Container */}
            <div className="flex flex-col lg:flex-row lg:items-start flex-1 w-full max-w-[1600px] mx-auto shadow-2xl my-8 lg:my-16 rounded-3xl bg-white dark:bg-gray-900">

                {/* Sidebar Navigation */}
                <nav className="w-full lg:w-72 bg-[#111827] flex flex-col items-start justify-start p-6 lg:p-12 z-40 shrink-0 lg:sticky lg:top-32 rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl">
                    <div className="space-y-4 w-full pt-4">
                        <NavItem id="about" label="About" />
                        <NavItem id="education" label="Education" />
                        <NavItem id="experience" label="Experience" />
                        <NavItem id="projects" label="Projects" />
                        <NavItem id="awards" label="Awards" />
                        <NavItem id="contact" label="Contact" />
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 w-full overflow-hidden rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl">

                    {/* About Section */}
                    <section id="about" className="min-h-[600px] flex flex-col justify-center py-20 px-8 lg:px-16 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
                            <div className="flex-1">
                                <h1 className="text-5xl lg:text-7xl font-bold uppercase mb-4 text-gray-800 dark:text-white leading-tight">
                                    {ABOUT_DATA.name} <span className="text-[#BD5D38]">{ABOUT_DATA.lastName}</span>
                                </h1>
                                <div className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-8 uppercase tracking-wide">
                                    {ABOUT_DATA.title} · {ABOUT_DATA.location} · <a href={ABOUT_DATA.social.email} className="text-[#BD5D38] hover:underline">{ABOUT_DATA.email}</a>
                                </div>
                                <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-8 whitespace-pre-wrap">
                                    {ABOUT_DATA.about.description}
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => scrollToSection('contact')}
                                        className="px-6 py-3 bg-[#4D7CFF] text-white rounded-full font-bold shadow-lg hover:bg-[#3A63CC] transition-colors flex items-center gap-2"
                                    >
                                        <Mail size={20} />
                                        Contact Me
                                    </button>
                                    <button
                                        onClick={() => scrollToSection('projects')}
                                        className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-full font-bold shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                                    >
                                        <Code size={20} />
                                        Projects
                                    </button>
                                </div>
                            </div>
                            <div className="relative shrink-0 w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden order-first md:order-last">
                                <Image
                                    src={ABOUT_DATA.avatar}
                                    alt={`${ABOUT_DATA.name} ${ABOUT_DATA.lastName}`}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Highlights Cards */}
                        <div id="about-me-content" className="w-full scroll-mt-32">
                            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white relative">
                                About Me
                                <span className="block w-16 h-1 bg-[#4D7CFF] mx-auto mt-2 rounded-full"></span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {ABOUT_DATA.about.highlights?.map((item, index) => {
                                    const Icon = item.icon === 'Brain' ? Brain : item.icon === 'Dna' ? Dna : Code;
                                    return (
                                        <div key={index} className="bg-slate-100 dark:bg-[#1e293b] p-8 rounded-2xl border-2 border-transparent hover:border-[#4D7CFF] transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center group cursor-default">
                                            <div className="mb-4 text-[#4D7CFF] group-hover:scale-110 transition-transform duration-300">
                                                <Icon size={48} strokeWidth={1.5} />
                                            </div>
                                            <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{item.title}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Education Section */}
                    <section id="education" className="min-h-screen flex flex-col justify-center py-20 px-8 lg:px-16 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800 dark:text-white relative">
                            Education
                            <span className="block w-16 h-1 bg-[#4D7CFF] mx-auto mt-2 rounded-full"></span>
                        </h2>

                        <div className="relative">
                            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 md:-translate-x-1/2 pl-4 md:pl-0"></div>
                            <div className="space-y-12">
                                {ABOUT_DATA.education.map((edu, index) => {
                                    const isEven = index % 2 === 0;
                                    return (
                                        <div key={index} className={`flex flex-col md:flex-row items-start md:items-center relative ${isEven ? 'md:flex-row-reverse' : ''}`}>
                                            <div className={`hidden md:block w-1/2 px-8 ${isEven ? 'text-left' : 'text-right'}`}>
                                                <span className="text-[#4D7CFF] font-bold">{edu.period}</span>
                                            </div>
                                            <div className="absolute left-[-5px] md:left-1/2 w-4 h-4 bg-[#4D7CFF] rounded-full border-4 border-white dark:border-gray-900 md:-translate-x-1/2 z-10 shrink-0 mt-1 md:mt-0"></div>
                                            <div className={`w-full md:w-1/2 pl-8 md:pl-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                                                <div className="md:hidden text-[#4D7CFF] font-bold mb-1 text-sm">{edu.period}</div>
                                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{edu.school}</h3>
                                                <div className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">{edu.degree}</div>
                                                {edu.details && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                                        {edu.details}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Experience Section */}
                    <section id="experience" className="min-h-screen flex flex-col justify-center py-20 px-8 lg:px-16 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/5">
                        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800 dark:text-white relative">
                            Experience
                            <span className="block w-16 h-1 bg-[#4D7CFF] mx-auto mt-2 rounded-full"></span>
                        </h2>
                        {ABOUT_DATA.experience.map((exp, index) => (
                            <ExperienceItem
                                key={index}
                                title={exp.title}
                                company={exp.company}
                                period={exp.period}
                                details={exp.details}
                            />
                        ))}
                    </section>

                    {/* Projects Section */}
                    <section id="projects" className="min-h-screen flex flex-col justify-center py-20 px-8 lg:px-12 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800 dark:text-white relative">
                            Projects
                            <span className="block w-16 h-1 bg-[#4D7CFF] mx-auto mt-2 rounded-full"></span>
                        </h2>
                        <div className="space-y-24">
                            {ABOUT_DATA.projects?.map((project, index) => (
                                <ProjectItem
                                    key={index}
                                    project={project}
                                    index={index}
                                    isExpanded={expandedProjectIndex === index}
                                    onToggle={() => setExpandedProjectIndex(expandedProjectIndex === index ? null : index)}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Awards Section */}
                    <section id="awards" className="min-h-[600px] flex flex-col justify-center py-20 px-8 lg:px-12 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/5">
                        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800 dark:text-white relative">
                            Awards & Presentations
                            <span className="block w-16 h-1 bg-[#4D7CFF] mx-auto mt-2 rounded-full"></span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Certifications Card */}
                            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-lg">
                                <div className="flex items-center gap-4 mb-6 text-gray-800 dark:text-white">
                                    <Trophy className="text-[#4D7CFF]" size={32} />
                                    <h3 className="text-2xl font-bold">Awards & Certifications</h3>
                                </div>
                                <ul className="space-y-4">
                                    {ABOUT_DATA.awards.certifications.map((item, i) => (
                                        <li key={i} className="text-gray-600 dark:text-gray-300 font-medium pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* Presentations Card */}
                            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-lg">
                                <div className="flex items-center gap-4 mb-6 text-gray-800 dark:text-white">
                                    <Mic className="text-[#4D7CFF]" size={32} />
                                    <h3 className="text-2xl font-bold">Presentations</h3>
                                </div>
                                <ul className="space-y-4">
                                    {ABOUT_DATA.awards.presentations.map((item, i) => (
                                        <li key={i} className="text-gray-600 dark:text-gray-300 font-medium pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section id="contact" className="min-h-[400px] flex flex-col justify-center py-20 px-8 lg:px-12">
                        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white relative">
                            Contact
                            <span className="block w-16 h-1 bg-[#4D7CFF] mx-auto mt-2 rounded-full"></span>
                        </h2>
                        <p className="text-center text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
                            If you interested in collaboration or have a question? Feel free to reach out!
                        </p>
                        <div className="flex justify-center gap-8">
                            <a href={ABOUT_DATA.social.email} className="flex flex-col items-center gap-2 group">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:bg-[#4D7CFF] group-hover:text-white transition-colors">
                                    <Mail size={32} />
                                </div>
                                <span className="font-medium text-gray-600 dark:text-gray-400 group-hover:text-[#4D7CFF]">Email</span>
                            </a>
                            <a href={ABOUT_DATA.social.github} target="_blank" className="flex flex-col items-center gap-2 group">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:bg-[#4D7CFF] group-hover:text-white transition-colors">
                                    <Github size={32} />
                                </div>
                                <span className="font-medium text-gray-600 dark:text-gray-400 group-hover:text-[#4D7CFF]">GitHub</span>
                            </a>
                            <a href={ABOUT_DATA.social.linkedin} target="_blank" className="flex flex-col items-center gap-2 group">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:bg-[#4D7CFF] group-hover:text-white transition-colors">
                                    <Linkedin size={32} />
                                </div>
                                <span className="font-medium text-gray-600 dark:text-gray-400 group-hover:text-[#4D7CFF]">LinkedIn</span>
                            </a>
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-[#BD5D38] transition-colors"
        >
            {icon}
        </a>
    );
}

function ExperienceItem({ title, company, period, details }: { title: string, company: string, period: string, details: string[] }) {
    return (
        <div className="mb-12 flex flex-col md:flex-row md:justify-between">
            <div className="md:w-3/4">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{title}</h3>
                <div className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">{company}</div>
                <ul className="space-y-4">
                    {details.map((detail, index) => (
                        <li key={index} className="text-gray-600 dark:text-gray-400">
                            <ReactMarkdown
                                components={{
                                    p: ({ node, ...props }) => <div className="mb-2" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-5 space-y-1 mt-1" {...props} />,
                                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                    strong: ({ node, ...props }) => <span className="font-bold text-gray-900 dark:text-gray-100" {...props} />,
                                    a: ({ node, ...props }) => <a className="text-[#4D7CFF] hover:underline" {...props} />,
                                }}
                            >
                                {detail}
                            </ReactMarkdown>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="md:w-1/4 md:text-right mt-2 md:mt-0">
                <span className="text-[#BD5D38] font-semibold">{period}</span>
            </div>
        </div>
    );
}
