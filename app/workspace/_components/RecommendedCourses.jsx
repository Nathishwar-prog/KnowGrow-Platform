"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../../../@/components/ui/card";
import { Button } from "../../../@/components/ui/button";
import { Skeleton } from "../../../@/components/ui/skeleton";
import { BookOpen, Star, Clock, TrendingUp } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { logActivity } from "./ActivityLogger";

const RecommendedCourses = ({ userInterests = [], enrolledCourses = [] }) => {
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const hasFetched = useRef(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && !hasFetched.current) {
      hasFetched.current = true;
      fetchRecommendedCourses();
    }
  }, [isLoaded, isSignedIn]);

  const fetchRecommendedCourses = async () => {
    setLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call an API that uses AI to recommend courses
      // For now, we'll simulate recommendations

      // Get all courses (in a real app, this would be a recommendation API)
      const response = await axios.get("/api/courses?courseId=0&search=popular");
      const allCourses = response.data;

      // Filter out already enrolled courses
      const enrolledCourseIds = enrolledCourses.map(ec => ec?.courses?.cid || ec?.cid);
      const availableCourses = allCourses.filter(course =>
        !enrolledCourseIds.includes(course.cid)
      );

      // Sort by popularity or relevance (simulated)
      const sortedCourses = [...availableCourses].sort(() => Math.random() - 0.5);

      // Take top 3 recommendations
      setRecommendedCourses(sortedCourses.slice(0, 3));
    } catch (err) {
      console.error("Error fetching recommended courses:", err);
      if (err.response?.status === 404) {
        setError("Recommendation service is temporarily unavailable.");
      } else {
        setError("Failed to load recommendations. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-700">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={fetchRecommendedCourses}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (recommendedCourses.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
        <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendedCourses.map((course, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium ml-1">4.8</span>
                </div>
              </div>

              <h3 className="font-semibold text-lg text-gray-900 mt-4 line-clamp-2">
                {course.name}
              </h3>

              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{course.noOfChapters || 10} chapters</span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {course.level}
                </span>
              </div>

              <Button
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                onClick={() => {
                  logActivity(`Started ${course.name}`, 'info');
                  router.push(`/course/${course.cid}`);
                }}
              >
                Start Learning
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCourses;