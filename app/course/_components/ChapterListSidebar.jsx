import React, { useContext, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../@/components/ui/accordion";
import { SelectedChapterIndexContext } from "../../../context/SelectedChapterIndexContext";

function normalizeChapterTitle(chapter, fallbackIndex) {
  const rawTitle = chapter?.chapterName || 
                   chapter?.courseData?.chapterName || 
                   chapter?.rawChapterName || 
                   '';
  
  const cleaned = rawTitle
    .replace(/^chapter\s*\d+\s*[:\-–]\s*/i, '')
    .replace(/^\d+\.\s*/, '')
    .trim();
  
  return cleaned || `Chapter ${fallbackIndex + 1}`;
}

function getChapterSubTopics(chapter) {
  if (chapter?.subTopics && Array.isArray(chapter.subTopics) && chapter.subTopics.length > 0) {
    return chapter.subTopics;
  }
  
  const courseDataTopics = chapter?.courseData?.topics;
  if (courseDataTopics && Array.isArray(courseDataTopics)) {
    return courseDataTopics;
  }
  
  return [];
}

function ChapterListSidebar({ courseInfo }) {
  const course = courseInfo?.courses;
  const enrollCourse = courseInfo?.enrollCourse;
  const courseContent = courseInfo?.courses?.courseContent;
  const { selectedChapterIndex, setSelectedChapterIndex } = useContext(
    SelectedChapterIndexContext
  );
  let completedChapter = enrollCourse?.completedChapters ?? [];

  const chaptersWithData = useMemo(() => {
    if (!courseContent || !Array.isArray(courseContent)) return [];
    
    return courseContent
      .map((chapter, index) => {
        const orderIndex = chapter?.orderIndex ?? index;
        return {
          ...chapter,
          uniqueKey: chapter?.chapterId || `chapter-${index}`,
          displayIndex: orderIndex,
          normalizedTitle: normalizeChapterTitle(chapter, index),
          chapterSubTopics: getChapterSubTopics(chapter),
          originalIndex: index
        };
      })
      .sort((a, b) => a.displayIndex - b.displayIndex);
  }, [courseContent]);

  return (
    <div className="w-80 h-full p-0 overflow-hidden">
      <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 text-white p-5">
        <h2 className="my-1 font-bold text-xl">Chapters ({chaptersWithData.length})</h2>
        <p className="text-emerald-100 text-xs">Follow step-by-step; completed chapters are highlighted.</p>
      </div>
      <div className="h-[calc(100%-84px)] overflow-y-auto p-5 bg-secondary dark:bg-[color:oklch(0.18_0.03_150)]">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-lime-300"></span>
          <span className="text-xs text-emerald-700 dark:text-emerald-300">Interactive Syllabus</span>
        </div>
        <Accordion type="single" collapsible>
          {chaptersWithData.map((chapter) => {
            const { uniqueKey, originalIndex, normalizedTitle, chapterSubTopics } = chapter;
            const isSelected = selectedChapterIndex === originalIndex;
            const isCompleted = completedChapter.includes(originalIndex);

            return (
              <AccordionItem
                value={uniqueKey}
                key={uniqueKey}
                onClick={() => setSelectedChapterIndex(originalIndex)}
              >
                <AccordionTrigger
                  className={`text-sm font-medium rounded-md px-3 py-2 border transition-colors ${
                    isSelected
                      ? "bg-white text-emerald-800 border-emerald-300"
                      : "bg-card hover:bg-emerald-50 border-transparent"
                  } ${isCompleted ? 'ring-1 ring-emerald-300' : ''}`}
                  onClick={() => setSelectedChapterIndex(originalIndex)}
                >
                  {originalIndex + 1}. {normalizedTitle}
                </AccordionTrigger>

                <AccordionContent asChild>
                  <div className="">
                    {chapterSubTopics.length > 0 ? (
                      chapterSubTopics.map((topic, topicIndex) => {
                        const topicText = typeof topic === 'string' 
                          ? topic 
                          : topic?.topic || topic?.name || '';
                        
                        if (!topicText) return null;
                        
                        return (
                          <h2 
                            key={`${uniqueKey}-topic-${topicIndex}`}
                            className={`p-2 my-1 rounded-lg transition-colors border
                              ${isCompleted 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                : 'bg-white dark:bg-[color:oklch(0.21_0.03_150)] border-transparent text-foreground'
                              }`}
                          >
                            {topicText}
                          </h2>
                        );
                      })
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
