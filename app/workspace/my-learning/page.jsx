"use client"

import React, { useState, useEffect, useRef, useCallback } from "react";
import WelcomeBanner from "../_components/WelcomeBanner";
import EnrollCourseCard from "../_components/EnrollCourseCard";
import { Skeleton } from "../../../@/components/ui/skeleton";
import { Card, CardContent } from "../../../@/components/ui/card";
import { Button } from "../../../@/components/ui/button";
import { Loader2, AlertCircle, RefreshCw, BookOpen } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { api, cancelRequest } from "../../../@/lib/api";

function MyLearning() {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useUser();
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        if (user) {
            GetEnrolledCourses();
        }

        return () => {
            mountedRef.current = false;
            cancelRequest('my-learning-courses');
        };
    }, [user]);

    const GetEnrolledCourses = useCallback(async () => {
        if (!mountedRef.current) return;
        
        try {
            setIsLoading(true);
            setError(null);
            
            const result = await api.get('/api/enroll-course', {
                type: 'dashboard',
                key: 'my-learning-courses'
            });
            
            if (!mountedRef.current) return;
            
            if (result.success) {
                setEnrolledCourses(Array.isArray(result.data) ? result.data : []);
            } else {
                setError(result.error || 'Failed to load enrolled courses.');
            }
        } catch (err) {
            if (mountedRef.current) {
                setError('Failed to load your enrolled courses. Please try again.');
            }
        } finally {
            if (mountedRef.current) setIsLoading(false);
        }
    }, []);

    return ( 
        <div>
            <WelcomeBanner />
            
            <div className="flex items-center justify-between mt-5 mb-6">
                <h2 className='font-bold text-2xl'>My Learning</h2>
                <Button 
                    variant="outline" 
                    onClick={GetEnrolledCourses}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {isLoading && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading your enrolled courses...</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                        {[0,1,2,3].map((item, index) => (
                            <Skeleton key={index} className='w-full h-[280px] rounded-xl' />
                        ))}
                    </div>
                </div>
            )}

            {error && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
                    <CardContent className="flex items-center gap-3 p-6">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <div>
                            <h3 className="font-semibold text-red-700 dark:text-red-400">Error Loading Courses</h3>
                            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={GetEnrolledCourses}
                            className="ml-auto"
                        >
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            )}

            {!isLoading && !error && (
                <>
                    <div className="mb-4">
                        <p className="text-sm text-muted-foreground">
                            {enrolledCourses.length > 0 ? 
                                `You have ${enrolledCourses.length} enrolled course${enrolledCourses.length !== 1 ? 's' : ''}` :
                                'No enrolled courses found'
                            }
                        </p>
                    </div>

                    {enrolledCourses.length === 0 && (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No enrolled courses</h3>
                                <p className="text-muted-foreground mb-4">
                                    You haven't enrolled in any courses yet. Explore our course catalog to start learning!
                                </p>
                                <Button 
                                    variant="outline" 
                                    onClick={() => window.location.href = '/workspace/explore'}
                                >
                                    Explore Courses
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {enrolledCourses.length > 0 && (
                        <div className="mt-3">
                            <h2 className='font-bold text-xl bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent mb-4'>
                                Continue Learning Your Courses
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
                                {enrolledCourses.map((course, index) => (
                                    <EnrollCourseCard 
                                        course={course?.courses} 
                                        enrollCourse={course?.enrollCourse} 
                                        key={course?.enrollCourse?.id || index}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div> 
    )
}

export default MyLearning
