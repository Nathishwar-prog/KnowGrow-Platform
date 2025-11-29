"use client";

import React from "react";
import Image from "next/image";

export default function TestimonialsSection() {
    return (
        <section id="testimonials" className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">What Our Students Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                            <p className="text-gray-600 mb-4">"KnowGrow has transformed my learning experience. The personalized approach and expert instructors have made a huge difference."</p>
                            <div className="flex items-center">
                                <div className="relative w-10 h-10 mr-4">
                                    <Image
                                        src="https://placehold.co/100x100/png?text=User"
                                        alt="John Doe"
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">John Doe</h3>
                                    <p className="text-gray-600">Software Engineer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                            <p className="text-gray-600 mb-4">"The interactive quizzes and projects have helped me retain information better and apply it in real-world scenarios."</p>
                            <div className="flex items-center">
                                <div className="relative w-10 h-10 mr-4">
                                    <Image
                                        src="https://placehold.co/100x100/png?text=User"
                                        alt="Jane Smith"
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Jane Smith</h3>
                                    <p className="text-gray-600">Graphic Designer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                            <p className="text-gray-600 mb-4">"I've been able to advance my career thanks to the comprehensive courses and expert guidance on KnowGrow."</p>
                            <div className="flex items-center">
                                <div className="relative w-10 h-10 mr-4">
                                    <Image
                                        src="https://placehold.co/100x100/png?text=User"
                                        alt="Sam Johnson"
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Sam Johnson</h3>
                                    <p className="text-gray-600">Project Manager</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
