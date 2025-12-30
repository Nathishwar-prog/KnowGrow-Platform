"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Rocket } from "lucide-react";

export default function CTASection() {
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
        <section ref={sectionRef} className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-teal-600 to-green-600" />
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }} />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className={`text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                        <Rocket className="w-4 h-4" />
                        Start Your Journey Today
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to Transform
                        <span className="block">Your Learning?</span>
                    </h2>

                    <p className="text-lg sm:text-xl text-green-100 max-w-2xl mx-auto mb-10">
                        Join thousands of learners who are already mastering new skills with AI-powered personalized education. Your future self will thank you.
                    </p>

                    <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <Link
                            href="/workspace"
                            className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:bg-green-50 transition-all duration-300 hover:scale-105"
                        >
                            <Sparkles className="w-5 h-5" />
                            Start Learning Free
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/hub/product"
                            className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/50 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                        >
                            Explore Features
                        </Link>
                    </div>

                    <p className={`text-green-200 text-sm mt-6 transition-all duration-700 delay-400 ${isVisible ? "opacity-100" : "opacity-0"}`}>
                        14-day free trial · No credit card required · Cancel anytime
                    </p>
                </div>
            </div>
        </section>
    );
}
