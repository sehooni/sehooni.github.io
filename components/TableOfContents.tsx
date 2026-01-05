"use client";

import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface TableOfContentsProps {
    content: string;
}

interface Heading {
    id: string;
    text: string;
    level: number;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Remove code blocks to avoid capturing comments or code as headings
        // Matches ```...``` blocks (multiline)
        const contentWithoutCode = content.replace(/```[\s\S]*?```/g, '');

        // Simple regex to extract headings from markdown
        // Matches # Heading, ## Heading, etc.
        const regex = /^(#{1,3})\s+(.+)$/gm;
        const extractedHeadings: Heading[] = [];
        let match;

        while ((match = regex.exec(contentWithoutCode)) !== null) {
            const level = match[1].length;
            let text = match[2].trim();

            // Basic markdown stripping for display text and ID
            // Remove bold/italic (* or _)
            text = text.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1');
            // Remove links [text](url) -> text
            text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
            // Remove code `code` -> code
            text = text.replace(/`([^`]+)`/g, '$1');

            // Create a simple ID from text
            const id = text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');

            extractedHeadings.push({ id, text, level });
        }

        setHeadings(extractedHeadings);
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '0px 0px -80% 0px' }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <nav className="hidden xl:block w-48 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pl-6 border-l border-gray-200 dark:border-gray-800">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">On this page</h4>
            <ul className="space-y-2 text-sm">
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        style={{ paddingLeft: `${(heading.level - 1) * 0.5}rem` }}
                    >
                        <a
                            href={`#${heading.id}`}
                            className={clsx(
                                "block transition-colors duration-200",
                                activeId === heading.id
                                    ? "text-primary font-medium"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                                setActiveId(heading.id);
                            }}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
