"use client"

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Input } from "../../../@/components/ui/input";
import { Button } from "../../../@/components/ui/button";
import { Search, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import CourseCard from "../_components/CourseCard";
import { Skeleton } from "../../../@/components/ui/skeleton";
import { Card, CardContent } from "../../../@/components/ui/card";
import { api, cancelRequest } from "../../../@/lib/api";

function Explore() {
    const [courseList, setCourseList] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useUser();
    const mountedRef = useRef(true);
    const searchTimeoutRef = useRef(null);

    useEffect(() => {
        mountedRef.current = true;
        if (user) {
            GetCourseList();
        }

        return () => {
            mountedRef.current = false;
            cancelRequest('explore-courses');
            cancelRequest('explore-search');
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [user]);

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            if (searchQuery.trim() === "") {
                setFilteredCourses(courseList);
            } else {
                handleSearch();
            }
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery, courseList]);

    const GetCourseList = useCallback(async () => {
        if (!mountedRef.current) return;
        
        try {
            setIsLoading(true);
            setError(null);
            
            const result = await api.get('/api/courses?courseId=0', {
                type: 'courses',
                key: 'explore-courses'
            });
            
            if (!mountedRef.current) return;
            
            if (result.success) {
                const courses = Array.isArray(result.data) ? result.data : [];
                setCourseList(courses);
                setFilteredCourses(courses);
            } else {
                setError(result.error || 'Failed to load courses.');
            }
        } catch (err) {
            if (mountedRef.current) {
                setError('Failed to load courses. Please try again.');
            }
        } finally {
            if (mountedRef.current) setIsLoading(false);
        }
    }, []);

    const handleSearch = useCallback(async () => {
        if (!mountedRef.current) return;
        if (searchQuery.trim() === "") {
            setFilteredCourses(courseList);
            return;
        }

        setIsSearching(true);
        try {
            const result = await api.get(`/api/courses?courseId=0&search=${encodeURIComponent(searchQuery)}`, {
                type: 'courses',
                key: 'explore-search'
            });
            
            if (!mountedRef.current) return;
            
            if (result.success) {
                setFilteredCourses(Array.isArray(result.data) ? result.data : []);
            } else {
                const filtered = courseList.filter(course => {
                    const courseJson = course?.courseJson?.course;
                    const searchLower = searchQuery.toLowerCase();
                    
                    return (
                        courseJson?.name?.toLowerCase().includes(searchLower) ||
                        courseJson?.description?.toLowerCase().includes(searchLower) ||
                        course?.name?.toLowerCase().includes(searchLower) ||
                        course?.description?.toLowerCase().includes(searchLower)
                    );
                });
                setFilteredCourses(filtered);
            }
        } catch (err) {
            if (mountedRef.current) {
                const filtered = courseList.filter(course => {
                    const courseJson = course?.courseJson?.course;
                    const searchLower = searchQuery.toLowerCase();
                    
                    return (
                        courseJson?.name?.toLowerCase().includes(searchLower) ||
                        courseJson?.description?.toLowerCase().includes(searchLower) ||
                        course?.name?.toLowerCase().includes(searchLower) ||
                        course?.description?.toLowerCase().includes(searchLower)
                    );
                });
                setFilteredCourses(filtered);
            }
        } finally {
            if (mountedRef.current) setIsSearching(false);
        }
    }, [searchQuery, courseList]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return ( 
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className='font-bold text-3xl'>Explore More Courses</h2>
                <Button 
                    variant="outline" 
                    onClick={GetCourseList}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>
            
            <div className='flex gap-3 max-w-2xl mb-6'>
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search courses by name, description..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-10 h-12 text-base"
                    />
                </div>
                <Button 
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="h-12 px-6"
                >
                    {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Search className="h-4 w-4" />
                    )}
                    Search
                </Button>
            </div>

            {isLoading && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading courses...</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                        {[0,1,2,3,4,5].map((item, index) => (
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
                            onClick={GetCourseList}
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
                            {searchQuery ? (
                                `Found ${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''} matching "${searchQuery}"`
                            ) : (
                                `Showing ${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''}`
                            )}
                        </p>
                    </div>

                    {filteredCourses.length === 0 && !isLoading && (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchQuery ? 
                                        `No courses match your search "${searchQuery}". Try different keywords.` :
                                        "No courses are available at the moment."
                                    }
                                </p>
                                {searchQuery && (
                                    <Button 
                                        variant="outline" 
                                        onClick={() => {
                                            setSearchQuery("");
                                            setFilteredCourses(courseList);
                                        }}
                                    >
                                        Clear Search
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {filteredCourses.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filteredCourses.map((course, index) => (
                                <CourseCard course={course} key={course.cid || index} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Explore;
