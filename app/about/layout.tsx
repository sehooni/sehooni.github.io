import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About',
    description: 'About Sehoon Park - AI Researcher & Developer, specializing in protein structure prediction and bioinformatics.',
    alternates: {
        canonical: 'https://sehooni.github.io/about/',
    },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
