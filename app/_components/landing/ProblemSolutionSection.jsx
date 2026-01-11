"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, CheckCircle, Zap, Brain } from "lucide-react";

const problems = [
    { icon: "🎥", text: "YouTube chaos—no structure", solution: "AI-organized curriculum" },
    { icon: "📚", text: "Outdated course content", solution: "Always current material" },
    { icon: "⏰", text: "One-size-fits-all pacing", solution: "Adaptive to your speed" },
    { icon: "❓", text: "Doubts with no answers", solution: "24/7 AI tutor support" },
    { icon: "📊", text: "No progress tracking", solution: "Real-time analytics" },
    { icon: "🎯", text: "Generic learning paths", solution: "Personalized roadmaps" },
];

export default function ProblemSolutionSection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Zap className="w-4 h-4" />
                        The Problem We Solve
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Traditional Learning is
                        <span className="block text-red-500">Broken</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        Scattered resources, outdated content, and no personalization. Sound familiar? Here's how KnowGrow fixes it.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                    <div className={`bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 border-2 border-red-200 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                <X className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-red-700">The Old Way</h3>
                        </div>
                        <div className="space-y-4">
                            {problems.map((problem, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 bg-white/60 rounded-xl p-4 border border-red-100"
                                >
                                    <span className="text-2xl">{problem.icon}</span>
                                    <span className="text-gray-700 font-medium">{problem.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-8 border-2 border-green-300 shadow-xl transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">The KnowGrow Way</h3>
                        </div>
                        <div className="space-y-4">
                            {problems.map((problem, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 bg-white rounded-xl p-4 border border-green-200 shadow-sm"
                                >
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <span className="text-gray-800 font-medium">{problem.solution}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
