import { Progress } from "../../../@/components/ui/progress";
import { Book, LoaderCircle, PlayCircle, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../../../@/components/ui/button";

function EnrollCourseCard({ course, enrollCourse }) {
  const courseJson = course?.courseJson?.course;
  const CalculatePerProgress = () => {
    const completed = enrollCourse?.completedChapters?.length ?? 0;
    const total = course?.courseContent?.length ?? 0;
    if (total === 0) return 0; // avoid division by zero
    return (completed / total) * 100;
  };

  return (
    <div className="shadow rounded-xl">
      {course?.bannerImageUrl ? (
        <Image
          src={course.bannerImageUrl}
          alt={course?.name || 'Course banner'}
          width={400}
          height={300}
          className="w-full aspect-video rounded-t-xl object-cover"
        />
      ) : (
        <div className="w-full aspect-video rounded-t-xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/30 flex items-center justify-center text-emerald-800 dark:text-emerald-200">
          <span className="text-sm">No banner available</span>
        </div>
      )}

      <div className="p-3 flex flex-col gap-3">
        <h2 className="font-bold text-lg">{courseJson?.name}</h2>
        <p className="line-clamp-3 text-gray-400 text-sm">
          {courseJson?.description}
        </p>

        <div className="">
          <h2 className="flex justify-between text-sm text-primary">
            Progress <span>{CalculatePerProgress()} % </span>
          </h2>
          <Progress value={CalculatePerProgress()} />
          <Link href={"/workspace/view-course/" + course?.cid}>
            <Button className={"w-full mt-3"}>
              {" "}
              <PlayCircle /> Continue Learning
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EnrollCourseCard;
