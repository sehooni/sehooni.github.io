"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { Search, X } from 'lucide-react';

import { PostData } from '@/lib/posts';
import { CATEGORY_ORDER, CATEGORY_DISPLAY_NAMES, CATEGORY_DESCRIPTIONS } from '@/lib/category-config';
import VisitorCounter from './VisitorCounter';

interface SidebarProps {
    categories: Record<string, number>;
}

export default function Sidebar({ categories }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Read search query from URL parameter 'q'
    const searchQuery = searchParams ? searchParams.get('q') || '' : '';
    const [inputValue, setInputValue] = useState(searchQuery);

    // Sync input value when URL parameter changes
    useEffect(() => {
        setInputValue(searchQuery);
    }, [searchQuery]);

    const handleSearchChange = (val: string) => {
        setInputValue(val);
        const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
        
        if (val) {
            params.set('q', val);
        } else {
            params.delete('q');
        }

        if (pathname !== '/blog') {
            router.push(`/blog?${params.toString()}`);
        } else {
            router.replace(`/blog?${params.toString()}`, { scroll: false });
        }
    };

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
                                href={`/blog/category/${node.path}/`}
                                className={`block hover:text-primary hover:underline transition-colors truncate max-w-[80%]
                                    ${(pathname?.startsWith(`/blog/category/${node.path}`) || pathname?.startsWith(`/blog/${node.path}`))
                                        ? 'font-bold text-black dark:text-white'
                                        : 'text-foreground'
                                    }`}
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
        <div className="w-full lg:w-64 flex-shrink-0 lg:block bg-sidebar-bg border-r border-border h-auto lg:h-[calc(100vh-6rem)] lg:sticky lg:top-24 overflow-y-auto sidebar-scroll font-sans">
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
                            <a href="https://www.linkedin.com/in/sehoon-park/?locale=ko_KR" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="LinkedIn">
                                <FaLinkedin size={18} />
                            </a>
                        </div>
                    </div>
                )}

                {/* Search Bar - show on all blog-related pages (not projects/about/resume) */}
                {!['/projects', '/about', '/resume'].some(path => pathname?.startsWith(path)) && (
                    <div className="relative w-full mb-6">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Search posts..."
                            className="w-full pl-9 pr-8 py-1.5 text-sm border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent transition-all"
                        />
                        {inputValue && (
                            <button
                                onClick={() => handleSearchChange('')}
                                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                )}

                {/* Categories - Hide on Projects, About, Resume pages */}
                {!['/projects', '/about', '/resume'].some(path => pathname?.startsWith(path)) && (
                    <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3 pb-1 border-b border-border hover:text-primary transition-colors">
                            <Link href="/blog/category/">
                                Categories
                            </Link>
                        </h3>
                        {renderCategories(categoryTree)}
                    </div>
                )}

                {/* Visitor Counter - show on all blog-related pages (not projects/about/resume) */}
                {!['/projects', '/about', '/resume'].some(path => pathname?.startsWith(path)) && (
                    <VisitorCounter />
                )}


            </div>
        </div>
    );
}
