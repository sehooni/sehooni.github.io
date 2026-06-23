import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Projects',
    description: 'Portfolio of research and engineering projects by Sehoon Park in Deep Learning, Bioinformatics, and AI.',
    alternates: {
        canonical: 'https://sehooni.github.io/projects/',
    },
};

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
