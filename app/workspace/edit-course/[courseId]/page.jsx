"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { api, cancelRequest } from "../../../../@/lib/api";
import CourseInfo from "../_components/CourseInfo";
import ChapterTopicList from "../_components/ChapterTopicList";
import { Loader2 } from "lucide-react";

function EditCourse({ viewCourse = false }) {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);
  const mountedRef = useRef(true);

  const GetCourseInfo = useCallback(async () => {
    if (!courseId) return;
    
    setLoading(true);
    setError(null);
    
    const result = await api.courses.get(courseId);
    
    if (!mountedRef.current) return;
    
    if (result.success) {
      setCourse(result.data);
    } else if (!result.isCanceled) {
      setError(result.error);
    }
    
    setLoading(false);
  }, [courseId]);

  useEffect(() => {
    mountedRef.current = true;
    GetCourseInfo();
    
    return () => {
      mountedRef.current = false;
      cancelRequest(`/api/courses?courseId=${courseId}`);
    };
  }, [courseId, GetCourseInfo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <span className="ml-3 text-muted-foreground">Loading course details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <p className="text-destructive mb-4">{error}</p>
        <button 
          onClick={GetCourseInfo}
          className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        Course not found.
      </div>
    );
  }

  return (
    <div>
      <CourseInfo course={course} viewCourse={viewCourse} />
      <ChapterTopicList course={course} />
    </div>
  );
}

export default EditCourse;
