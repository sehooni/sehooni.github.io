"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    // Simple range logic for now: show all if small, or limited.
    // User requested "Number buttons".
    // For simplicity, let's show all numbers if totalPages < 7, else condense?
    // Let's stick to simple list for now, or just all numbers if not massive.

    // Generating page numbers array
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-center items-center gap-2 mt-12">
            {currentPage > 1 && (
                <Link
                    href={createPageURL(currentPage - 1)}
                    className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Previous page"
                >
                    &lt;
                </Link>
            )}

            {pages.map((p) => (
                <Link
                    key={p}
                    href={createPageURL(p)}
                    className={`px-3 py-1 rounded border ${currentPage === p
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                        } transition-colors`}
                >
                    {p}
                </Link>
            ))}

            {currentPage < totalPages && (
                <Link
                    href={createPageURL(currentPage + 1)}
                    className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Next page"
                >
                    &gt;
                </Link>
            )}
        </div>
    );
}
