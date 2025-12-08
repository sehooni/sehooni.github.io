"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TopNavProps {
    title: string;
}

export default function TopNav({ title }: TopNavProps) {
    const pathname = usePathname();

    const navItems = [
        { name: 'HOME', path: '/' },
        { name: 'BLOG', path: '/blog' },
        { name: 'PROJECTS', path: '/projects' },
        { name: 'ABOUT', path: '/about' },
        { name: 'RÉSUMÉ', path: '/resume' }, // Using Accent as per image
    ];

    return (
        <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-800 mb-8 md:mb-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
                {title}
            </h1>
            <ul className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm font-medium tracking-wide">
                {navItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
                    return (
                        <li key={item.path}>
                            <Link
                                href={item.path}
                                className={`transition-colors ${isActive
                                        ? 'text-gray-900 dark:text-white font-bold'
                                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
