import type { Metadata } from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';
import TopNav from '@/components/TopNav';


export const metadata: Metadata = {
    metadataBase: new URL('https://sehooni.github.io'),
    title: {
        default: "Sehoon Park | AI Researcher & Developer",
        template: "%s | Sehoon Park"
    },
    description: 'Portfolio and Technical Blog of Sehoon Park. Specializing in Protein Structure Prediction, Deep Learning, and AI Research.',
    keywords: ['AI', 'Deep Learning', 'Protein Structure Prediction', 'Bioinformatics', 'Sehoon Park', 'Portfolio', 'Blog'],
    authors: [{ name: 'Sehoon Park' }],
    creator: 'Sehoon Park',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://sehooni.github.io',
        title: "Sehoon Park | AI Researcher & Developer",
        description: 'Portfolio and Technical Blog involving AI, Protein Structure Prediction, and Deep Learning projects.',
        siteName: "Sehoon's Workspace",
        images: [
            {
                url: '/assets/img/Self.jpeg', // Fallback image
                width: 800,
                height: 800,
                alt: 'Sehoon Park Profile',
            },
        ],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'googleb8418246c9913ea7', // Re-adding verification code explicitly just in case
    },
    alternates: {
        canonical: 'https://sehooni.github.io',
        types: {
            'application/rss+xml': 'https://sehooni.github.io/feed.xml',
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen flex flex-col font-sans bg-background text-foreground transition-colors duration-300">
                <TopNav />
                {children}

            </body>
        </html>
    );
}
