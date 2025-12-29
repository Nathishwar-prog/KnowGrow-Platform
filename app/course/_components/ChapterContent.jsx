import React, { useContext, useMemo, useState } from "react";
import { SelectedChapterIndexContext } from "../../../context/SelectedChapterIndexContext";
import YouTube from "react-youtube";
import { Button } from "../../../@/components/ui/button";
import { CheckCircle, Loader2Icon, X, ArrowRight, ExternalLink, Play } from "lucide-react";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import CodeEnhancer from "./CodeEnhancer";
import { logActivity } from "../../workspace/_components/ActivityLogger";

function ChapterContent({ courseInfo, refreshData }) {
    const { courseId } = useParams();
    const enrollCourse = courseInfo?.enrollCourse;
    const courseContent = courseInfo?.courses?.courseContent;
    const { selectedChapterIndex, setSelectedChapterIndex } = useContext(SelectedChapterIndexContext);
    
    const currentChapter = useMemo(() => {
        if (!courseContent || !Array.isArray(courseContent)) return null;
        return courseContent[selectedChapterIndex] || null;
    }, [courseContent, selectedChapterIndex]);

    const videoData = useMemo(() => {
        return currentChapter?.youtubeVideo || [];
    }, [currentChapter]);

    const topics = useMemo(() => {
        return currentChapter?.courseData?.topics || [];
    }, [currentChapter]);

    const chapterName = useMemo(() => {
        return currentChapter?.chapterName || 
               currentChapter?.courseData?.chapterName || 
               `Chapter ${selectedChapterIndex + 1}`;
    }, [currentChapter, selectedChapterIndex]);

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

        logActivity(`Completed: ${chapterName}`, 'success');
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
        if (!topics || topics.length === 0) return 0;
        const totalWords = topics.reduce((acc, topic) => acc + (topic?.content?.split(' ').length || 0), 0);
        return Math.ceil(totalWords / 200);
    }, [topics]);

    if (!currentChapter) {
        return (
            <div className="p-10 min-h-full flex items-center justify-center">
                <p className="text-muted-foreground">Select a chapter to view content</p>
            </div>
        );
    }

    return (
        <div className='p-10 min-h-full'>
            <div className='flex justify-between items-center'>
                <h2 className='font-bold text-2xl'>
                    {selectedChapterIndex + 1}. {chapterName}
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
                {videoData.length > 0 && (
                    <span className="ml-2">📺 {videoData.length} videos available</span>
                )}
            </div>

            {videoData.length > 0 && (
                <>
                    <h2 className='my-2 font-bold text-lg'>Related Videos 📽️</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                        {videoData.slice(0, 2).map((video, index) => (
                            <div key={`${currentChapter?.chapterId || selectedChapterIndex}-video-${index}`} className="video-container">
                                {video?.videoId ? (
                                    <div className="video-responsive">
                                        <YouTube
                                            videoId={video.videoId}
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
                                ) : video?.thumbnail ? (
                                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                                        <img 
                                            src={video.thumbnail} 
                                            alt={video.title || 'Video thumbnail'}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <Play className="w-12 h-12 text-white" />
                                        </div>
                                    </div>
                                ) : null}
                                {video?.title && (
                                    <div className="mt-2 flex items-start justify-between gap-2">
                                        <p className="text-sm font-medium line-clamp-2">{video.title}</p>
                                        {video?.videoUrl && (
                                            <a 
                                                href={video.videoUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex-shrink-0 text-muted-foreground hover:text-primary"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                )}
                                {video?.channelTitle && (
                                    <p className="text-xs text-muted-foreground mt-1">{video.channelTitle}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div className='mt-7'>
                {topics.length > 0 ? (
                    topics.map((topic, index) => (
                        <div key={`${currentChapter?.chapterId || selectedChapterIndex}-topic-${index}`} className='mt-10 p-5 bg-secondary rounded-2xl'>
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
                    ))
                ) : (
                    <div className="mt-10 p-5 bg-secondary rounded-2xl text-center">
                        <p className="text-muted-foreground">Content is being generated. Please refresh in a moment.</p>
                    </div>
                )}
            </div>

            <div className="flex justify-end mt-10">
                {courseContent && selectedChapterIndex < courseContent.length - 1 && (
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
