"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Play, Sparkles, CheckCircle, Brain, Zap, Target } from "lucide-react";

export default function HeroSection({ onSearch, onQueryChange, setShowDemoModal }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative pt-28 pb-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-white to-teal-50/60" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            AI-Powered Learning Platform
                        </div>
                    </div>

                    <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        Master Any Skill with
                        <span className="block bg-gradient-to-r from-green-600 via-teal-500 to-green-600 bg-clip-text text-transparent">
                            Your Personal AI Tutor
                        </span>
                    </h1>

                    <p className={`text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        KnowGrow generates personalized courses, adaptive quizzes, and real-time guidance—all powered by AI that learns how <em>you</em> learn best.
                    </p>

                    <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-10 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <Link
                            href="/workspace"
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105"
                        >
                            Start Learning Free
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={() => setShowDemoModal(true)}
                            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-green-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <Play className="w-5 h-5 text-green-600" />
                            Watch Demo
                        </button>
                    </div>

                    <div className={`flex flex-wrap justify-center gap-6 text-sm text-gray-600 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <span className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            No credit card required
                        </span>
                        <span className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            14-day free trial
                        </span>
                        <span className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Cancel anytime
                        </span>
                    </div>
                </div>

                <div className={`mt-16 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 via-teal-500/20 to-green-500/20 rounded-3xl blur-xl" />
                        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="flex-1 text-center text-sm text-gray-500 font-medium">KnowGrow Workspace</div>
                            </div>
                            <div className="p-6 sm:p-8">
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-5 border border-green-100 hover:shadow-lg transition-shadow">
                                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-3">
                                            <Brain className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1">AI Course Generator</h3>
                                        <p className="text-sm text-gray-600">Create personalized courses instantly</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 hover:shadow-lg transition-shadow">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-3">
                                            <Target className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Smart Quizzes</h3>
                                        <p className="text-sm text-gray-600">Adaptive testing that grows with you</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 hover:shadow-lg transition-shadow">
                                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-3">
                                            <Zap className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Real-time Guidance</h3>
                                        <p className="text-sm text-gray-600">24/7 AI tutor for any question</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
