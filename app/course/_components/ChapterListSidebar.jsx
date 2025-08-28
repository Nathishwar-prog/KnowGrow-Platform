import React, { useContext } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../@/components/ui/accordion";
import { SelectedChapterIndexContext } from "../../../context/SelectedChapterIndexContext";

function ChapterListSidebar({ courseInfo }) {
  const course = courseInfo?.courses;
  const enrollCourse = courseInfo?.enrollCourse;
  const courseContent = courseInfo?.courses?.courseContent;
  const { selectedChapterIndex, setSelectedChapterIndex } = useContext(
    SelectedChapterIndexContext
  );
  let completedChapter = enrollCourse?.completedChapters ?? [];


  return (
    <div className="w-80 bg-secondary h-full p-5 shadow-2xl overflow-y-auto">
      <h2 className="my-3 font-bold text-xl">
        Chapters ({courseContent?.length})
      </h2>
      <Accordion type="single" collapsible>
        {courseContent?.map((chapter, index) => (
          <AccordionItem
            value={chapter?.courseData?.chapterName}
            key={index}
            onClick={() => setSelectedChapterIndex(index)}
          >
            <AccordionTrigger
              className={`text-lg font-medium rounded-md px-2 py-1 shadow ${
                selectedChapterIndex === index
                  ? "bg-blue-100 text-blue-800"
                  : ""
              }
              ${completedChapter.includes(index) ? 'bg-green-100 text-green-800':''}`}
              onClick={() => setSelectedChapterIndex(index)}
            >
              
              {index + 1}.{chapter?.courseData?.chapterName}
            </AccordionTrigger>

            <AccordionContent asChild>
              <div className="">
                {chapter?.courseData?.topics.map((topic, index_) => (
                  <h2 key={index_} 
                  className={`p-2  my-1 rounded-lg
                     ${completedChapter.includes(index) ? 'bg-green-100 text-green-800':'bg-white'}`}>
                    {topic?.topic}
                  </h2>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default ChapterListSidebar;
