"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Linkedin, Github, ArrowRight, Target, Lightbulb, Users } from 'lucide-react';

// Reusable Header component for consistency
const Header = () => (
  <header className="bg-white/95 backdrop-blur-lg border-b border-green-500/20 sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <a href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.22-6.22l-1.58 1.58a6 6 0 108.486 8.486L12 18.75l-1.78-1.78a6 6 0 00-8.486-8.486l1.58-1.58A6 6 0 0112 6.253z" /></svg>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            KnowGrow
          </span>
        </a>
        <a href="/hub/product" className="px-6 py-2 rounded-full font-semibold text-md bg-gradient-to-r from-green-500 to-teal-500 text-white hover:scale-105 transition-transform">
          Start Free Trial
        </a>
      </div>
    </div>
  </header>
);

// Reusable Footer component
const Footer = () => (
    <footer className="py-12 border-t border-green-500/20 bg-white/30 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} KnowGrow. All rights reserved. Growing knowledge through artificial intelligence.</p>
        </div>
    </footer>
);

// Custom hook for observing element visibility
const useOnScreen = (options) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    return [ref, isVisible];
};

// Main component for the About page.
export default function AboutPage() {
    const [storyRef, isStoryVisible] = useOnScreen({ threshold: 0.3 });
    const [founderRef, isFounderVisible] = useOnScreen({ threshold: 0.3 });
    const [valuesRef, isValuesVisible] = useOnScreen({ threshold: 0.3 });

    const values = [
        { icon: <Target />, title: "Purpose-Driven", description: "We are committed to making personalized education accessible to everyone, everywhere." },
        { icon: <Lightbulb />, title: "Constant Innovation", description: "We relentlessly pursue better ways to learn, leveraging the latest in AI and learning science." },
        { icon: <Users />, title: "Community-Centric", description: "We believe learning is a collaborative sport and foster a supportive, global community." },
    ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 text-gray-800 overflow-x-hidden">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-24 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-teal-500 to-green-600 bg-clip-text text-transparent">
              Democratizing Education Through AI
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We started KnowGrow with a simple belief: everyone deserves a personalized education that adapts to their unique potential.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section ref={storyRef} className="py-20 bg-white/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className={`transition-all duration-1000 ${isStoryVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Founded in 2024 , KnowGrow was born from a passion for technology and a frustration with the limitations of traditional education. We saw millions of ambitious learners held back by rigid, one-size-fits-all curricula.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            We envisioned a world where an AI-powered mentor could guide each student on a unique path to mastery. Today, that vision is a reality, empowering hundreds of thousands of users to learn faster, retain more, and achieve their career goals.
                        </p>
                    </div>
                    <div className={`transition-all duration-1000 delay-200 ${isStoryVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                        <img 
                            src="https://placehold.co/600x400/a7f3d0/14532d?text=KnowGrow+Team" 
                            alt="KnowGrow Team"
                            className="rounded-2xl shadow-xl w-full"
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* Founder Section */}
        <section ref={founderRef} className="py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Meet the Founder</h2>
                <div className={`bg-white rounded-2xl shadow-lg p-8 inline-block transition-all duration-1000 ${isFounderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <img 
                        src="https://placehold.co/150x150/10b981/ffffff?text=CEO" 
                        alt="CEO & Founder"
                        className="w-32 h-32 rounded-full mx-auto -mt-24 border-8 border-white"
                    />
                    <h3 className="text-2xl font-bold text-gray-900 mt-4">Nathishwar C</h3>
                    <p className="text-green-600 font-semibold">CEO & Founder</p>
                    <p className="text-gray-600 max-w-md mx-auto mt-4">
                        "I've always believed that technology's greatest promise is its ability to unlock human potential. With KnowGrow, we're not just building a product; we're creating a new paradigm for personal and professional growth."
                    </p>
                    <div className="flex justify-center gap-4 mt-6">
                        <a href="https://www.linkedin.com/in/nathishwar/" className="text-gray-400 hover:text-green-600 transition-colors"><Linkedin size={24} /></a>
                        <a href="https://github.com/Nathishwar-prog" className="text-gray-400 hover:text-green-600 transition-colors"><Github size={24} /></a>
                    </div>
                </div>
            </div>
        </section>

        {/* Our Values Section */}
        <section ref={valuesRef} className="py-20 bg-white/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Drives Us</h2>
                    <p className="text-lg text-gray-600 mt-2">Our core values guide every decision we make.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {values.map((value, index) => (
                        <div key={index} className={`p-8 text-center transition-all duration-700 ${isValuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 200}ms` }}>
                            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl flex items-center justify-center mb-6">
                                {value.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                            <p className="text-gray-600">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  Join Our Mission
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Be part of a community that's shaping the future of learning. Your journey to mastery starts here.
                </p>
                <a href="/hub/contact" className="inline-block px-10 py-4 rounded-full font-semibold text-xl bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg hover:shadow-green-500/25 hover:scale-105 transition-all">
                    <span className="flex items-center gap-3 mx-auto justify-center">
                        Start Your Journey <ArrowRight />
                    </span>
                </a>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
