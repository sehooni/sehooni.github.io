"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function NotFoundRedirect() {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkRedirect = async () => {
            if (!pathname) return;

            try {
                // Fetch the post map
                const res = await fetch('/post-map.json');
                if (!res.ok) {
                    setIsChecking(false);
                    return;
                }
                const postMap = await res.json();

                // Normalizing path
                const cleanPath = pathname.replace(/\/+$/, '').toLowerCase(); // remove trailing slash, lowercase
                // Extract possible keys
                // 1. Full path match (e.g. /proteomics/percolator)
                // 2. Title slug match (last segment) using regular regex to capture slug even if complex path
                // Legacy URL structure was often /year/month/day/title/ or /category/title/

                // Try direct full path match
                // We stored canonicalURL in value
                // Keys in map are lowercase titleSlug or canonicalSlug

                // Direct match check (remove leading slash from cleanPath if needed depending on map keys)
                // My script stored keys like "percolator" and "proteomics/percolator" (no leading slash typically unless we added it)
                // Let's check script... 
                // canonicalSlug = "Proteomics/Percolator"
                // map["percolator"] = "/Proteomics/Percolator"
                // map["proteomics/percolator"] = "/Proteomics/Percolator"

                const pathSegments = cleanPath.split('/').filter(Boolean); // ["proteomics", "percolator"]
                const fullSlug = pathSegments.join('/'); // "proteomics/percolator"
                const titleSlug = pathSegments[pathSegments.length - 1]; // "percolator"

                if (postMap[fullSlug]) {
                    router.replace(postMap[fullSlug]);
                    return;
                }

                if (postMap[titleSlug]) {
                    router.replace(postMap[titleSlug]);
                    return;
                }

            } catch (error) {
                console.error("Failed to load redirect map:", error);
            } finally {
                setIsChecking(false);
            }
        };

        checkRedirect();
    }, [pathname, router]);

    if (isChecking) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Checking for redirected content...</p>
            </div>
        );
    }

    return null; // Return null if no redirect found (page will show 404 content)
}
