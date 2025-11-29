"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { Progress } from "../../../@/components/ui/progress";
import { Badge } from "../../../@/components/ui/badge";
import { 
  BookOpen, 
  Target, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  Circle, 
  Trophy,
  Calendar,
  Award
} from "lucide-react";

const ProgressDashboard = ({ enrolledCourses = [] }) => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalChapters: 0,
    completedChapters: 0,
    averageProgress: 0
  });

  useEffect(() => {
    calculateStats();
  }, [enrolledCourses]);

  const calculateStats = () => {
    const totalCourses = enrolledCourses.length;
    let completedCourses = 0;
    let inProgressCourses = 0;
    let totalChapters = 0;
    let completedChapters = 0;

    enrolledCourses.forEach(enrollment => {
      const course = enrollment?.courses;
      const enrollData = enrollment?.enrollCourse;
      
      if (!course || !enrollData) return;
      
      totalChapters += course.noOfChapters || 0;
      
      // For simplicity, we'll assume completed chapters are stored in enrollData.completedChapters
      const completed = Array.isArray(enrollData.completedChapters) 
        ? enrollData.completedChapters.length 
        : 0;
      
      completedChapters += completed;
      
      if (completed >= (course.noOfChapters || 0)) {
        completedCourses++;
      } else if (completed > 0) {
        inProgressCourses++;
      }
    });

    const averageProgress = totalChapters > 0 
      ? Math.round((completedChapters / totalChapters) * 100) 
      : 0;

    setStats({
      totalCourses,
      completedCourses,
      inProgressCourses,
      totalChapters,
      completedChapters,
      averageProgress
    });
  };

  // Mock data for course progress (in a real app, this would come from the database)
  const courseProgress = enrolledCourses.slice(0, 3).map((enrollment, index) => {
    const course = enrollment?.courses;
    if (!course) return null;
    
    // Simulate progress
    const progress = [30, 65, 90][index] || 0;
    
    return {
      id: course.cid,
      title: course.name,
      progress,
      chapters: course.noOfChapters || 10,
      completed: Math.floor((course.noOfChapters || 10) * (progress / 100))
    };
  }).filter(Boolean);

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Progress</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
              <BookOpen className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completedCourses}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">{stats.inProgressCourses}</p>
              </div>
              <Target className="h-10 w-10 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
                <p className="text-3xl font-bold text-gray-900">{stats.averageProgress}%</p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-blue-500" />
              Course Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {courseProgress.length > 0 ? (
              courseProgress.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <span className="text-sm text-gray-500">
                      {course.completed}/{course.chapters} chapters
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={course.progress} className="flex-1" />
                    <span className="text-sm font-medium text-gray-700 w-12">
                      {course.progress}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                Enroll in courses to track your progress
              </p>
            )}
          </CardContent>
        </Card>
        
        {/* Learning Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-green-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Completed JavaScript Basics Chapter 3
                  </p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Started React Fundamentals Course
                  </p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-amber-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Earned "First Steps" Achievement
                  </p>
                  <p className="text-sm text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Weekly Goal */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Weekly Learning Goal</h3>
                <p className="text-gray-600">Complete 5 chapters this week</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">3/5</p>
              <p className="text-sm text-gray-500">chapters completed</p>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={60} className="h-3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;