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
            const namespace = "sehooni-github-io";
            
            // Generate timezone-safe YYYY-MM-DD string
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;

            const totalKey = "total-visitors";
            const todayKey = `today-visitors-${todayStr}`;
            const storageKey = `visited-date-${todayStr}`;

            const totalUrl = `https://api.counterapi.dev/v1/${namespace}/${totalKey}`;
            const totalUpUrl = `https://api.counterapi.dev/v1/${namespace}/${totalKey}/up`;
            const todayUrl = `https://api.counterapi.dev/v1/${namespace}/${todayKey}`;
            const todayUpUrl = `https://api.counterapi.dev/v1/${namespace}/${todayKey}/up`;

            try {
                const hasVisitedToday = localStorage.getItem(storageKey);
                let finalTotal = 0;
                let finalToday = 0;
                const offset = 38000;

                // Helper to safely fetch count or fallback to incrementing if not found
                const safeFetch = async (getUrl: string, upUrl: string, increment: boolean) => {
                    try {
                        if (increment) {
                            const res = await fetch(upUrl);
                            if (res.ok) {
                                const data = await res.json();
                                return data.value || 0;
                            }
                        } else {
                            const res = await fetch(getUrl);
                            if (res.ok) {
                                const data = await res.json();
                                return data.value || 0;
                            }
                            // If GET fails (e.g. key doesn't exist yet), initialize it
                            const resUp = await fetch(upUrl);
                            if (resUp.ok) {
                                const data = await resUp.json();
                                return data.value || 0;
                            }
                        }
                    } catch (err) {
                        console.error("Error in visitor api call", err);
                    }
                    return 0;
                };

                if (!hasVisitedToday) {
                    // First visit of the day -> increment both counters
                    const [totalVal, todayVal] = await Promise.all([
                        safeFetch(totalUrl, totalUpUrl, true),
                        safeFetch(todayUrl, todayUpUrl, true)
                    ]);
                    finalTotal = totalVal ? totalVal + offset : offset;
                    finalToday = todayVal;

                    // Save visit flag
                    localStorage.setItem(storageKey, "true");

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
                    // Already visited today -> retrieve current values without incrementing
                    const [totalVal, todayVal] = await Promise.all([
                        safeFetch(totalUrl, totalUpUrl, false),
                        safeFetch(todayUrl, todayUpUrl, false)
                    ]);
                    finalTotal = totalVal ? totalVal + offset : offset;
                    finalToday = todayVal;
                }

                // If values are 0 (e.g. API down or network issue), use a sensible placeholder
                setStats({
                    total: finalTotal,
                    today: finalToday,
                    loading: false
                });

            } catch (err) {
                console.error("Failed to process visitor counts", err);
                setStats({
                    total: 38000,
                    today: 0,
                    loading: false
                });
            }
        };

        fetchVisitorStats();
    }, []);

    return (
        <div className="w-full bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-md rounded-xl p-3.5 border border-gray-200/80 dark:border-gray-800/80 mb-5 text-xs flex justify-between items-center transition-all duration-300 hover:shadow-md hover:border-primary/30 dark:hover:border-primary/30">
            <div className="flex items-center gap-2 flex-1 justify-center">
                <UserCheck className="text-primary w-4 h-4 shrink-0" />
                <span className="text-gray-500 dark:text-gray-400 font-medium">Today</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 min-w-[20px] text-center">
                    {stats.loading ? (
                        <span className="inline-block w-4 h-3 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                    ) : (
                        stats.today.toLocaleString()
                    )}
                </span>
            </div>
            
            <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-2" />
            
            <div className="flex items-center gap-2 flex-1 justify-center">
                <Users className="text-purple-500 w-4 h-4 shrink-0" />
                <span className="text-gray-500 dark:text-gray-400 font-medium">Total</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 min-w-[25px] text-center">
                    {stats.loading ? (
                        <span className="inline-block w-6 h-3 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                    ) : (
                        stats.total.toLocaleString()
                    )}
                </span>
            </div>
        </div>
    );
}
