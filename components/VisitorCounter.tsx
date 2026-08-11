"use client";

import { useState, useEffect } from 'react';
import { Users, UserCheck } from 'lucide-react';

interface VisitorState {
    total: number;
    today: number;
    loading: boolean;
}

export default function VisitorCounter() {
    const [stats, setStats] = useState<VisitorState>({
        total: 0,
        today: 0,
        loading: true,
    });

    useEffect(() => {
        const fetchVisitorStats = async () => {
            const blogUrl = "https://sehooni.github.io";

            // Generate timezone-safe YYYY-MM-DD string
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;

            const storageKey = `visited-date-${todayStr}`;
            const totalCacheKey = `visitor-total-cache`;
            const todayCacheKey = `visitor-today-cache`;

            const apiUrl = `https://hitscounter.dev/api/hit?output=json&url=${encodeURIComponent(blogUrl)}`;
            const offset = 38001;

            try {
                const hasVisitedToday = localStorage.getItem(storageKey);
                let finalTotal = 0;
                let finalToday = 0;

                if (!hasVisitedToday) {
                    // First visit of the day -> call API to increment count and fetch values
                    const res = await fetch(apiUrl);
                    if (res.ok) {
                        const data = await res.json();
                        finalTotal = (data.total_hits || 0) + offset;
                        finalToday = data.today_hits || 0;

                        // Save to cache
                        localStorage.setItem(storageKey, "true");
                        localStorage.setItem(totalCacheKey, String(finalTotal));
                        localStorage.setItem(todayCacheKey, String(finalToday));
                    } else {
                        throw new Error("API response not ok");
                    }

                    // Clean up old visit flags from previous days to keep localStorage clean
                    try {
                        for (let i = 0; i < localStorage.length; i++) {
                            const key = localStorage.key(i);
                            if (key && key.startsWith("visited-date-") && key !== storageKey) {
                                localStorage.removeItem(key);
                            }
                        }
                    } catch (e) {
                        // ignore localStorage cleanup errors
                    }
                } else {
                    // Already visited today -> retrieve cached values
                    const cachedTotal = localStorage.getItem(totalCacheKey);
                    const cachedToday = localStorage.getItem(todayCacheKey);

                    if (cachedTotal && cachedToday) {
                        finalTotal = parseInt(cachedTotal, 10);
                        finalToday = parseInt(cachedToday, 10);
                    } else {
                        // Cache missing -> fetch API as fallback (will increment count once)
                        const res = await fetch(apiUrl);
                        if (res.ok) {
                            const data = await res.json();
                            finalTotal = (data.total_hits || 0) + offset;
                            finalToday = data.today_hits || 0;
                            localStorage.setItem(totalCacheKey, String(finalTotal));
                            localStorage.setItem(todayCacheKey, String(finalToday));
                        }
                    }
                }

                setStats({
                    total: finalTotal,
                    today: finalToday,
                    loading: false
                });

            } catch (err) {
                console.error("Failed to process visitor counts", err);
                const cachedTotal = localStorage.getItem(totalCacheKey);
                const cachedToday = localStorage.getItem(todayCacheKey);
                setStats({
                    total: cachedTotal ? parseInt(cachedTotal, 10) : 38000,
                    today: cachedToday ? parseInt(cachedToday, 10) : 0,
                    loading: false
                });
            }
        };

        fetchVisitorStats();
    }, []);

    return (
        <div className="w-full bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-md rounded-xl p-3 border border-gray-200/80 dark:border-gray-800/80 mb-5 text-xs flex flex-col gap-2 transition-all duration-300 hover:shadow-md hover:border-primary/30 dark:hover:border-primary/30">
            {/* Total Row */}
            <div className="flex items-center justify-between px-1 py-0.5">
                <div className="flex items-center gap-2">
                    <Users className="text-purple-500 w-4 h-4 shrink-0" />
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Total</span>
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-200">
                    {stats.loading ? (
                        <span className="inline-block w-8 h-3 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                    ) : (
                        stats.total.toLocaleString()
                    )}
                </span>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gray-200/80 dark:bg-gray-800/80" />

            {/* Today Row */}
            <div className="flex items-center justify-between px-1 py-0.5">
                <div className="flex items-center gap-2">
                    <UserCheck className="text-primary w-4 h-4 shrink-0" />
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Today</span>
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-200">
                    {stats.loading ? (
                        <span className="inline-block w-6 h-3 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                    ) : (
                        stats.today.toLocaleString()
                    )}
                </span>
            </div>
        </div>
    );
}

