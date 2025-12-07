import type { Metadata } from 'next';
import './globals.css';

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
        <html lang="en">
            <body className="min-h-screen flex flex-col font-sans">
                {children}
            </body>
        </html>
    );
}
