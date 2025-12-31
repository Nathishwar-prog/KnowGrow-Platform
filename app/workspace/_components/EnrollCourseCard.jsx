"use client";

import { Book, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../../../@/components/ui/button";
import { CircularProgress } from "../../../@/components/ui/circular-progress";

function EnrollCourseCard({ course, enrollCourse }) {
  const courseJson = course?.courseJson?.course;
  const courseContent = course?.courseContent;
  
  const completedCount = enrollCourse?.completedChapters?.length ?? 0;
  const totalCount = Array.isArray(courseContent) ? courseContent.length : (course?.noOfChapters ?? 0);
  
  const CalculatePerProgress = () => {
    if (totalCount === 0) return 0;
    return Math.min(100, Math.round((completedCount / totalCount) * 100));
  };

  const progressValue = CalculatePerProgress();

  return (
    <div className="bg-card border border-border/50 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {course?.bannerImageUrl ? (
        <Image
          src={course.bannerImageUrl}
          alt={course?.name || 'Course banner'}
          width={400}
          height={300}
          className="w-full aspect-video object-cover"
        />
      ) : (
        <div className="w-full aspect-video bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/30 flex items-center justify-center text-emerald-800 dark:text-emerald-200">
          <span className="text-sm">No banner available</span>
        </div>
      )}

      <div className="p-5 flex flex-col gap-4">
        <div>
          <h2 className="font-bold text-lg line-clamp-1">{courseJson?.name || course?.name}</h2>
          <p className="line-clamp-2 text-muted-foreground text-sm mt-1">
            {courseJson?.description || course?.description}
          </p>
        </div>

        <div className="flex items-center gap-4 py-4 border-y border-border/50">
          <CircularProgress 
            value={progressValue} 
            size={80} 
            strokeWidth={6}
            showLabel={false}
            gradientId={`progress-${course?.cid}`}
          />
          
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              {progressValue}% Complete
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <Book className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {completedCount} of {totalCount} chapters
              </span>
            </div>
            {progressValue === 100 && (
              <span className="inline-flex items-center text-xs font-medium mt-2 text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                Completed!
              </span>
            )}
          </div>
        </div>

        <Link href={"/course/" + course?.cid}>
          <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all">
            <PlayCircle className="w-4 h-4 mr-2" /> 
            {progressValue > 0 ? "Continue Learning" : "Start Learning"}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default EnrollCourseCard;
