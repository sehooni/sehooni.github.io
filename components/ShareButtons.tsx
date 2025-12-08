"use client";

import { FaTwitter, FaLinkedin, FaLink, FaFacebook } from 'react-icons/fa';
import { useState } from 'react';

interface ShareButtonsProps {
    title: string;
    slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    // We need to wait for client-side to get window.location.origin
    // or we can just use a relative link if we had the full domain in config
    // safer to use window location or assume production domain if set

    const getUrl = () => {
        if (typeof window !== 'undefined') {
            return `${window.location.origin}/${slug}`;
        }
        return `/${slug}`;
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(getUrl());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const encodedTitle = encodeURIComponent(title);

    // Links need full URL. Since this is SSG, we might default to `https://sehooni.github.io`
    // but client-side generation is safer.
    // For now, let's use client-side only structure or placeholders.
    // Ideally we pass full URL from parent or construct it.

    // Let's use a simpler Client Component approach.
    const url = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <div className="flex items-center gap-4 my-8 border-t border-b py-6 border-border">
            <span className="font-bold text-sm text-secondary uppercase tracking-wider">Share</span>

            <a
                href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-blue-500 hover:text-white transition-colors dark:bg-gray-800"
                aria-label="Share on Twitter"
            >
                <FaTwitter size={18} />
            </a>

            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white transition-colors dark:bg-gray-800"
                aria-label="Share on Facebook"
            >
                <FaFacebook size={18} />
            </a>

            <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 hover:bg-blue-700 hover:text-white transition-colors dark:bg-gray-800"
                aria-label="Share on LinkedIn"
            >
                <FaLinkedin size={18} />
            </a>

            <button
                onClick={handleCopy}
                className={`p-2 rounded-full transition-colors relative ${copied
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                    }`}
                aria-label="Copy link"
            >
                <FaLink size={18} />
                {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded">
                        Copied!
                    </span>
                )}
            </button>
        </div>
    );
}
