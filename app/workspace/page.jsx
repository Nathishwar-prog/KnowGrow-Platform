"use client";

import React, { useEffect, useState } from "react";
import WelcomeBanner from "./_components/WelcomeBanner";
import CourseCard from "./_components/CourseCard";
import EnrollCourseCard from "./_components/EnrollCourseCard";
import RecommendedCourses from "./_components/RecommendedCourses";
import ProgressDashboard from "./_components/ProgressDashboard";
import StudyTimer from "./_components/StudyTimer";
import StudyGroups from "./_components/StudyGroups";
import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Loader2, AlertCircle, RefreshCw, BookOpen, Plus, Trophy, Star, Award, Target } from "lucide-react";
import AddNewCourseDialog from "./_components/AddNewCourseDialog";
import LearningStreak from "./_components/LearningStreak";
import { OnboardingTour } from "~/components/ui/onboarding-tour";
import { useDashboard } from "../../context/DashboardContext";
import axios from "axios";

function AchievementsSection({ achievements, loading }) {
    const achievementIcons = {
        "first_course": <BookOpen className="w-6 h-6" />,
        "quiz_master": <Target className="w-6 h-6" />,
        "streak_7": <Star className="w-6 h-6" />,
        "streak_30": <Trophy className="w-6 h-6" />,
        "course_completed": <Award className="w-6 h-6" />
    };

    if (loading) {
        return (
            <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className='font-bold text-xl bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent'>
                        Your Achievements
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[0, 1, 2].map((item, index) => (
                        <Skeleton key={index} className='w-full h-[100px] rounded-xl' />
                    ))}
                </div>
            </div>
        );
    }

    if (!achievements || achievements.length === 0) return null;

    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
                <h2 className='font-bold text-xl bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent'>
                    Your Achievements
                </h2>
                <p className="text-sm text-muted-foreground">
                    {achievements.length} achievement{achievements.length !== 1 ? 's' : ''}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                    <div key={achievement.id || index} className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4 flex items-center space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                            {achievementIcons[achievement.achievementType] || <Trophy className="w-6 h-6" />}
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">{achievement.achievementName}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            {achievement.points > 0 && (
                                <span className="inline-flex items-center text-xs font-medium mt-1 text-amber-600 dark:text-amber-400">
                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                    {achievement.points} points
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-10">
            <Skeleton className="h-32 w-full rounded-xl" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[0, 1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Skeleton className="h-96 rounded-xl" />
                <Skeleton className="h-96 rounded-xl" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-72 rounded-xl" />
                ))}
            </div>
        </div>
    );
}

function DashboardError({ error, onRetry }) {
    return (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
                    Failed to Load Dashboard
                </h3>
                <p className="text-sm text-red-600 dark:text-red-300 mb-6 max-w-md">
                    {error || "Something went wrong while loading your dashboard. Please try again."}
                </p>
                <Button onClick={onRetry} variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </Button>
            </CardContent>
        </Card>
    );
}

function Workspace() {
    const { data, loading, error, refresh, isReady } = useDashboard();
    const [showOnboarding, setShowOnboarding] = useState(false);

    const enrolledCourses = data?.courses?.enrolled || [];
    const userCourses = data?.courses?.created || [];
    const achievements = data?.achievements || [];
    const progress = data?.progress || null;
    const recentActivity = data?.recentActivity || [];
    const isOnboarded = data?.user?.isOnboarded ?? true;

    useEffect(() => {
        if (isReady && !isOnboarded) {
            setTimeout(() => setShowOnboarding(true), 500);
        }
    }, [isReady, isOnboarded]);

    const handleOnboardingComplete = async () => {
        setShowOnboarding(false);
        try {
            await axios.patch('/api/user', { isOnboarded: true });
        } catch (err) {
            console.error('Error updating onboarding status:', err);
        }
    };

    if (loading && !data) {
        return (
            <div>
                <WelcomeBanner />
                <div className="mt-6">
                    <DashboardSkeleton />
                </div>
            </div>
        );
    }

    if (error && !data) {
        return (
            <div>
                <WelcomeBanner />
                <div className="mt-6">
                    <DashboardError error={error} onRetry={refresh} />
                </div>
            </div>
        );
    }

    return (
        <div>
            <OnboardingTour
                isOpen={showOnboarding}
                onComplete={handleOnboardingComplete}
            />

            <WelcomeBanner />

            <StudyTimer />

            <LearningStreak />

            <div className="flex justify-end mb-6">
                <Button
                    variant="outline"
                    onClick={refresh}
                    disabled={loading}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Refreshing...' : 'Refresh All'}
                </Button>
            </div>

            <ProgressDashboard
                progress={progress}
                recentActivity={recentActivity}
                loading={loading && !data}
            />

            <RecommendedCourses enrolledCourses={enrolledCourses} />

            <StudyGroups />

            <AchievementsSection achievements={achievements} loading={loading && !data} />

            <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className='font-bold text-xl bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent'>
                        Continue Learning Your Courses
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {enrolledCourses.length > 0 ?
                            `${enrolledCourses.length} enrolled course${enrolledCourses.length !== 1 ? 's' : ''}` :
                            'No enrolled courses'
                        }
                    </p>
                </div>

                {loading && !data ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Loading enrolled courses...</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                            {[0, 1, 2].map((item, index) => (
                                <Skeleton key={index} className='w-full h-[280px] rounded-xl' />
                            ))}
                        </div>
                    </div>
                ) : enrolledCourses.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                            <BookOpen className="h-8 w-8 text-muted-foreground mb-3" />
                            <h3 className="font-semibold mb-2">No enrolled courses</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Explore our course catalog to start learning!
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.href = '/workspace/explore'}
                            >
                                Explore Courses
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
                        {enrolledCourses.map((course, index) => (
                            <EnrollCourseCard
                                course={course?.courses}
                                enrollCourse={course?.enrollCourse}
                                key={course?.enrollCourse?.id || index}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-xl">Your Created Courses</h2>
                    <p className="text-sm text-muted-foreground">
                        {userCourses.length > 0 ?
                            `${userCourses.length} course${userCourses.length !== 1 ? 's' : ''} created` :
                            'No courses created'
                        }
                    </p>
                </div>

                {loading && !data ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Loading your courses...</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                            {[0, 1, 2, 3].map((item, index) => (
                                <Skeleton key={index} className='w-full h-[280px] rounded-xl' />
                            ))}
                        </div>
                    </div>
                ) : userCourses.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No courses created yet</h3>
                            <p className="text-muted-foreground mb-6">
                                Start creating your first course to share your knowledge with others!
                            </p>
                            <AddNewCourseDialog>
                                <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Your First Course
                                </Button>
                            </AddNewCourseDialog>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                        {userCourses.map((course, index) => (
                            <CourseCard course={course} key={course.cid || index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Workspace;
