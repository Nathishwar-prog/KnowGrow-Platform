"use client"

import React, { useState, useEffect } from "react";
import WelcomeBanner from "./_components/WelcomeBanner";
import CourseCard from "./_components/CourseCard";
import EnrollCourseCard from "./_components/EnrollCourseCard";
import { Skeleton } from "../../@/components/ui/skeleton";
import { Card, CardContent } from "../../@/components/ui/card";
import { Button } from "../../@/components/ui/button";
import { Loader2, AlertCircle, RefreshCw, BookOpen, Plus } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import AddNewCourseDialog from "./_components/AddNewCourseDialog";

function Workspace() {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [userCourses, setUserCourses] = useState([]);
    const [isLoadingEnrolled, setIsLoadingEnrolled] = useState(false);
    const [isLoadingUserCourses, setIsLoadingUserCourses] = useState(false);
    const [errorEnrolled, setErrorEnrolled] = useState(null);
    const [errorUserCourses, setErrorUserCourses] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        user && GetEnrolledCourses();
        user && GetUserCourses();
    }, [user]);

    const GetEnrolledCourses = async () => {
        try {
            setIsLoadingEnrolled(true);
            setErrorEnrolled(null);
            const result = await axios.get('/api/enroll-course');
            console.log('Enrolled courses:', result.data);
            setEnrolledCourses(result.data);
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
            setErrorEnrolled('Failed to load your enrolled courses. Please try again.');
        } finally {
            setIsLoadingEnrolled(false);
        }
    };

    const GetUserCourses = async () => {
        try {
            setIsLoadingUserCourses(true);
            setErrorUserCourses(null);
            const result = await axios.get("/api/courses");
            console.log('User courses:', result.data);
            setUserCourses(result.data);
        } catch (error) {
            console.error('Error fetching user courses:', error);
            setErrorUserCourses('Failed to load your created courses. Please try again.');
        } finally {
            setIsLoadingUserCourses(false);
        }
    };

    const refreshAll = () => {
        GetEnrolledCourses();
        GetUserCourses();
    };

    return (
        <div>
            <WelcomeBanner />
            
            {/* Refresh Button */}
            <div className="flex justify-end mb-6">
                <Button 
                    variant="outline" 
                    onClick={refreshAll}
                    disabled={isLoadingEnrolled || isLoadingUserCourses}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${(isLoadingEnrolled || isLoadingUserCourses) ? 'animate-spin' : ''}`} />
                    Refresh All
                </Button>
            </div>

            {/* Enrolled Courses Section */}
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

                {/* Enrolled Courses Loading */}
                {isLoadingEnrolled && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Loading enrolled courses...</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                            {[0,1,2].map((item, index) => (
                                <Skeleton key={index} className='w-full h-[280px] rounded-xl' />
                            ))}
                        </div>
                    </div>
                )}

                {/* Enrolled Courses Error */}
                {errorEnrolled && (
                    <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
                        <CardContent className="flex items-center gap-3 p-6">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <div>
                                <h3 className="font-semibold text-red-700 dark:text-red-400">Error Loading Enrolled Courses</h3>
                                <p className="text-sm text-red-600 dark:text-red-300">{errorEnrolled}</p>
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

                {/* Enrolled Courses Content */}
                {!isLoadingEnrolled && !errorEnrolled && (
                    <>
                        {enrolledCourses.length === 0 ? (
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
                    </>
                )}
            </div>

            {/* User Created Courses Section */}
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

                {/* User Courses Loading */}
                {isLoadingUserCourses && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Loading your courses...</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                            {[0,1,2,3].map((item, index) => (
                                <Skeleton key={index} className='w-full h-[280px] rounded-xl' />
                            ))}
                        </div>
                    </div>
                )}

                {/* User Courses Error */}
                {errorUserCourses && (
                    <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
                        <CardContent className="flex items-center gap-3 p-6">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <div>
                                <h3 className="font-semibold text-red-700 dark:text-red-400">Error Loading Your Courses</h3>
                                <p className="text-sm text-red-600 dark:text-red-300">{errorUserCourses}</p>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={GetUserCourses}
                                className="ml-auto"
                            >
                                Retry
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* User Courses Content */}
                {!isLoadingUserCourses && !errorUserCourses && (
                    <>
                        {userCourses.length === 0 ? (
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
                    </>
                )}
            </div>
        </div>
    );
}

export default Workspace;