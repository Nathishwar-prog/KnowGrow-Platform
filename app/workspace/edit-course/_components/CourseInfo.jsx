import { Book, Clock, PlayCircle, Settings, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../../../../@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; 
import Link from "next/link";

function CourseInfo({ course,viewCourse }) {
    const courseLayout=course?.courseJson?.course;
    const [loading,setLoading] = useState(false);
    const router=useRouter();
    const GenerateCourseContent= async()=>{
        //call the api to generate a content
        setLoading(true);
        try{
            const result = await axios.post('/api/generate-course-content',{
                courseJson:courseLayout,
                courseTitle:course?.name,
                courseId: course?.cid
            });

            console.log(result.data);
            setLoading(false);
            router.replace('/workspace')
            toast.success('Course Generated successfully')
        }
        catch (e) {
            console.log(e);
            setLoading(false);
            toast.error("Server Side error , Try Again!")
             
        }

    }

    return(
        <div className='md:flex gap-5 justify-between p-5 rounded-2xl shadow bg-card'>
            <div className='flex flex-col gap-3'>
                <h2 className='font-bold text-3xl bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent'>{courseLayout?.name}</h2>
                <p className='line-clamp-2 text-muted-foreground'>{courseLayout?.description}</p>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                    <div className='flex gap-5 items-center p-3 rounded-lg shadow bg-secondary'>
                        <Clock className='text-emerald-500'/>
                        <section>
                            <h2 className='font-bold'>Duration</h2>
                            <h2>2 Hours</h2>

                        </section>
                    </div>
                    <div className='flex gap-5 items-center p-3 rounded-lg shadow bg-secondary'>
                        <Book className='text-emerald-600'/>
                        <section>
                            <h2 className='font-bold'>Chapters</h2>
                            <h2>2 Hours</h2>

                        </section>
                    </div>
                    <div className='flex gap-5 items-center p-3 rounded-lg shadow bg-secondary'>
                        <TrendingUp className='text-emerald-500'/>
                        <section>
                            <h2 className='font-bold'>Difficulty Level</h2>
                            <h2>{course?.level}</h2>

                        </section>
                    </div>
                </div>

              {!viewCourse ? <Button 
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
                </Button> : <Link href={'/course/'+course?.cid}> <Button className='bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'><PlayCircle/> Continue Learning</Button></Link>}

            </div>
            {course?.bannerImageUrl && (
                <Image 
                    src={course.bannerImageUrl} 
                    alt="Banner Image" 
                    width={400}
                    height={400}
                    className="w-full mt-5 md:mt-0 object-cover aspect-auto h-[240px] rounded-2xl shadow"
                />
                )}

        </div>
    )
    
}
export default CourseInfo;