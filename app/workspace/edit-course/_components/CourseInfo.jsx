"use client";
import { Book, Clock, PlayCircle, Settings, TrendingUp } from "lucide-react";
import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "../../../../@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import GenerationExperience from "../../_components/GenerationExperience";

function CourseInfo({ course, viewCourse }) {
    const courseLayout = course?.courseJson?.course;
    const [loading, setLoading] = useState(false);
    const [progressMessage, setProgressMessage] = useState("");
    const [progress, setProgress] = useState(0);
    const router = useRouter();
    const abortControllerRef = useRef(null);
    const toastIdRef = useRef(null);

    const GenerateCourseContent = useCallback(async () => {
        if (loading) return;
        
        setLoading(true);
        setProgressMessage("Initializing...");
        setProgress(0);

        toastIdRef.current = toast.loading("Starting course generation...", {
            duration: Infinity,
        });

        try {
            abortControllerRef.current = new AbortController();

            const response = await fetch('/api/generate-course-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseJson: courseLayout,
                    courseTitle: course?.name,
                    courseId: course?.cid
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('No response body');
            }

            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            handleProgressEvent(data);
                        } catch (e) {
                            console.error('Failed to parse SSE data:', e);
                        }
                    }
                }
            }

            if (buffer.startsWith('data: ')) {
                try {
                    const data = JSON.parse(buffer.slice(6));
                    handleProgressEvent(data);
                } catch (e) {}
            }

        } catch (e) {
            if (e.name === 'AbortError') {
                toast.dismiss(toastIdRef.current);
                toast.info("Generation cancelled");
            } else {
                console.error('Generation error:', e);
                toast.dismiss(toastIdRef.current);
                toast.error("Server error. Please try again!");
            }
            setLoading(false);
            setProgressMessage("");
            setProgress(0);
        }
    }, [course, courseLayout, loading, router]);

    const handleProgressEvent = useCallback((event) => {
        const { type, message, data } = event;

        switch (type) {
            case 'progress':
                setProgressMessage(message);
                if (data?.progress) {
                    setProgress(data.progress);
                }
                toast.loading(message, {
                    id: toastIdRef.current,
                    duration: Infinity,
                });
                break;

            case 'warning':
                toast.warning(message, { duration: 3000 });
                break;

            case 'error':
                toast.dismiss(toastIdRef.current);
                toast.error(message, { duration: 5000 });
                setLoading(false);
                setProgressMessage("");
                setProgress(0);
                break;

            case 'done':
                toast.dismiss(toastIdRef.current);
                toast.success(message, { duration: 4000 });
                setLoading(false);
                setProgressMessage("");
                setProgress(0);
                router.replace('/workspace');
                break;

            default:
                break;
        }
    }, [router]);

    const cancelGeneration = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setLoading(false);
        setProgressMessage("");
        setProgress(0);
    }, []);

    const hasContent = course?.courseContent && 
        (Array.isArray(course?.courseContent) ? course?.courseContent?.length > 0 : Object.keys(course?.courseContent).length > 0);

    return (
        <div className='md:flex gap-5 items-center justify-between p-5 rounded-2xl shadow bg-card'>
            <div className='flex flex-col gap-3 flex-1'>
                <h2 className='font-bold text-3xl bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent'>{courseLayout?.name}</h2>
                <p className='line-clamp-2 text-muted-foreground'>{courseLayout?.description}</p>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                    <div className='flex gap-5 items-center p-3 rounded-lg shadow bg-secondary'>
                        <Clock className='text-emerald-500' />
                        <section>
                            <h2 className='font-bold'>Duration</h2>
                            <h2>3 Hours</h2>
                        </section>
                    </div>
                    <div className='flex gap-5 items-center p-3 rounded-lg shadow bg-secondary'>
                        <Book className='text-emerald-600' />
                        <section>
                            <h2 className='font-bold'>Chapters</h2>
                            <h2>{courseLayout?.noOfChapters} Chapters</h2>
                        </section>
                    </div>
                    <div className='flex gap-5 items-center p-3 rounded-lg shadow bg-secondary'>
                        <TrendingUp className='text-emerald-500' />
                        <section>
                            <h2 className='font-bold'>Difficulty Level</h2>
                            <h2>{course?.level}</h2>
                        </section>
                    </div>
                </div>

                {!viewCourse && !hasContent ? (
                    <div className="flex flex-col gap-4">
                        {loading ? (
                            <GenerationExperience 
                                progress={progress} 
                                progressMessage={progressMessage} 
                                isVisible={loading} 
                            />
                        ) : null}
                        
                        <div className="flex items-center gap-2">
                            <Button
                                className="max-w-sm flex items-center gap-2"
                                onClick={GenerateCourseContent}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Settings className="h-4 w-4" />
                                        Generate Content
                                    </>
                                )}
                            </Button>
                            {loading && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={cancelGeneration}
                                    className="text-destructive hover:text-destructive"
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <Link href={'/course/' + course?.cid}>
                        <Button className='bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'>
                            <PlayCircle className="mr-2 h-4 w-4" /> {hasContent ? 'Start Course' : 'Continue Learning'}
                        </Button>
                    </Link>
                )}
            </div>
            {course?.bannerImageUrl && (
                <div className="w-full md:w-[350px] flex-shrink-0">
                    <Image
                        src={course.bannerImageUrl}
                        alt="Banner Image"
                        width={600}
                        height={340}
                        className="w-full object-cover rounded-xl shadow-sm aspect-video"
                    />
                </div>
            )}
        </div>
    )
}

export default CourseInfo;
