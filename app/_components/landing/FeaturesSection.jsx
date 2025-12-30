"use client";

import React, { useEffect, useRef, useState } from "react";
import { Brain, GraduationCap, Sparkles, Target, MessageCircle, FolderKanban, BarChart3, Zap } from "lucide-react";

const features = [
    {
        icon: Brain,
        title: "AI Course Generator",
        description: "Describe your learning goal—our AI creates a complete, structured course with chapters, lessons, and resources tailored to you.",
        color: "from-green-500 to-teal-500",
        bgColor: "from-green-50 to-teal-50",
        borderColor: "border-green-200"
    },
    {
        icon: Target,
        title: "Smart AI Quizzes",
        description: "Adaptive quizzes that adjust difficulty based on your performance, helping you identify and strengthen weak areas.",
        color: "from-blue-500 to-indigo-500",
        bgColor: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-200"
    },
    {
        icon: FolderKanban,
        title: "Project Guidance",
        description: "Get step-by-step project roadmaps and real-time AI assistance to build portfolio-worthy projects as you learn.",
        color: "from-purple-500 to-pink-500",
        bgColor: "from-purple-50 to-pink-50",
        borderColor: "border-purple-200"
    },
    {
        icon: MessageCircle,
        title: "Doubt Clarification",
        description: "Stuck on a concept? Ask our AI tutor anything, anytime. Get instant, contextual explanations that make sense.",
        color: "from-orange-500 to-red-500",
        bgColor: "from-orange-50 to-red-50",
        borderColor: "border-orange-200"
    },
    {
        icon: BarChart3,
        title: "Progress Analytics",
        description: "Track your learning journey with detailed analytics. See your strengths, identify gaps, and celebrate milestones.",
        color: "from-cyan-500 to-blue-500",
        bgColor: "from-cyan-50 to-blue-50",
        borderColor: "border-cyan-200"
    },
    {
        icon: Sparkles,
        title: "Personalized Workspace",
        description: "Your unified learning dashboard—all courses, quizzes, projects, and progress in one beautifully organized space.",
        color: "from-emerald-500 to-green-500",
        bgColor: "from-emerald-50 to-green-50",
        borderColor: "border-emerald-200"
    }
];

function FeatureCard({ feature, index }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

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
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const Icon = feature.icon;

    return (
        <div
            ref={ref}
            className={`group bg-white rounded-2xl p-6 border ${feature.borderColor} shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
        </div>
    );
}

export default function FeaturesSection() {
    const [isVisible, setIsVisible] = useState(false);
    const headerRef = useRef(null);

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
        if (headerRef.current) observer.observe(headerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headerRef} className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Zap className="w-4 h-4" />
                        Powerful Features
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Everything You Need to
                        <span className="block bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                            Learn Smarter, Not Harder
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        Our AI-powered platform provides all the tools you need to achieve your learning goals efficiently and effectively.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
