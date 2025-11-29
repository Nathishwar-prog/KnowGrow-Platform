"use client";

import React from "react";
import { Brain, GraduationCap, Briefcase, Trophy, Sparkles, BookOpenIcon } from "lucide-react";

export default function FeaturesSection() {
    return (
        <section id="features" className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose KnowGrow?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <Brain className="w-10 h-10 text-green-500" />
                                <h3 className="ml-4 text-xl font-semibold text-gray-900">Personalized Learning</h3>
                            </div>
                            <p className="text-gray-600">Tailored lessons that adapt to your learning pace and style.</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <GraduationCap className="w-10 h-10 text-green-500" />
                                <h3 className="ml-4 text-xl font-semibold text-gray-900">Expert Instructors</h3>
                            </div>
                            <p className="text-gray-600">Learn from industry experts and professionals.</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <Briefcase className="w-10 h-10 text-green-500" />
                                <h3 className="ml-4 text-xl font-semibold text-gray-900">Career Advancement</h3>
                            </div>
                            <p className="text-gray-600">Boost your career with new skills and knowledge.</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <Trophy className="w-10 h-10 text-green-500" />
                                <h3 className="ml-4 text-xl font-semibold text-gray-900">Achieve Your Goals</h3>
                            </div>
                            <p className="text-gray-600">Set and reach your learning objectives with ease.</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <Sparkles className="w-10 h-10 text-green-500" />
                                <h3 className="ml-4 text-xl font-semibold text-gray-900">Interactive Experience</h3>
                            </div>
                            <p className="text-gray-600">Engage with quizzes, projects, and more.</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <BookOpenIcon className="w-10 h-10 text-green-500" />
                                <h3 className="ml-4 text-xl font-semibold text-gray-900">Comprehensive Courses</h3>
                            </div>
                            <p className="text-gray-600">Explore a wide range of topics and skills.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
