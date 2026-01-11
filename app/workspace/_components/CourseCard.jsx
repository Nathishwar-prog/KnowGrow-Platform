import { Book, LoaderCircle, PlayCircle, Settings, BarChart } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../../../@/components/ui/button";
import { Badge } from "../../../@/components/ui/badge";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

function CourseCard({ course }) {
    const courseJson = course?.courseJson?.course;
    const [loading, setLoading] = useState(false);

    const onEnrollCourse = async () => {
        try {
            setLoading(true);
            const result = await axios.post('/api/enroll-course', {
                courseId: course?.cid
            });

            console.log(result.data);
            if (result.data.resp) {
                toast.warning('Already Enrolled!');
                setLoading(false);
                return;
            }
            toast.success('Enrolled Successfully!')
            setLoading(false);
        }
        catch (e) {
            toast.error('Failed to enroll. Please try again.')
            setLoading(false);
        }

    }

    return (
        <div className='group relative bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full'>
            <div className="relative aspect-video overflow-hidden">
                {course?.bannerImageUrl ? (
                    <Image src={course.bannerImageUrl} alt={course?.name || 'Course banner'}
                        width={1024}
                        height={576}
                        className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                    />
                ) : (
                    <div className='w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/30 flex items-center justify-center text-emerald-800 dark:text-emerald-200'>
                        <span className='text-sm font-medium'>No banner available</span>
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm">
                        {course?.level || 'Beginner'}
                    </Badge>
                </div>
            </div>

            <div className='p-5 flex flex-col gap-3 flex-1'>
                <div className="flex justify-between items-start gap-2">
                    <h2 className='font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2'>
                        {courseJson?.name}
                    </h2>
                </div>

                <p className='line-clamp-2 text-muted-foreground text-sm flex-1'>
                    {courseJson?.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                        <Book className="w-4 h-4" />
                        <span>{courseJson?.noOfChapters} Chapters</span>
                    </div>
                    {course?.category && (
                        <div className="flex items-center gap-1">
                            <BarChart className="w-4 h-4" />
                            <span>{course?.category}</span>
                        </div>
                    )}
                </div>

                <div className='pt-4 mt-auto border-t border-border/50'>
                    {course?.hasContent ?
                        <Button className='w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all'
                            onClick={onEnrollCourse}
                            disabled={loading}
                        >
                            {loading ? <LoaderCircle className='animate-spin w-4 h-4 mr-2' /> : <PlayCircle className="w-4 h-4 mr-2" />}
                            Enroll Now
                        </Button> :
                        <Link href={'/workspace/edit-course/' + course?.cid} className="w-full">
                            <Button variant={'outline'} className="w-full hover:bg-accent hover:text-accent-foreground">
                                <Settings className="w-4 h-4 mr-2" />
                                Edit Course
                            </Button>
                        </Link>}
                </div>
            </div>
        </div>
    );
}

export default CourseCard;