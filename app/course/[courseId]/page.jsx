"use client";

import React, { useEffect, useState } from "react";
import Appheader from "../../workspace/_components/AppHeader";
import ChapterListSidebar from "../_components/ChapterListSidebar";
import ChapterContent from "../_components/ChapterContent";
import { useParams } from "next/navigation";
import axios from "axios";

function Course() {
  const { courseId } = useParams();
  const [courseInfo, setCourseInfo] = useState(null); // initial state null
  const [loading, setLoading] = useState(true); // loading state

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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <span className="ml-3 text-lg font-semibold">Loading course...</span>
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
      <Appheader hideSidebar={true} />

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        <ChapterListSidebar courseInfo={courseInfo} />
        <div className="flex-1 overflow-y-auto">
          <ChapterContent courseInfo={courseInfo} refreshData={()=>fetchCourse()} />
        </div>
      </div>
    </div>
  );
}

export default Course;
