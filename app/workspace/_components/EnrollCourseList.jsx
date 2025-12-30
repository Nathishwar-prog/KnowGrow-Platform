"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { api, cancelRequest } from "../../../@/lib/api";
import EnrollCourseCard from "./EnrollCourseCard";
import { Loader2 } from "lucide-react";

function EnrollCourseList() {
  const [enrolledCourseList, setEnrolledCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const GetEnrolledCourse = useCallback(async () => {
    setLoading(true);
    const result = await api.enroll.list();
    
    if (!mountedRef.current) return;
    
    if (result.success) {
      setEnrolledCourseList(result.data || []);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    GetEnrolledCourse();
    
    return () => {
      mountedRef.current = false;
      cancelRequest("/api/enroll-course");
    };
  }, [GetEnrolledCourse]);

  if (loading) {
    return (
      <div className="mt-3">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
          <span className="text-sm text-muted-foreground">Loading your courses...</span>
        </div>
      </div>
    );
  }

  if (!enrolledCourseList || enrolledCourseList.length === 0) {
    return null;
  }

  return (
    <div className="mt-3">
      <h2 className="font-bold text-xl bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
        Continue Learning Your courses
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {enrolledCourseList.map((course, index) => (
          <EnrollCourseCard
            course={course?.courses}
            enrollCourse={course?.enrollCourse}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}

export default EnrollCourseList;
