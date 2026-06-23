"use client";


import Link from 'next/link';
import { usePathname } from 'next/navigation';


export default function TopNav({ title: customTitle }: { title?: string }) {
    const pathname = usePathname();

    // Hide on Home page
    if (pathname === '/') return null;

    // Derive title from pathname
    let title = customTitle || 'Blog'; // Default
    if (pathname?.startsWith('/projects')) title = 'Projects';
    else if (pathname?.startsWith('/about')) title = 'About';
    else if (pathname?.startsWith('/resume')) title = 'Résumé';
    else if (pathname?.startsWith('/blog') || pathname?.startsWith('/category') || pathname?.startsWith('/posts')) title = 'Blog';

    const navItems = [
        { name: 'HOME', path: '/' },
        { name: 'BLOG', path: '/blog' },
        { name: 'ABOUT', path: '/about' },
        { name: 'RÉSUMÉ', path: '/resume' }, // Using Accent as per image
    ];


    // Determine target link based on title
    let titleHref = '/blog';
    if (title === 'Projects') titleHref = '/projects';
    else if (title === 'About') titleHref = '/about';
    else if (title === 'Résumé') titleHref = '/resume';

    const handleTitleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (pathname === titleHref) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 mb-0">
            <div className="max-w-screen-2xl mx-auto px-6 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
                    <Link href={titleHref} onClick={handleTitleClick} className="hover:text-purple-700 dark:hover:text-purple-400 transition-colors">
                        {title}
                    </Link>
                </h1>
                <ul className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm font-medium tracking-wide">
                    {navItems.map((item) => {
                        let isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));

                        // Special case for BLOG: It should be active for individual posts (/[slug]) and categories (/category/...)
                        // Logic: If it's NOT Home, Projects, About, or Resume, it's considered Blog context.
                        if (item.path === '/blog') {
                            const isMainPage = ['/', '/projects', '/about', '/resume'].some(path =>
                                pathname === path || (path !== '/' && pathname?.startsWith(path))
                            );
                            if (!isMainPage && pathname !== '/') {
                                isActive = true;
                            }
                        }
                        return (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`transition-colors ${isActive
                                        ? 'text-gray-900 dark:text-white font-bold'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}

