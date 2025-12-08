import Link from 'next/link';
import Image from 'next/image';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

import { PostData } from '@/lib/posts';

interface SidebarProps {
    categories: Record<string, number>;
    recentPosts?: PostData[];
}

export default function Sidebar({ categories, recentPosts }: SidebarProps) {
    return (
        <div className="w-full lg:w-64 flex-shrink-0 lg:block bg-sidebar-bg border-r border-border h-auto lg:h-screen lg:sticky lg:top-0 overflow-y-auto sidebar-scroll font-sans">
            <div className="p-6">
                {/* Profile Section */}
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

                {/* Navigation */}
                <nav className="mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3 pb-1 border-b border-border">
                        Navigation
                    </h3>
                    <ul className="space-y-1 text-sm">
                        <li>
                            <Link href="/" className="block py-1.5 text-foreground hover:text-primary hover:underline transition-colors">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="block py-1.5 text-foreground hover:text-primary hover:underline transition-colors">
                                About
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Categories */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3 pb-1 border-b border-border">
                        Categories
                    </h3>
                    <ul className="space-y-1 text-sm">
                        {Object.entries(categories).map(([category, count]) => (
                            <li key={category} className="flex justify-between items-center group">
                                <Link
                                    href={`/category/${category}/`}
                                    className="block py-1.5 text-foreground hover:text-primary hover:underline transition-colors truncate max-w-[80%]"
                                >
                                    {category}
                                </Link>
                                <span className="text-xs text-secondary bg-white px-2 py-0.5 rounded-full border border-border group-hover:border-primary group-hover:text-primary transition-colors">
                                    {count}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Recent Posts */}
                {recentPosts && recentPosts.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3 pb-1 border-b border-border">
                            Recent Posts
                        </h3>
                        <ul className="space-y-3 text-sm">
                            {recentPosts.map((post) => (
                                <li key={post.slug}>
                                    <Link
                                        href={`/${post.slug}/`}
                                        className="block group"
                                    >
                                        <span className="block text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-0.5">
                                            {post.title}
                                        </span>
                                        <span className="text-xs text-cool-gray-400 group-hover:text-cool-gray-500 transition-colors">
                                            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
