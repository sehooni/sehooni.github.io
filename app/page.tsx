import Image from 'next/image';
import Link from 'next/link';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen space-y-8 p-4">
            {/* Profile Section */}
            <div className="flex flex-col items-center space-y-4">
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image
                        src="/assets/img/Self.jpeg"
                        alt="Sehoon Park"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                        Sehoon Park
                    </h1>
                    <p className="text-xl text-gray-500 font-light">
                        Welcome to my page!
                    </p>
                </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-6 text-2xl text-gray-800 dark:text-gray-200">
                <a href="https://www.linkedin.com/in/sehoon-park-575b8b22a/?locale=ko_KR" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">
                    <FaLinkedin />
                </a>
                <a href="https://github.com/sehooni" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">
                    <FaGithub />
                </a>
                <a href="mailto:74sehoon@gmail.com" className="hover:text-gray-600 transition-colors">
                    <FaEnvelope />
                </a>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-wrap justify-center gap-8 md:gap-16 mt-8">
                <Link href="/blog" className="text-2xl text-purple-700 hover:text-purple-900 font-light transition-colors">
                    Blog
                </Link>
                <Link href="/projects" className="text-2xl text-purple-700 hover:text-purple-900 font-light transition-colors">
                    Projects
                </Link>
                <Link href="/about" className="text-2xl text-purple-700 hover:text-purple-900 font-light transition-colors">
                    About
                </Link>
                <Link href="/resume" className="text-2xl text-purple-700 hover:text-purple-900 font-light transition-colors">
                    Résumé
                </Link>
            </nav>

            {/* Footer Divider */}
            <div className="w-full max-w-2xl h-px bg-gray-200 mt-12 mb-8 relative flex justify-center">
                <span className="bg-white px-2 absolute -top-1.5 w-3 h-3 border border-gray-200 rounded-full"></span>
            </div>

            {/* Footer */}
            <footer className="text-center text-sm text-gray-500 font-light">
                <p>Sehoon Park © 2025 <span className="inline-block transform rotate-45">📡</span></p>
                <p>Indigo theme by Kopplin</p>
            </footer>
        </main>
    );
}
