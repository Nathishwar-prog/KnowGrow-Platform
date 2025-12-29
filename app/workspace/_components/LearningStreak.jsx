"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../../@/components/ui/card";
import { Zap, Trophy, Calendar } from "lucide-react";

/**
 * LearningStreak Component
 * Tracks and displays the user's daily learning streak using localStorage.
 */
const LearningStreak = () => {
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [lastVisit, setLastVisit] = useState(null);
    const [isActiveToday, setIsActiveToday] = useState(false);

    useEffect(() => {
        // Initialize streak from local storage
        const storedStreak = parseInt(localStorage.getItem('knowgrow_streak') || '0');
        const storedMaxStreak = parseInt(localStorage.getItem('knowgrow_max_streak') || '0');
        const storedLastVisit = localStorage.getItem('knowgrow_last_visit');

        // Check if the user visited today
        const today = new Date().toDateString();

        if (storedLastVisit === today) {
            // Already visited today
            setStreak(storedStreak);
            setMaxStreak(storedMaxStreak);
            setIsActiveToday(true);
            setLastVisit(storedLastVisit);
        } else {
            // New day visit
            let newStreak = storedStreak;

            if (storedLastVisit) {
                const lastVisitDate = new Date(storedLastVisit);
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                if (lastVisitDate.toDateString() === yesterday.toDateString()) {
                    // Consecutive day
                    newStreak += 1;
                } else {
                    // Streak broken (missed at least one day)
                    // Note: If storedLastVisit is older than yesterday, reset to 1 (for today)
                    newStreak = 1;
                }
            } else {
                // First ever visit
                newStreak = 1;
            }

            // Update max streak
            const newMaxStreak = Math.max(newStreak, storedMaxStreak);

            // Save to state and storage
            setStreak(newStreak);
            setMaxStreak(newMaxStreak);
            setLastVisit(today);
            setIsActiveToday(true);
            localStorage.setItem('knowgrow_streak', newStreak.toString());
            localStorage.setItem('knowgrow_max_streak', newMaxStreak.toString());
            localStorage.setItem('knowgrow_last_visit', today);
        }
    }, []);

    // Generate last 7 days for the visualizer
    const renderWeekDays = () => {
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const todayIndex = new Date().getDay(); // 0 = Sunday

        return days.map((day, index) => {
            // Simple visualization: Highlight today and previous streak days (simulated)
            // In a real backend connected app, we'd check actual history dates.
            // For this frontend-only fix with local storage logic:
            // We highlight "Today" (index === todayIndex)
            // And if we have a streak > 1, we assume previous days were active for visual continuity relative to today.

            const isToday = index === todayIndex;

            // Determine if this day should be highlighted based on current streak
            // logic: if today is Wednesday (3), and streak is 3, then Mon(1), Tue(2), Wed(3) are active.
            let isActive = false;

            // Calculate the difference in days from today
            // 0 = today, 1 = tomorrow (future), -1 = yesterday
            const diff = index - todayIndex;

            if (diff === 0) {
                isActive = isActiveToday;
            } else if (diff < 0) {
                // Past days: distinct strictly based on the streak count
                // e.g. streak 3, today Wed(3). active: 3, 2, 1. diffs: 0, -1, -2.
                // isActive if abs(diff) < streak
                isActive = Math.abs(diff) < streak;
            }

            // Wrap around week logic is complex without full calendar dates, 
            // so for this visualizer we'll stick to the current week view or simple bubbles.
            // Simplified approach for the "attractive" design request:
            // Just show 7 bubbles ending in "Today"
            return null; // Will use specialized loop below
        });
    };

    return (
        <Card className="mb-8 border-none shadow-lg bg-gradient-to-br from-indigo-600 to-violet-700 text-white overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-32 w-32 rounded-full bg-indigo-400/20 blur-2xl"></div>

            <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Zap className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Learning Streak</h2>
                            <p className="text-indigo-100 text-sm">Keep the momentum going!</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1">
                            <span className="text-4xl font-black">{streak}</span>
                            <span className="text-lg font-medium text-indigo-200">days</span>
                        </div>
                        <div className="text-xs text-indigo-300 flex items-center justify-end gap-1">
                            <Trophy className="h-3 w-3" />
                            Best: {maxStreak} days
                        </div>
                    </div>
                </div>

                {/* Progress Bar Visual */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-indigo-200 uppercase tracking-wider font-semibold">
                        <span>Streak Level</span>
                        <span>{streak < 7 ? `${7 - streak} days to 7-day goal` : 'You are on fire!'}</span>
                    </div>
                    <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-300 to-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.5)] transition-all duration-1000 ease-out"
                            style={{ width: `${Math.min(100, (streak / 30) * 100)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Weekly Bubbles */}
                <div className="mt-6 flex justify-between items-center px-2">
                    {Array.from({ length: 7 }).map((_, i) => {
                        // 6 is today (end of the representative line)
                        // i goes 0..6
                        const offset = i - 6; // -6, -5, ..., 0
                        // If streak covers this offset, it's active
                        const isActive = (streak > Math.abs(offset)) || (offset === 0 && isActiveToday);

                        // Get short day label (Today is dynamic)
                        const d = new Date();
                        d.setDate(d.getDate() + offset);
                        const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });

                        return (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
                            ${isActive
                                        ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-amber-900 shadow-lg scale-110'
                                        : 'bg-white/10 text-indigo-300 border border-white/10'}
                            ${offset === 0 ? 'ring-2 ring-white/50 ring-offset-2 ring-offset-indigo-600' : ''}
                        `}>
                                    {isActive ? <Zap className="h-3 w-3 fill-current" /> : dayName}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default LearningStreak;
