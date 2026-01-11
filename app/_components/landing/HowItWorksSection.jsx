"use client";

import React, { useState, useEffect, useRef } from "react";
import { Target, Sparkles, BookOpen, Trophy, ArrowRight } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: Target,
        title: "Set Your Goal",
        description: "Tell us what you want to learn—a skill, topic, or career path. Our AI understands your intent and creates a personalized learning roadmap.",
        color: "from-green-500 to-teal-500"
    },
    {
        number: "02",
        icon: Sparkles,
        title: "AI Generates Your Course",
        description: "Within seconds, our AI creates a complete course structure with chapters, lessons, quizzes, and project milestones tailored to your level.",
        color: "from-blue-500 to-indigo-500"
    },
    {
        number: "03",
        icon: BookOpen,
        title: "Learn with AI Guidance",
        description: "Study at your own pace with interactive content. Get instant answers to doubts, project guidance, and adaptive quizzes that reinforce learning.",
        color: "from-purple-500 to-pink-500"
    },
    {
        number: "04",
        icon: Trophy,
        title: "Track & Achieve",
        description: "Monitor your progress in real-time. Complete courses, build your portfolio, and celebrate achievements as you master new skills.",
        color: "from-orange-500 to-red-500"
    }
];

function StepCard({ step, index, isActive }) {
    const Icon = step.icon;

    return (
        <div
            className={`relative p-6 rounded-2xl border-2 transition-all duration-500 ${isActive ? "bg-white border-green-300 shadow-xl scale-105" : "bg-gray-50 border-gray-200"}`}
        >
            <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                    <div className={`text-sm font-bold mb-1 ${isActive ? "text-green-600" : "text-gray-400"}`}>
                        STEP {step.number}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
            </div>
            {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-8 top-1/2 transform -translate-y-1/2 z-10">
                    <ArrowRight className={`w-6 h-6 ${isActive ? "text-green-500" : "text-gray-300"}`} />
                </div>
            )}
        </div>
    );
}

export default function HowItWorksSection() {
    const [activeStep, setActiveStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isVisible]);

    return (
        <section ref={sectionRef} className="py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        Simple Process
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        How KnowGrow Works
                    </h2>
                    <p className="text-lg text-gray-600">
                        From setting your goal to mastering new skills—here's your journey in four simple steps.
                    </p>
                </div>

                <div className="hidden lg:flex items-center justify-center mb-12">
                    <div className="flex items-center gap-4">
                        {steps.map((step, index) => (
                            <React.Fragment key={index}>
                                <button
                                    onClick={() => setActiveStep(index)}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${activeStep === index
                                            ? "bg-gradient-to-r from-green-500 to-teal-500 text-white scale-110 shadow-lg"
                                            : activeStep > index
                                                ? "bg-green-100 text-green-600"
                                                : "bg-gray-100 text-gray-400"
                                        }`}
                                >
                                    {index + 1}
                                </button>
                                {index < steps.length - 1 && (
                                    <div className={`w-16 h-1 rounded-full transition-all duration-500 ${activeStep > index ? "bg-green-400" : "bg-gray-200"}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className={`grid lg:grid-cols-2 gap-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    {steps.map((step, index) => (
                        <StepCard
                            key={index}
                            step={step}
                            index={index}
                            isActive={activeStep === index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
