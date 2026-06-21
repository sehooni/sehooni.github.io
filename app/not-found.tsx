"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotFound() {
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [redirectTitle, setRedirectTitle] = useState('이전 블로그 주소를 찾았습니다!');
    const [redirectMessage, setRedirectMessage] = useState('새로운 글로 이동 중입니다...');

    useEffect(() => {
        const checkRedirect = async () => {
            const currentPath = window.location.pathname;

            // Basic cleanups for old paths
            let path = currentPath;
            if (path.endsWith('.html')) {
                path = path.replace('.html', '');
            }
            if (path.endsWith('/')) {
                path = path.slice(0, -1);
            }

            const segments = path.split('/').filter(Boolean);
            if (segments.length === 0) {
                setNotFound(true);
                return;
            }

            const lastSegment = segments[segments.length - 1];

            // Hardcoded common patterns from Jekyll
            if (lastSegment === 'categories' || lastSegment === 'tags' || lastSegment.startsWith('page')) {
                setIsRedirecting(true);
                setRedirectTitle('카테고리/태그 페이지 안내');
                setRedirectMessage('새로운 블로그 목록으로 이동합니다...');
                router.replace('/blog/');
                return;
            }

            if (lastSegment === 'category') {
                setIsRedirecting(true);
                setRedirectTitle('카테고리 페이지 안내');
                setRedirectMessage('카테고리 목록 페이지로 이동합니다...');
                router.replace('/blog/category/');
                return;
            }

            // 1. Check for known deleted/legacy paths
            const pathLower = path.toLowerCase();
            
            // Project related legacy deletions (e.g. Capstone, Neural-Style-Transfer)
            if (
                pathLower.includes('capstone') || 
                pathLower.includes('neural_style_transfer') ||
                pathLower.includes('detail_of_project') ||
                pathLower.includes('introduction_of_project') ||
                pathLower.includes('ppt_of_projects')
            ) {
                setRedirectTitle('이전 프로젝트 소개 글 안내');
                setRedirectMessage('이 프로젝트 글은 개편으로 삭제되어, 3초 후 전체 프로젝트 페이지로 이동합니다...');
                setIsRedirecting(true);
                setTimeout(() => {
                    router.replace('/projects/');
                }, 3000);
                return;
            }

            // Blog/Linux/ML/Computer Science related legacy deletions
            if (
                pathLower.includes('/blog/jekyll/') ||
                pathLower.includes('/blog/etc/') ||
                pathLower.includes('/linux/') ||
                pathLower.includes('/ml/') ||
                pathLower.includes('model_based_validation') ||
                pathLower.includes('peptide_identification') ||
                pathLower.includes('peptide_validation') ||
                pathLower.includes('computer science') ||
                pathLower.includes('computer%20science') ||
                pathLower.includes('algorithms_start') ||
                pathLower.includes('linked_list')
            ) {
                setRedirectTitle('이전 블로그 글 안내');
                setRedirectMessage('이 글은 블로그 개편 과정에서 정리되어, 3초 후 블로그 목록 페이지로 이동합니다...');
                setIsRedirecting(true);
                setTimeout(() => {
                    router.replace('/blog/');
                }, 3000);
                return;
            }

            try {
                // Fetch the new sitemap to find the matching post dynamically
                const response = await fetch('/sitemap.xml');
                if (!response.ok) throw new Error('Failed to fetch sitemap');
                const xmlText = await response.text();

                // Extract all <loc> contents using regex
                const locRegex = /<loc>(.*?)<\/loc>/g;
                let match;
                const urls: string[] = [];
                while ((match = locRegex.exec(xmlText)) !== null) {
                    urls.push(match[1]);
                }

                // Look for a URL ending with the exact same slug (last segment)
                const targetUrlStr = urls.find(url => {
                    if (!url) return false;
                    try {
                        const urlObj = new URL(url);
                        const urlPath = urlObj.pathname.replace(/\/$/, '');
                        const newSegments = urlPath.split('/').filter(Boolean);

                        if (newSegments.length === 0) return false;
                        return newSegments[newSegments.length - 1] === lastSegment;
                    } catch (e) {
                        return false;
                    }
                });

                if (targetUrlStr) {
                    setIsRedirecting(true);
                    const targetUrl = new URL(targetUrlStr);
                    router.replace(targetUrl.pathname);
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                console.error('Error during smart redirect:', error);
                setNotFound(true);
            }
        };

        checkRedirect();
    }, [router]);

    if (isRedirecting) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <h2 className="text-2xl font-bold mb-2">{redirectTitle}</h2>
                <p className="text-gray-600 dark:text-gray-400">{redirectMessage}</p>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <h1 className="text-6xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">404</h1>
                <h2 className="text-3xl font-bold mb-4">페이지를 찾을 수 없습니다</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                    앗! 요청하신 페이지가 사라졌거나 잘못된 주소입니다.<br />
                    과거 Jekyll 블로그에서 이전하시던 중이라면, 안타깝게도 해당 글을 찾을 수 없습니다.
                </p>
                <Link
                    href="/"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                    홈으로 돌아가기
                </Link>
            </div>
        );
    }

    // Initial loading state (flicker prevention before JS executes)
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="animate-pulse text-center">
                <p className="text-gray-500">주소를 확인하고 있습니다...</p>
            </div>
        </div>
    );
}
