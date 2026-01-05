import type { Metadata } from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';
import TopNav from '@/components/TopNav';


export const metadata: Metadata = {
    title: "Sehoon's Workspace",
    description: 'Welcome to my page!',
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
