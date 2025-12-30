"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    Brain,
    Target,
    MessageCircle,
    FolderKanban,
    BarChart3,
    Sparkles,
    ArrowRight,
    CheckCircle,
    GraduationCap,
    Code,
    Users,
    Zap,
    Play,
    BookOpen,
    Trophy,
    Clock,
    Shield,
    Rocket
} from "lucide-react";

function useOnScreen(options = { threshold: 0.2 }) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, options);
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return [ref, isVisible];
}

const features = [
    {
        icon: Brain,
        title: "AI Course Generator",
        description: "Just describe what you want to learn, and our AI creates a complete, structured course in seconds.",
        details: [
            "Natural language input—no templates needed",
            "Structured chapters and lessons",
            "Automatic difficulty progression",
            "Video and text content integration"
        ],
        color: "from-green-500 to-teal-500",
        bgColor: "bg-green-50"
    },
    {
        icon: Target,
        title: "Adaptive AI Quizzes",
        description: "Smart quizzes that adjust difficulty based on your performance, ensuring optimal learning.",
        details: [
            "Dynamic difficulty adjustment",
            "Instant feedback and explanations",
            "Spaced repetition for retention",
            "Performance analytics"
        ],
        color: "from-blue-500 to-indigo-500",
        bgColor: "bg-blue-50"
    },
    {
        icon: FolderKanban,
        title: "Project Guidance",
        description: "Get step-by-step project roadmaps with real-time AI assistance to build portfolio-worthy work.",
        details: [
            "Curated project suggestions",
            "Milestone-based guidance",
            "Code review assistance",
            "Portfolio integration"
        ],
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-50"
    },
    {
        icon: MessageCircle,
        title: "Doubt Clarification",
        description: "24/7 AI tutor that understands context and provides clear, relevant explanations instantly.",
        details: [
            "Context-aware responses",
            "Code snippet explanations",
            "Visual diagrams when helpful",
            "Follow-up question support"
        ],
        color: "from-orange-500 to-red-500",
        bgColor: "bg-orange-50"
    },
    {
        icon: BarChart3,
        title: "Progress Analytics",
        description: "Track your learning journey with detailed insights into strengths, gaps, and achievements.",
        details: [
            "Visual progress dashboards",
            "Skill mastery tracking",
            "Learning streak motivation",
            "Achievement badges"
        ],
        color: "from-cyan-500 to-blue-500",
        bgColor: "bg-cyan-50"
    },
    {
        icon: Sparkles,
        title: "Unified Workspace",
        description: "All your courses, quizzes, projects, and progress in one beautifully organized dashboard.",
        details: [
            "Clean, intuitive interface",
            "Quick access to all tools",
            "Personalized recommendations",
            "Cross-device sync"
        ],
        color: "from-emerald-500 to-green-500",
        bgColor: "bg-emerald-50"
    }
];

const useCases = [
    {
        icon: GraduationCap,
        title: "Students",
        description: "Prepare for exams, learn new subjects, and build skills faster with personalized AI guidance.",
        stat: "2x",
        statLabel: "faster learning"
    },
    {
        icon: Code,
        title: "Developers",
        description: "Master new technologies, frameworks, and languages with hands-on projects and real-time help.",
        stat: "500+",
        statLabel: "tech topics"
    },
    {
        icon: Users,
        title: "Career Changers",
        description: "Transition into tech with structured learning paths and portfolio-building projects.",
        stat: "90%",
        statLabel: "completion rate"
    }
];

function FeatureCard({ feature, index }) {
    const [ref, isVisible] = useOnScreen();
    const Icon = feature.icon;

    return (
        <div
            ref={ref}
            className={`bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className={`${feature.bgColor} p-6`}>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
            </div>
            <div className="p-6 border-t border-gray-100">
                <ul className="space-y-3">
                    {feature.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm">{detail}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default function ProductPage() {
    const [heroRef, heroVisible] = useOnScreen();
    const [statsRef, statsVisible] = useOnScreen();

    return (
        <div className="min-h-screen bg-white">
            <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">KnowGrow</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">Home</Link>
                            <Link href="/hub/features" className="text-gray-600 hover:text-gray-900 font-medium">Features</Link>
                            <Link href="/hub/pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</Link>
                        </div>
                        <Link
                            href="/workspace"
                            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-5 py-2.5 rounded-full font-semibold shadow-lg shadow-green-500/20 transition-all duration-300"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </header>

            <main>
                <section ref={heroRef} className="pt-32 pb-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-white to-teal-50/60" />
                    <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className={`text-center max-w-4xl mx-auto transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                                <Sparkles className="w-4 h-4" />
                                Product Overview
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                                The Complete AI-Powered
                                <span className="block bg-gradient-to-r from-green-600 via-teal-500 to-green-600 bg-clip-text text-transparent">
                                    Learning Platform
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                                From course creation to mastery—KnowGrow combines cutting-edge AI with proven learning science to deliver personalized education at scale.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/workspace"
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-green-500/25 transition-all duration-300 hover:scale-105"
                                >
                                    Start Learning Free
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/hub/demo"
                                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-green-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300"
                                >
                                    <Play className="w-5 h-5 text-green-600" />
                                    Watch Demo
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section ref={statsRef} className="py-16 border-y border-gray-100 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-700 ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                            {[
                                { value: "10K+", label: "Active Learners" },
                                { value: "500+", label: "Topics Covered" },
                                { value: "95%", label: "Satisfaction Rate" },
                                { value: "24/7", label: "AI Support" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-600 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <Zap className="w-4 h-4" />
                                Core Features
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                                Everything You Need to
                                <span className="block bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                                    Succeed in Learning
                                </span>
                            </h2>
                            <p className="text-lg text-gray-600">
                                Six powerful AI-driven tools working together to create the ultimate learning experience.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <FeatureCard key={index} feature={feature} index={index} />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <Users className="w-4 h-4" />
                                Use Cases
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                                Built for Every Learner
                            </h2>
                            <p className="text-lg text-gray-600">
                                Whether you're a student, developer, or career changer—KnowGrow adapts to your needs.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {useCases.map((useCase, index) => {
                                const Icon = useCase.icon;
                                return (
                                    <div key={index} className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                                        <p className="text-gray-600 mb-6">{useCase.description}</p>
                                        <div className="inline-block bg-green-50 rounded-full px-6 py-3">
                                            <span className="text-2xl font-bold text-green-600">{useCase.stat}</span>
                                            <span className="text-green-600 ml-2">{useCase.statLabel}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                                Why Learners Choose KnowGrow
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: Clock, title: "Save Time", desc: "Learn 2x faster with AI-optimized paths" },
                                { icon: Shield, title: "Stay Focused", desc: "Distraction-free learning environment" },
                                { icon: Trophy, title: "Achieve More", desc: "Track progress and celebrate wins" },
                                { icon: Rocket, title: "Grow Faster", desc: "Personalized to your learning style" }
                            ].map((item, i) => (
                                <div key={i} className="text-center p-6">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <item.icon className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-teal-600 to-green-600" />
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                            <Rocket className="w-4 h-4" />
                            Start Today
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                            Ready to Transform Your Learning?
                        </h2>
                        <p className="text-xl text-green-100 max-w-2xl mx-auto mb-10">
                            Join thousands of learners who are already mastering new skills with KnowGrow.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/workspace"
                                className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                            >
                                <Sparkles className="w-5 h-5" />
                                Get Started Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                        <p className="text-green-200 text-sm mt-6">
                            14-day free trial · No credit card required · Cancel anytime
                        </p>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-900 text-gray-300 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-9 h-9 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">KnowGrow</span>
                    </div>
                    <p className="text-gray-400 mb-6">Transform your learning journey with AI.</p>
                    <div className="flex justify-center gap-6 mb-8">
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                        <Link href="/hub/features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
                        <Link href="/hub/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
                        <Link href="/hub/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
                    </div>
                    <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} KnowGrow. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
