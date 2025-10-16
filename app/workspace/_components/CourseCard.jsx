import { Book, LoaderCircle, PlayCircle, Settings } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../../../@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

function CourseCard({ course }) {
    const courseJson = course?.courseJson?.course;
    const [loading,setLoading] = useState(false);

    const onEnrollCourse=async()=>{
        try{
            setLoading(true);
            const result = await axios.post('/api/enroll-course',{
                courseId:course?.cid
            });

            console.log(result.data);
            if(result.data.resp){
                toast.warning('Already Enrolled!');
                setLoading(false);
                return;
            }
            toast.success('Enrolled!')
            setLoading(false);
        }
        catch(e)
        {
            toast.error('Server Side Error')
            setLoading(false);
        }

    }



    return ( 
        <div className='shadow rounded-xl border bg-card'>
            {course?.bannerImageUrl ? (
                <Image src={course.bannerImageUrl} alt={course?.name || 'Course banner'}
                width={400}
                height={300}
                className='w-full aspect-video rounded-t-xl object-cover'
                />
            ) : (
                <div className='w-full aspect-video rounded-t-xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/30 flex items-center justify-center text-emerald-800 dark:text-emerald-200'>
                    <span className='text-sm'>No banner available</span>
                </div>
            )}

            <div className='p-3 flex flex-col gap-3'>
                <h2 className='font-bold text-lg'>{courseJson?.name}</h2>
                <p className='line-clamp-3 text-muted-foreground text-sm'>{courseJson?.description}</p>

                <div className='flex justify-between items-center'>
                    <h2 className='flex items-center text-sm gap-2'><Book className='text-primary h-5 w-5'/>{courseJson?.noOfChapters} Chapters</h2>
                    {course?.courseContent?.length ? 
                    <Button size={'sm'} className='bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700' 
                        onClick={onEnrollCourse}
                        disabled={loading}
                    >{loading?<LoaderCircle className='animate-spin'/>: <PlayCircle/>} Enroll Course</Button> :
                         <Link href={'/workspace/edit-course/'+course?.cid}><Button size={'sm'} variant={'outline'}><Settings/>Generate Course</Button></Link>}
                </div>
            </div>
        </div>
     );
}

export default CourseCard;