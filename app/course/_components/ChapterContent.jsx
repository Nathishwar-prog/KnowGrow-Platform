import React, { useContext, useMemo, useState } from "react";
import { SelectedChapterIndexContext } from "../../../context/SelectedChapterIndexContext";
import YouTube from "react-youtube";
import { Button } from "../../../@/components/ui/button";
import { CheckCircle, Loader2Icon, X, ArrowRight } from "lucide-react";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import CodeEnhancer from "./CodeEnhancer";

function ChapterContent({ courseInfo, refreshData }) {
    const { courseId } = useParams();
    const { course, enrollCourse } = courseInfo;
    const courseContent = courseInfo?.courses?.courseContent;
    const { selectedChapterIndex, setSelectedChapterIndex } = useContext(SelectedChapterIndexContext);
    const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo || []; // ✅ fallback
    const topics = courseContent?.[selectedChapterIndex]?.courseData?.topics;
    let completedChapter = enrollCourse?.completedChapters ?? [];
    const [loading, setLoading] = useState(false);

    const markChapterCompleted = async () => {
        setLoading(true);
        completedChapter.push(selectedChapterIndex);
        const result = await axios.put('/api/enroll-course', {
            courseId: courseId,
            completedChapter: completedChapter
        });

        console.log(result);
        refreshData();
        toast.success('Chapter Marked Completed!');
        setLoading(false);
    };

    const markInCompletedChapter = async () => {
        setLoading(true);
        const completeChap = completedChapter.filter(item => item != selectedChapterIndex);
        const result = await axios.put('/api/enroll-course', {
            courseId: courseId,
            completedChapter: completeChap
        });

        console.log(result);
        refreshData();
        toast.success('Chapter Marked InCompleted!');
        setLoading(false);
    };

    const readingTime = useMemo(() => {
        if (!topics) return 0;
        const totalWords = topics.reduce((acc, topic) => acc + (topic?.content?.split(' ').length || 0), 0);
        return Math.ceil(totalWords / 200); // 200 words per minute
    }, [topics]);

    return (
        <div className='p-10 min-h-full'>
            <div className='flex justify-between items-center'>
                <h2 className='font-bold text-2xl'>
                    {selectedChapterIndex + 1}. {courseContent?.[selectedChapterIndex]?.courseData?.chapterName}
                </h2>
                {!completedChapter?.includes(selectedChapterIndex) ? (
                    <Button onClick={() => markChapterCompleted()} disabled={loading}>
                        {loading ? <Loader2Icon className='animate-spin' /> : <CheckCircle />}
                        Mark as Completed
                    </Button>
                ) : (
                    <Button variant={'outline'} onClick={markInCompletedChapter} disabled={loading}>
                        {loading ? <Loader2Icon className='animate-spin' /> : <X />} Mark Incomplete
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 mb-6">
                <span>⏱️ ~{readingTime} min read</span>
            </div>

            <h2 className='my-2 font-bold text-lg'>Related Videos 📽️</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {videoData.map((video, index) =>
                    index < 2 && (
                        <div key={index} className="video-responsive">
                            <YouTube
                                videoId={video?.videoId}
                                opts={{
                                    height: '100%',
                                    width: '100%',
                                    playerVars: {
                                        autoplay: 0,
                                    },
                                }}
                                className="absolute top-0 left-0 w-full h-full"
                            />
                        </div>
                    )
                )}
            </div>

            <div className='mt-7'>
                {topics?.map((topic, index) => (
                    <div key={index} className='mt-10 p-5 bg-secondary rounded-2xl'>
                        <h2 className='font-bold text-2xl text-primary'>
                            {index + 1}. {topic?.topic}
                        </h2>
                        <div id={`chapter-content-${selectedChapterIndex}-${index}`}
                            className='prose prose-emerald dark:prose-invert max-w-none'
                            dangerouslySetInnerHTML={{ __html: topic?.content }}
                            style={{ lineHeight: '2.1' }}
                        />
                        <CodeEnhancer containerId={`chapter-content-${selectedChapterIndex}-${index}`} />
                    </div>
                ))}
            </div>

            <div className="flex justify-end mt-10">
                {selectedChapterIndex < courseContent?.length - 1 && (
                    <Button
                        onClick={() => {
                            setSelectedChapterIndex(selectedChapterIndex + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="gap-2"
                    >
                        Next Chapter <ArrowRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}

export default ChapterContent;
