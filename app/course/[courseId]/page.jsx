"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import WorkspaceNavbar from "../../workspace/_components/WorkspaceNavbar";
import ChapterListSidebar from "../_components/ChapterListSidebar";
import ChapterContent from "../_components/ChapterContent";
import { useParams } from "next/navigation";
import { api, cancelRequest } from "~/lib/api";

function Course() {
  const { courseId } = useParams();
  const [courseInfo, setCourseInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const mountedRef = useRef(true);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    
    setLoading(true);
    setError(null);
    
    const result = await api.enroll.get(courseId);
    
    if (!mountedRef.current) return;
    
    if (result.success) {
      setCourseInfo(result.data);
    } else if (!result.isCanceled) {
      setError(result.error);
    }
    
    setLoading(false);
  }, [courseId]);

  useEffect(() => {
    mountedRef.current = true;
    fetchCourse();
    
    return () => {
      mountedRef.current = false;
      cancelRequest(`/api/enroll-course?courseId=${courseId}`);
    };
  }, [courseId, fetchCourse]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-background">
        <div className="relative">
          <div className="h-14 w-14 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-6 rounded-full bg-emerald-500 animate-ping"></div>
          </div>
        </div>
        <span className="ml-4 text-lg font-semibold text-emerald-700 dark:text-emerald-300">
          Preparing your personalized course…
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-destructive mb-4">{error}</p>
        <button 
          onClick={fetchCourse}
          className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!courseInfo) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Failed to load course.
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <WorkspaceNavbar />

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div className="sticky top-0 h-[calc(100vh-56px)] overflow-y-auto">
            <ChapterListSidebar courseInfo={courseInfo} />
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-between px-4 pt-4">
            <button
              className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border bg-card hover:bg-accent transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? "Hide Chapters" : "Show Chapters"}
            </button>
          </div>
          <ChapterContent courseInfo={courseInfo} refreshData={fetchCourse} />
        </div>
      </div>
    </div>
  );
}

export default Course;
