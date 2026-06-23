import Link from 'next/link';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export interface SiblingPost {
    slug: string;
    title: string;
    date: string;
    category?: string;
}

interface CategoryPostNavigationProps {
    prevPost: SiblingPost | null;
    nextPost: SiblingPost | null;
}

export default function CategoryPostNavigation({ prevPost, nextPost }: CategoryPostNavigationProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 mb-8 border-t border-border pt-8 not-prose">
            {/* Previous Post (Older) */}
            {prevPost ? (
                <Link
                    href={`/blog/${prevPost.slug}/`}
                    className="group flex flex-col items-start justify-between p-5 rounded-xl border border-border bg-gray-50/30 dark:bg-gray-900/30 hover:border-primary/50 hover:bg-gray-50/70 dark:hover:bg-gray-900/50 transition-all duration-300 shadow-xs hover:shadow-md text-left"
                >
                    <div className="flex flex-col gap-1.5 w-full">
                        <span className="text-xs font-semibold text-secondary/70 flex items-center gap-1.5 group-hover:text-primary transition-colors">
                            <FaArrowLeft size={10} className="group-hover:-translate-x-0.5 transition-transform" />
                            이전 글
                        </span>
                        <span className="font-bold text-foreground text-sm md:text-base group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                            {prevPost.title}
                        </span>
                    </div>
                </Link>
            ) : (
                <div
                    className="flex flex-col items-start justify-between p-5 rounded-xl border border-border bg-gray-50/10 dark:bg-gray-900/10 opacity-40 select-none text-left cursor-not-allowed"
                >
                    <div className="flex flex-col gap-1.5 w-full">
                        <span className="text-xs font-semibold text-secondary/50 flex items-center gap-1.5">
                            <FaArrowLeft size={10} />
                            이전 글
                        </span>
                        <span className="font-medium text-secondary/70 text-sm md:text-base italic">
                            이전 글이 없습니다
                        </span>
                    </div>
                </div>
            )}

            {/* Next Post (Newer) */}
            {nextPost ? (
                <Link
                    href={`/blog/${nextPost.slug}/`}
                    className="group flex flex-col items-end justify-between p-5 rounded-xl border border-border bg-gray-50/30 dark:bg-gray-900/30 hover:border-primary/50 hover:bg-gray-50/70 dark:hover:bg-gray-900/50 transition-all duration-300 shadow-xs hover:shadow-md text-right"
                >
                    <div className="flex flex-col gap-1.5 w-full items-end">
                        <span className="text-xs font-semibold text-secondary/70 flex items-center gap-1.5 group-hover:text-primary transition-colors">
                            다음 글
                            <FaArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                        </span>
                        <span className="font-bold text-foreground text-sm md:text-base group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                            {nextPost.title}
                        </span>
                    </div>
                </Link>
            ) : (
                <div
                    className="flex flex-col items-end justify-between p-5 rounded-xl border border-border bg-gray-50/10 dark:bg-gray-900/10 opacity-40 select-none text-right cursor-not-allowed"
                >
                    <div className="flex flex-col gap-1.5 w-full items-end">
                        <span className="text-xs font-semibold text-secondary/50 flex items-center gap-1.5">
                            다음 글
                            <FaArrowRight size={10} />
                        </span>
                        <span className="font-medium text-secondary/70 text-sm md:text-base italic">
                            다음 글이 없습니다
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
