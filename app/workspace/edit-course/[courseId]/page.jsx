"use client";

import React, { use, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import CourseInfo from "../_components/CourseInfo";
import ChapterTopicList from "../_components/ChapterTopicList";
import CourseMapPanel from "../_components/CourseMapPanel";
// )
function EditCourse({ viewCourse = false }) {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState();

  useEffect(() => {
    if (courseId) {
      // ✅ only fetch when courseId is available
      GetCourseInfo();
    }
  }, [courseId]);

  const GetCourseInfo = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`/api/courses?courseId=${courseId}`);
      console.log(result.data);
      console.log("Incoming courseId:", courseId, typeof courseId);
      
      console.log("Query result:", result);

      setCourse(result.data);
    } catch (err) {
      console.error("Error fetching course:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CourseInfo course={course} viewCourse={viewCourse} />
      <div className='mt-6'>
        <CourseMapPanel course={course} />
      </div>
      <ChapterTopicList course={course} />
    </div>
  );
}

export default EditCourse;
