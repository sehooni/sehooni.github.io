'use client';

import { useEffect, useRef } from 'react';

export default function Comments() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Remove any existing script to prevent duplicates on re-renders
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://utteranc.es/client.js';
        script.setAttribute('repo', 'sehooni/sehooni.github.io');
        script.setAttribute('issue-term', 'pathname');
        script.setAttribute('theme', 'github-light');
        script.setAttribute('crossorigin', 'anonymous');
        script.async = true;

        containerRef.current.appendChild(script);
    }, []);

    return <div ref={containerRef} className="mt-10 border-t pt-10" />;
}
