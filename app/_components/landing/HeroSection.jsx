"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import SearchBar from "./SearchBar";
import RedirectButton from "./RedirectButton";

export default function HeroSection({ onSearch, onQueryChange, setShowDemoModal }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section id="hero" className="pt-32 pb-20 relative bg-white overflow-hidden">
            <div className="absolute -top-1/2 left-0 w-full h-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(209,250,229,0.8) 0%, rgba(255,255,255,0) 60%)' }}></div>
            <div className="absolute top-1/4 -right-1/2 w-full h-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(219,234,254,0.7) 0%, rgba(255,255,255,0) 60%)' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center relative z-10">
                <div className={`transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                    <div className="animate-float" style={{ animationDelay: '0.5s' }}>
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
                            Think it's <span className="text-red-500 font-bold line-through">impossible?</span>
                            <br />
                            <span className="gradient-text">It's possible with KnowGrow.</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Transform your "I can't" into "I did it!" with AI that adapts to you. Every lesson, personalized. Every doubt, resolved. Every dream, achievable.
                        </p>

                        <SearchBar onSearch={onSearch} onQueryChange={onQueryChange} />

                        <div className="flex flex-col sm:flex-row gap-4 items-start mt-8">
                            <RedirectButton label="Start Your Journey Free" href="/hub/product" variant="primary" icon="arrow" className="text-lg px-8 py-4" />
                            <RedirectButton label="See It In Action" variant="secondary" icon="play" className="text-lg px-8 py-4" onClick={() => setShowDemoModal(true)} />
                        </div>
                        <div className="flex flex-wrap gap-6 text-sm text-gray-600 mt-6">
                            <span className="flex items-center"><CheckCircle className="w-5 h-5 text-green-600 mr-2" />No credit card needed</span>
                            <span className="flex items-center"><CheckCircle className="w-5 h-5 text-green-600 mr-2" />14-day free trial</span>
                            <span className="flex items-center"><CheckCircle className="w-5 h-5 text-green-600 mr-2" />Cancel anytime</span>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block">
                    <Image
                        src="/Hero_image.png"
                        alt="Hero Image"
                        width={600}
                        height={400}
                        priority
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </section>
    );
}
