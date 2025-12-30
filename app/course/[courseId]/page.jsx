"use client";

import React, { useEffect, useState } from "react";
import WorkspaceNavbar from "../../workspace/_components/WorkspaceNavbar";
import ChapterListSidebar from "../_components/ChapterListSidebar";
import ChapterContent from "../_components/ChapterContent";
import { useParams } from "next/navigation";
import axios from "axios";

function Course() {
  const { courseId } = useParams();
  const [courseInfo, setCourseInfo] = useState(null); // initial state null
  const [loading, setLoading] = useState(true); // loading state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // fetch data inside useEffect
  useEffect(() => {


    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
      try {
        setLoading(true);
        const result = await axios.get(
          "/api/enroll-course?courseId=" + courseId
        );
        setCourseInfo(result.data); // just set state, do NOT await
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setLoading(false);
      }
    };

  // show loading while fetching
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-background">
        <div className="relative">
          <div className="h-14 w-14 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-6 rounded-full bg-emerald-500 animate-ping"></div>
          </div>
        </div>
        <span className="ml-4 text-lg font-semibold text-emerald-700 dark:text-emerald-300">Preparing your personalized course…</span>
      </div>
    );
  }

  // show error if fetch failed
  if (!courseInfo) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Failed to load course.
      </div>
    );
  }

    // render sidebar and content only when courseInfo is ready
    return (
      <div className="h-screen flex flex-col">
        {/* Header at the top */}
        <WorkspaceNavbar />

        {/* Sidebar + Content */}
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
              onClick={()=> setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? 'Hide Chapters' : 'Show Chapters'}
            </button>
          </div>
          <ChapterContent courseInfo={courseInfo} refreshData={()=>fetchCourse()} />
        </div>
      </div>
    </div>
  );
}

export default Course;
