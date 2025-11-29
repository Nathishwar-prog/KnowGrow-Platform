"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { UserDetailContext } from "../../../context/UserDetailContext";

export default function ContinueLearningSection({ enrolledCourses }) {
    // Calculate progress for each course
    const coursesWithProgress = enrolledCourses.map(enrollment => {
        const course = enrollment.courses;
        const enrollData = enrollment.enrollCourse;

        // Calculate progress based on completed chapters
        let progress = 0;
        if (course && enrollData && course.noOfChapters > 0) {
            const completedChapters = enrollData.completedChapters || [];
            progress = Math.round((completedChapters.length / course.noOfChapters) * 100);
        }

        return {
            ...enrollment,
            progress
        };
    });
    const { userDetail } = useContext(UserDetailContext);

    return (
        <section className="py-20 bg-gradient-to-r from-green-50 to-teal-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Hey {userDetail?.name} , Continue Learning</h2>
                    <Link href="/workspace/my-learning" className="text-green-600 hover:text-green-800 font-medium flex items-center">
                        View All
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {coursesWithProgress.slice(0, 3).map((enrollment, index) => {
                        const course = enrollment.courses;
                        const progress = enrollment.progress;

                        return (
                            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="p-6">
                                    <div className="flex items-start mb-5">
                                        <div className="bg-gradient-to-br from-green-400 to-teal-500 rounded-xl w-16 h-16 flex items-center justify-center text-white">
                                            <BookOpen className="w-8 h-8" />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{course.name}</h3>
                                            <p className="text-gray-600 text-sm mt-1">{course.level} • {course.category}</p>
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                            <span>Progress</span>
                                            <span className="font-medium">{progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/course/${course.cid}`}
                                        className="w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all duration-300"
                                    >
                                        Continue Learning
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
