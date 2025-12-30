"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { Progress } from "../../../@/components/ui/progress";
import {
  BookOpen,
  Target,
  TrendingUp,
  CheckCircle,
  Calendar,
  Award,
  Zap,
  Activity
} from "lucide-react";
import { getActivities, formatTimeAgo } from "./ActivityLogger";

const ProgressDashboard = ({ enrolledCourses = [] }) => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalChapters: 0,
    completedChapters: 0,
    averageProgress: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [courseProgressList, setCourseProgressList] = useState([]);

  useEffect(() => {
    calculateStats();
    // Load activities
    setRecentActivities(getActivities());

    // Listen for storage events to update activity feed in real-time (across tabs or components)
    const handleStorageChange = () => {
      setRecentActivities(getActivities());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [enrolledCourses]);

  const calculateStats = () => {
    const totalCourses = enrolledCourses.length;
    let completedCourses = 0;
    let inProgressCourses = 0;
    let totalChapters = 0;
    let allCompletedChaptersCount = 0;

    const progressList = enrolledCourses.map(enrollment => {
      const course = enrollment?.courses;
      const enrollData = enrollment?.enrollCourse;

      if (!course || !enrollData) return null;

      const courseTotalChapters = course.noOfChapters || 0; // Fallback to 0 if undefined
      const completedList = enrollData.completedChapters || []; // Ensure array
      const completedCount = completedList.length;

      totalChapters += courseTotalChapters;
      allCompletedChaptersCount += completedCount;

      // Calculate individual course progress
      const progress = courseTotalChapters > 0
        ? Math.round((completedCount / courseTotalChapters) * 100)
        : 0;

      if (progress >= 100) {
        completedCourses++;
      } else if (progress > 0) {
        inProgressCourses++;
      }

      return {
        id: course.cid,
        title: course.name,
        progress: Math.min(100, progress), // Cap at 100
        chapters: courseTotalChapters,
        completed: completedCount
      };
    }).filter(Boolean);

    setCourseProgressList(progressList);

    const averageProgress = totalChapters > 0
      ? Math.round((allCompletedChaptersCount / totalChapters) * 100)
      : 0;

    setStats({
      totalCourses,
      completedCourses,
      inProgressCourses,
      totalChapters,
      completedChapters: allCompletedChaptersCount,
      averageProgress
    });
  };

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-foreground mb-6">Your Learning Progress</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border shadow-sm bg-card hover:shadow-md transition-all dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.totalCourses}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm bg-card hover:shadow-md transition-all dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.completedCourses}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm bg-card hover:shadow-md transition-all dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.inProgressCourses}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                <Target className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm bg-card hover:shadow-md transition-all dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Progress</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.averageProgress}%</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-3">
              <Progress value={stats.averageProgress} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Progress List */}
        <Card className="border shadow-sm bg-card dark:border-slate-800 overflow-hidden flex flex-col">
          <CardHeader className="sticky top-0 bg-card/80 backdrop-blur-sm z-10 pb-3 border-b dark:border-slate-800">
            <CardTitle className="flex items-center text-lg text-foreground">
              <Target className="mr-2 h-5 w-5 text-blue-500" />
              Detailed Course Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6 max-h-[450px] overflow-y-auto custom-scrollbar">
            {courseProgressList.length > 0 ? (
              courseProgressList.map((course, index) => (
                <div key={index} className="space-y-2 group">
                  <div className="flex justify-between items-end">
                    <h3 className="font-medium text-foreground group-hover:text-blue-600 transition-colors">{course.title}</h3>
                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded">
                      {course.completed}/{course.chapters} Ch
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Progress value={course.progress} className="flex-1 h-2" indicatorClassName={course.progress === 100 ? "bg-green-500" : course.progress > 50 ? "bg-blue-500" : "bg-amber-500"} />
                    <span className="text-sm font-bold text-foreground w-10 text-right">
                      {course.progress}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium">No courses Enrolled</p>
                <p className="text-xs text-muted-foreground mt-1">Start learning to see your progress here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Learning Activity */}
        <Card className="border shadow-sm bg-card dark:border-slate-800 overflow-hidden flex flex-col">
          <CardHeader className="sticky top-0 bg-card/80 backdrop-blur-sm z-10 pb-3 border-b dark:border-slate-800">
            <CardTitle className="flex items-center text-lg text-foreground">
              <Activity className="mr-2 h-5 w-5 text-green-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 max-h-[450px] overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start group">
                    <div className="flex-shrink-0 mt-1 relative">
                      {/* Line connector */}
                      <div className="absolute top-8 left-1/2 -ml-px w-0.5 h-full bg-muted group-last:hidden" aria-hidden="true"></div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-card relative z-10 ${activity.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                          activity.type === 'award' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                        {activity.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
                          activity.type === 'award' ? <Award className="h-4 w-4" /> :
                            <BookOpen className="h-4 w-4" />}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-medium">No recent activity</p>
                  <p className="text-xs text-muted-foreground mt-1">Your learning actions will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressDashboard;