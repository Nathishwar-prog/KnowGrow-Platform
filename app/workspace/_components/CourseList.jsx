"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "../../../@/components/ui/button";
import AddNewCourseDialog from "./AddNewCourseDialog";
import { api, cancelRequest } from "../../../@/lib/api";
import { useUser } from "@clerk/nextjs";
import CourseCard from "./CourseCard";
import { Loader2 } from "lucide-react";

function CourseList() {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const mountedRef = useRef(true);

  const GetCourseList = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    const result = await api.courses.list();
    
    if (!mountedRef.current) return;
    
    if (result.success) {
      setCourseList(result.data || []);
    } else if (!result.isCanceled) {
      setError(result.error);
    }
    
    setLoading(false);
  }, [user]);

  useEffect(() => {
    mountedRef.current = true;
    if (user) {
      GetCourseList();
    }
    
    return () => {
      mountedRef.current = false;
      cancelRequest("/api/courses");
    };
  }, [user, GetCourseList]);

  if (loading) {
    return (
      <div className="mt-10">
        <h2 className="font-bold text-xl">Course List</h2>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          <span className="ml-2 text-muted-foreground">Loading courses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10">
        <h2 className="font-bold text-xl">Course List</h2>
        <div className="flex flex-col items-center justify-center p-7 border rounded-xl mt-2 bg-secondary">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={GetCourseList}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="font-bold text-xl">Course List</h2>

      {courseList?.length === 0 ? (
        <div className="flex p-7 items-center justify-center flex-col border rounded-xl mt-2 bg-secondary">
          <Image
            src={"/online_education.jpg"}
            alt="edu"
            width={80}
            height={80}
          />
          <h2 className="my-2 text-xl font-bold">
            Look like you haven&apos;t created any courses yet
          </h2>
          <AddNewCourseDialog>
            <Button>+ Create your first course</Button>
          </AddNewCourseDialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {courseList?.map((course, index) => (
            <CourseCard course={course} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseList;
