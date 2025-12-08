import Link from 'next/link';
import { FaArrowLeft, FaHome } from 'react-icons/fa';

export default function PostNavigation() {
    return (
        <nav className="flex items-center gap-4 text-sm font-medium mb-8 text-secondary">
            <Link
                href="/blog"
                className="flex items-center gap-2 hover:text-primary transition-colors"
            >
                <FaArrowLeft />
                Back to Blog
            </Link>
            <span className="text-border">|</span>
            <Link
                href="/"
                className="flex items-center gap-2 hover:text-primary transition-colors"
            >
                <FaHome />
                Home
            </Link>
        </nav>
    );
}
