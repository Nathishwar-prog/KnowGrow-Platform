import { Gift } from "lucide-react";
import React from "react";
import { getDisplayTitle, sanitizeSubTopic } from "../../../../@/lib/titleSanitizer";

function ChapterTopicList({ course }) {
  const courseLayout = course?.courseJson?.course;

  if (!courseLayout?.chapters || courseLayout.chapters.length === 0) {
    return (
      <div className="mt-10 text-center text-muted-foreground">
        No chapters available yet.
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-bold text-3xl mt-10">Chapters & Topics</h2>
      <div className="flex flex-col items-center justify-center mt-10">
        {courseLayout.chapters.map((chapter, index) => {
          const title = getDisplayTitle(chapter, index);
          const topics = chapter?.topics || [];

          return (
            <div key={index} className="flex flex-col items-center">
              <div className="p-4 border shadow rounded-xl bg-primary text-white">
                <h2 className="text-center">Chapter {index + 1}</h2>
                <h2 className="font-bold text-lg text-center">{title}</h2>
                <h2 className="text-xs flex justify-between gap-16">
                  <span>Duration: {chapter?.duration || "~20 min"}</span>
                  <span>Topics: {topics.length}</span>
                </h2>
              </div>

              <div>
                {topics.map((topic, topicIndex) => {
                  const rawText = typeof topic === "string" ? topic : (topic?.name || topic?.topic || "");
                  const topicText = sanitizeSubTopic(rawText);

                  if (!topicText) return null;

                  return (
                    <div className="flex flex-col items-center" key={topicIndex}>
                      <div className="h-10 bg-gray-300 w-1"></div>

                      <div className="flex items-center gap-5">
                        <span
                          className={`${
                            topicIndex % 2 === 0 && "text-transparent"
                          } max-w-xs text-sm`}
                        >
                          {topicText}
                        </span>

                        <h2 className="text-center rounded-full bg-gray-300 px-6 text-gray-500 p-4">
                          {topicIndex + 1}
                        </h2>

                        <span
                          className={`${
                            topicIndex % 2 !== 0 && "text-transparent"
                          } max-w-xs text-sm`}
                        >
                          {topicText}
                        </span>
                      </div>

                      {topicIndex === topics.length - 1 && (
                        <div className="h-10 bg-gray-300 w-1"></div>
                      )}

                      {topicIndex === topics.length - 1 && (
                        <div className="flex items-center gap-5">
                          <Gift className="text-center rounded-full bg-gray-300 h-14 w-14 text-gray-500 p-4" />
                        </div>
                      )}

                      {topicIndex === topics.length - 1 && (
                        <div className="h-10 bg-gray-300 w-1"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="p-4 border shadow rounded-xl bg-green-600 text-white">
          <h2>Finish</h2>
        </div>
      </div>
    </div>
  );
}

export default ChapterTopicList;
