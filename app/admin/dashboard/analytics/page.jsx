"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../@/components/ui/card";
import { Loader2, Users, BookOpen, FileQuestion, GraduationCap, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/metrics");
      const data = await response.json();
      if (data.success) {
        setMetrics(data.metrics);
      } else {
        toast.error("Failed to fetch analytics");
      }
    } catch (error) {
      toast.error("Failed to fetch analytics");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const analyticsCards = [
    {
      title: "User Growth",
      value: metrics?.totalUsers || 0,
      description: "Total registered users",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Course Creation",
      value: metrics?.totalCourses || 0,
      description: "Courses created on platform",
      icon: BookOpen,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Quiz Usage",
      value: metrics?.totalQuizzes || 0,
      description: "Quizzes generated",
      icon: FileQuestion,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Enrollment Trends",
      value: metrics?.totalEnrollments || 0,
      description: "Total course enrollments",
      icon: GraduationCap,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  const engagementRate = metrics?.totalUsers > 0 
    ? Math.round((metrics?.activeUsers / metrics?.totalUsers) * 100) 
    : 0;

  const avgCoursesPerUser = metrics?.totalUsers > 0 
    ? (metrics?.totalCourses / metrics?.totalUsers).toFixed(2) 
    : 0;

  const avgEnrollmentsPerCourse = metrics?.totalCourses > 0 
    ? (metrics?.totalEnrollments / metrics?.totalCourses).toFixed(2) 
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Analytics Overview</h2>
        <p className="text-muted-foreground">
          Platform performance and user engagement metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, index) => (
          <Card key={index} className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Engagement Rate
            </CardTitle>
            <CardDescription>Active users percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">{engagementRate}%</div>
            <p className="text-sm text-muted-foreground mt-2">
              {metrics?.activeUsers || 0} active out of {metrics?.totalUsers || 0} users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Avg Courses per User
            </CardTitle>
            <CardDescription>Content creation rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">{avgCoursesPerUser}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Courses created per registered user
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-orange-500" />
              Avg Enrollments per Course
            </CardTitle>
            <CardDescription>Course popularity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600">{avgEnrollmentsPerCourse}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Students enrolled per course
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Summary</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{metrics?.totalUsers || 0}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <p className="text-2xl font-bold">{metrics?.totalCourses || 0}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Quizzes</p>
              <p className="text-2xl font-bold">{metrics?.totalQuizzes || 0}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Enrollments</p>
              <p className="text-2xl font-bold">{metrics?.totalEnrollments || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
