import React, { useContext, useMemo } from "react";
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

  const chaptersWithIds = useMemo(() => {
    if (!courseContent || !Array.isArray(courseContent)) return [];
    return courseContent.map((chapter, index) => ({
      ...chapter,
      uniqueKey: chapter?.chapterId || `chapter-${index}`,
      displayIndex: chapter?.orderIndex ?? index
    }));
  }, [courseContent]);

  const getChapterName = (chapter, index) => {
    return chapter?.chapterName || 
           chapter?.courseData?.chapterName || 
           course?.courseJson?.chapters?.[index]?.chapterName ||
           course?.courseJson?.chapters?.[index]?.name ||
           `Chapter ${index + 1}`;
  };

  const getChapterTopics = (chapter) => {
    return chapter?.courseData?.topics || [];
  };

  return (
    <div className="w-80 h-full p-0 overflow-hidden">
      <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 text-white p-5">
        <h2 className="my-1 font-bold text-xl">Chapters ({chaptersWithIds.length})</h2>
        <p className="text-emerald-100 text-xs">Follow step-by-step; completed chapters are highlighted.</p>
      </div>
      <div className="h-[calc(100%-84px)] overflow-y-auto p-5 bg-secondary dark:bg-[color:oklch(0.18_0.03_150)]">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-lime-300"></span>
          <span className="text-xs text-emerald-700 dark:text-emerald-300">Interactive Syllabus</span>
        </div>
        <Accordion type="single" collapsible>
          {chaptersWithIds.map((chapter, index) => {
            const chapterName = getChapterName(chapter, index);
            const topics = getChapterTopics(chapter);
            const isSelected = selectedChapterIndex === index;
            const isCompleted = completedChapter.includes(index);

            return (
              <AccordionItem
                value={chapter.uniqueKey}
                key={chapter.uniqueKey}
                onClick={() => setSelectedChapterIndex(index)}
              >
                <AccordionTrigger
                  className={`text-sm font-medium rounded-md px-3 py-2 border transition-colors ${
                    isSelected
                      ? "bg-white text-emerald-800 border-emerald-300"
                      : "bg-card hover:bg-emerald-50 border-transparent"
                  } ${isCompleted ? 'ring-1 ring-emerald-300' : ''}`}
                  onClick={() => setSelectedChapterIndex(index)}
                >
                  {index + 1}. {chapterName}
                </AccordionTrigger>

                <AccordionContent asChild>
                  <div className="">
                    {topics.length > 0 ? (
                      topics.map((topic, topicIndex) => (
                        <h2 
                          key={`${chapter.uniqueKey}-topic-${topicIndex}`}
                          className={`p-2 my-1 rounded-lg transition-colors border
                            ${isCompleted 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                              : 'bg-white dark:bg-[color:oklch(0.21_0.03_150)] border-transparent text-foreground'
                            }`}
                        >
                          {topic?.topic}
                        </h2>
                      ))
                    ) : (
                      <p className="p-2 text-sm text-muted-foreground">No topics available</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}

export default ChapterListSidebar;
