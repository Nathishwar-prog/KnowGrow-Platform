"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { Progress } from "../../../@/components/ui/progress";
import { Skeleton } from "../../../@/components/ui/skeleton";
import {
  BookOpen,
  Target,
  TrendingUp,
  CheckCircle,
  Award,
  Activity
} from "lucide-react";

function formatTimeAgo(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function ProgressSkeleton() {
  return (
    <div className="mb-10">
      <Skeleton className="h-8 w-64 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  );
}

const ProgressDashboard = ({ progress, recentActivity = [], loading = false }) => {
  if (loading) {
    return <ProgressSkeleton />;
  }

  const stats = {
    totalCourses: progress?.totalCourses || 0,
    completedCourses: progress?.completedCourses || 0,
    inProgressCourses: progress?.inProgressCourses || 0,
    totalChapters: progress?.totalChapters || 0,
    completedChapters: progress?.completedChapters || 0,
    averageProgress: progress?.overallPercentage || 0
  };

  const courseProgressList = (progress?.perCourse || []).map(course => ({
    id: course.courseId,
    title: course.courseName,
    progress: course.progress,
    chapters: course.totalChapters,
    completed: course.completedChapters
  }));

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-foreground mb-6">Your Learning Progress</h2>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border shadow-sm bg-card dark:border-slate-800 overflow-hidden flex flex-col">
          <CardHeader className="sticky top-0 bg-card/80 backdrop-blur-sm z-10 pb-3 border-b dark:border-slate-800">
            <CardTitle className="flex items-center text-lg text-foreground">
              <Target className="mr-2 h-5 w-5 text-blue-500" />
              Detailed Course Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6 max-h-[450px] overflow-y-auto custom-scrollbar">
            {courseProgressList.length > 0 ? (
              courseProgressList.map((course) => (
                <div key={course.id} className="space-y-2 group">
                  <div className="flex justify-between items-end">
                    <h3 className="font-medium text-foreground group-hover:text-blue-600 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded flex-shrink-0 ml-2">
                      {course.completed}/{course.chapters} Ch
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Progress 
                      value={course.progress} 
                      className="flex-1 h-2" 
                      indicatorClassName={
                        course.progress === 100 
                          ? "bg-green-500" 
                          : course.progress > 50 
                            ? "bg-blue-500" 
                            : "bg-amber-500"
                      } 
                    />
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

        <Card className="border shadow-sm bg-card dark:border-slate-800 overflow-hidden flex flex-col">
          <CardHeader className="sticky top-0 bg-card/80 backdrop-blur-sm z-10 pb-3 border-b dark:border-slate-800">
            <CardTitle className="flex items-center text-lg text-foreground">
              <Activity className="mr-2 h-5 w-5 text-green-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 max-h-[450px] overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start group">
                    <div className="flex-shrink-0 mt-1 relative">
                      <div className="absolute top-8 left-1/2 -ml-px w-0.5 h-full bg-muted group-last:hidden" aria-hidden="true"></div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-card relative z-10 ${
                        activity.type === 'success' 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                          : activity.type === 'award' 
                            ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' 
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
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
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
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
