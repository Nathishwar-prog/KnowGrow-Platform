"use client";

import React, { useState, useEffect, useRef } from 'react';
import { BrainCircuit, BookOpen, Users, BarChart3, ArrowRight } from 'lucide-react';

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

// Animated SVG for Personalized Path
const PersonalizedPathAnimation = ({ isVisible }) => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
            </marker>
        </defs>
        <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="2" />
        <path d="M100,20 A80,80 0 0,1 180,100" stroke="#10B981" strokeWidth="3" fill="none" markerEnd="url(#arrow)" className={isVisible ? 'animate-draw-long' : ''} style={{ animationDelay: '0.3s' }} />
        <path d="M180,100 A80,80 0 0,1 100,180" stroke="#6ee7b7" strokeWidth="3" fill="none" className={isVisible ? 'animate-draw-long' : ''} style={{ animationDelay: '0.8s' }} />
        <circle cx="100" cy="20" r="8" fill="#10B981" className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '0.5s' }} />
        <circle cx="180" cy="100" r="8" fill="#10B981" className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1s' }} />
        <circle cx="100" cy="180" r="8" fill="#6ee7b7" className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1.5s' }} />
        <BrainCircuit size={48} x="76" y="76" className={`text-teal-500 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{ transitionDelay: '0.2s' }} />
    </svg>
);

// Feature component with alternating layout
const FeatureSection = ({ feature, index }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.3 });
    const isOdd = index % 2 !== 0;

    return (
        <div ref={ref} className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'} ${isOdd ? 'md:order-2' : ''}`}>
                <div className="p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                    {feature.animation}
                </div>
            </div>
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} ${isOdd ? 'md:order-1' : ''}`}>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl flex items-center justify-center mb-4">
                    {feature.icon}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{feature.title}</h2>
                <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                <ul className="space-y-2">
                    {feature.points.map((point, i) => (
                        <li key={i} className="flex items-start">
                            <ArrowRight className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{point}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


// Main component for the Features page.
export default function FeaturesPage() {
    
    const featuresData = [
        {
            icon: <BrainCircuit size={32} />,
            title: "AI-Powered Personalized Path",
            description: "Say goodbye to one-size-fits-all education. Our intelligent AI analyzes your learning style, pace, and knowledge gaps to construct a unique curriculum just for you. It’s the most efficient way to master new skills.",
            points: [
                "Dynamic curriculum that adapts in real-time.",
                "Focus on your weak points to build a solid foundation.",
                "Accelerate through topics you already understand."
            ],
            animation: <PersonalizedPathAnimation isVisible={true} /> // This will be controlled by the FeatureSection
        },
        {
            icon: <BookOpen size={32} />,
            title: "Interactive & Engaging Content",
            description: "Learning shouldn't be passive. Dive into hands-on coding environments, interactive simulations, and real-world projects that make learning stick. Get instant feedback to learn from your mistakes immediately.",
            points: [
                "Live coding sandboxes for risk-free experimentation.",
                "Gamified quizzes and challenges to keep you motivated.",
                "Project-based learning to build a portfolio as you learn."
            ],
            animation: <div className="text-center p-8"><h2 className="text-2xl font-bold text-gray-400">Interactive Content Animation</h2></div> // Placeholder for animation
        },
        {
            icon: <Users size={32} />,
            title: "Collaborative Learning Community",
            description: "You're not alone on your learning journey. Join study groups, participate in peer code reviews, and connect with mentors from our global community of over 500,000 learners and developers.",
            points: [
                "Connect with peers who share your goals and interests.",
                "Get unstuck faster with help from the community.",
                "Network with professionals and find career opportunities."
            ],
            animation: <div className="text-center p-8"><h2 className="text-2xl font-bold text-gray-400">Community Animation</h2></div> // Placeholder for animation
        },
        {
            icon: <BarChart3 size={32} />,
            title: "Advanced Performance Analytics",
            description: "Track your progress with a detailed analytics dashboard. Understand your strengths, identify areas for improvement, and see a clear visualization of your journey from novice to expert.",
            points: [
                "Visualize your skill mastery across different topics.",
                "Set goals and track your progress towards them.",
                "Benchmark your performance against anonymized peer data."
            ],
            animation: <div className="text-center p-8"><h2 className="text-2xl font-bold text-gray-400">Analytics Animation</h2></div> // Placeholder for animation
        },
    ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 text-gray-800 overflow-x-hidden">
      <style>{`
        .animate-draw-long {
            stroke-dashoffset: 0;
            transition: stroke-dashoffset 1s ease-in-out;
        }
        path {
            stroke-dashoffset: 500;
        }
      `}</style>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-24 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-teal-500 to-green-600 bg-clip-text text-transparent">
              The Future of Learning is Here
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover the powerful, AI-driven features that make KnowGrow the smartest way to build your skills and advance your career.
            </p>
          </div>
        </section>

        {/* Features List Section */}
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
                {featuresData.map((feature, index) => (
                    <FeatureSection 
                        key={index} 
                        feature={{...feature, animation: index === 0 ? <PersonalizedPathAnimation isVisible={true} /> : feature.animation}}
                        index={index} 
                    />
                ))}
            </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="py-20 bg-white/70">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  Ready to Unlock Your Potential?
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Experience these features and more. Start your free trial today and see the KnowGrow difference for yourself.
                </p>
                <a href="/hub/contact" className="inline-block px-10 py-4 rounded-full font-semibold text-xl bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg hover:shadow-green-500/25 hover:scale-105 transition-all">
                    <span className="flex items-center gap-3 mx-auto justify-center">
                        Claim Your Free Trial <ArrowRight />
                    </span>
                </a>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
