"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

import { PostData } from '@/lib/posts';
import { CATEGORY_ORDER, CATEGORY_DISPLAY_NAMES } from '@/lib/category-config';

interface SidebarProps {
    categories: Record<string, number>;
}

export default function Sidebar({ categories }: SidebarProps) {
    const pathname = usePathname();

    // Transform flat categories into a tree structure
    const categoryTree = Object.entries(categories).reduce((acc, [path, count]) => {
        const parts = path.split('/');
        let currentLevel = acc;

        parts.forEach((part, index) => {
            const isLast = index === parts.length - 1;
            const fullPath = parts.slice(0, index + 1).join('/');

            if (!currentLevel[part]) {
                currentLevel[part] = {
                    name: part,
                    path: fullPath,
                    count: 0,
                    children: {}
                };
            }

            if (isLast) {
                currentLevel[part].count = count;
            }

            currentLevel = currentLevel[part].children;
        });

        return acc;
    }, {} as Record<string, any>);

    // Recursive component to render categories
    const renderCategories = (nodes: Record<string, any>, level = 0) => {
        const sortedNodes = Object.values(nodes).sort((a: any, b: any) => {
            const indexA = CATEGORY_ORDER.indexOf(a.name);
            const indexB = CATEGORY_ORDER.indexOf(b.name);

            // If both are in the predefined order list, sort by index
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            // If only A is in list, comes first
            if (indexA !== -1) return -1;
            // If only B is in list, comes first
            if (indexB !== -1) return 1;

            // Default alphabetical sort for everything else
            return a.name.localeCompare(b.name);
        });

        return (
            <ul className={`space-y-1 text-sm ${level > 0 ? 'ml-3 border-l border-border pl-3' : ''}`}>
                {sortedNodes.map((node: any) => (
                    <li key={node.path}>
                        <div className="flex justify-between items-center group py-1">
                            <Link
                                href={`/category/${node.path}/`}
                                className="block text-foreground hover:text-primary hover:underline transition-colors truncate max-w-[80%]"
                            >
                                {CATEGORY_DISPLAY_NAMES[node.name] || node.name}
                            </Link>
                            {node.count > 0 && (
                                <span className="text-xs text-secondary bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full border border-border group-hover:border-primary group-hover:text-primary transition-colors">
                                    {node.count}
                                </span>
                            )}
                        </div>
                        {Object.keys(node.children).length > 0 && renderCategories(node.children, level + 1)}
                    </li>
                ))}
            </ul>
        );
    };

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: 'Projects', path: '/projects' },
        { name: 'About', path: '/about' },
        // Resume is special case, user will provide link later
        { name: 'Resume', path: '/resume' },
    ];

    return (
        <div className="w-full lg:w-64 flex-shrink-0 lg:block bg-sidebar-bg border-r border-border h-auto lg:h-screen lg:sticky lg:top-0 overflow-y-auto sidebar-scroll font-sans">
            <div className="p-6">
                {/* Profile Section - Hide on Projects, About, Resume pages */}
                {!['/projects', '/about', '/resume'].some(path => pathname?.startsWith(path)) && (
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-full border-4 border-white shadow-sm">
                            {/* Fallback to a placeholder if image is missing, but try to load the one from config */}
                            <Image
                                src="/assets/img/Self.jpeg"
                                alt="Sehoon Park"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-1">Sehoon Park</h2>
                        <p className="text-sm text-secondary text-center mb-4">hello :)</p>

                        {/* Social Links */}
                        <div className="flex gap-3 text-secondary">
                            <a href="mailto:74sehoon@gmail.com" className="hover:text-primary transition-colors" aria-label="Email">
                                <FaEnvelope size={18} />
                            </a>
                            <a href="https://github.com/sehooni" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="GitHub">
                                <FaGithub size={18} />
                            </a>
                            <a href="https://www.linkedin.com/in/sehoon-park-575b8b22a/?locale=ko_KR" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="LinkedIn">
                                <FaLinkedin size={18} />
                            </a>
                        </div>
                    </div>
                )}



                {/* Categories - Hide on Projects, About, Resume pages */}
                {!['/projects', '/about', '/resume'].some(path => pathname?.startsWith(path)) && (
                    <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3 pb-1 border-b border-border">
                            Categories
                        </h3>
                        {renderCategories(categoryTree)}
                    </div>
                )}


            </div>
        </div>
    );
}
