"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Users, Zap, Award, ArrowRight, PlayCircle } from 'lucide-react';

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


// Animated Flowchart Component
const AiFlowchart = () => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.2 });

    const flowSteps = [
        { title: "Input Your Goals", description: "Tell our AI what you want to learn, from a single skill to a new career path." },
        { title: "AI Analysis", description: "KnowGrow analyzes your goals and existing knowledge to find the optimal learning sequence." },
        { title: "Personalized Path", description: "Receive a unique, dynamic learning path with curated content and projects." },
        { title: "Learn & Adapt", description: "As you progress, the AI adapts your path in real-time, reinforcing weak spots and accelerating strengths." },
    ];

    return (
        <div ref={ref} className="relative">
            {/* SVG lines for animation */}
            <svg className="absolute top-0 left-0 w-full h-full" width="100%" height="100%" preserveAspectRatio="none">
                 <path 
                    d="M 50,20 C 50,80 50,80 50,130" 
                    stroke="#10B981" strokeWidth="2" fill="none"
                    strokeDasharray="200"
                    className={isVisible ? 'animate-draw' : ''}
                    style={{ animationDelay: '0.2s' }}
                />
                 <path 
                    d="M 50,150 C 50,210 50,210 50,260" 
                    stroke="#10B981" strokeWidth="2" fill="none"
                    strokeDasharray="200"
                    className={isVisible ? 'animate-draw' : ''}
                     style={{ animationDelay: '0.8s' }}
                />
                 <path 
                    d="M 50,280 C 50,340 50,340 50,390" 
                    stroke="#10B981" strokeWidth="2" fill="none"
                    strokeDasharray="200"
                    className={isVisible ? 'animate-draw' : ''}
                     style={{ animationDelay: '1.4s' }}
                />
            </svg>
            
            <div className="space-y-16">
                {flowSteps.map((step, index) => (
                    <div key={index} className={`flex items-center gap-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: `${0.2 + index * 0.6}s` }}>
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-lg">
                           {index + 1}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// Main component for the Demo page.
export default function DemoPage() {
  const [communityRef, isCommunityVisible] = useOnScreen({ threshold: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isCommunityVisible) {
      const target = 500; // Target count in thousands (500K)
      const duration = 2000; // 2 seconds
      let start = 0;
      const increment = target / (duration / 16); // 60fps

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          start = target;
          clearInterval(timer);
        }
        setCount(Math.ceil(start));
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isCommunityVisible]);

  const features = [
      { icon: <Zap />, title: "Accelerated Learning", description: "Our AI curriculum is designed to help you master skills 2x faster than traditional methods." },
      { icon: <Users />, title: "Global Community", description: "Connect with peers, mentors, and alumni from top companies around the world." },
      { icon: <Briefcase />, title: "Career Support", description: "Get resume reviews, mock interviews, and access to our exclusive job board." },
      { icon: <Award />, title: "Verified Credentials", description: "Earn certificates that are recognized by industry leaders and add them to your professional profile." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 text-gray-800">
      <style>{`
        .animate-draw {
            stroke-dashoffset: 0;
            transition: stroke-dashoffset 0.8s ease-in-out;
        }
        path {
            stroke-dashoffset: 200;
        }
        .animate-fade-in-down {
            animation: fadeInDown 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-24 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-teal-500 to-green-600 bg-clip-text text-transparent animate-fade-in-down">
              See How KnowGrow Works
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Watch our AI in action. Discover a smarter, faster, and more effective way to learn and grow your skills.
            </p>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                 <a href="#video-placeholder" className="inline-block px-8 py-4 rounded-full font-semibold text-lg bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg hover:shadow-green-500/25 hover:scale-105 transition-all">
                    <span className="flex items-center gap-2">
                        <PlayCircle />
                        Watch the Demo Video
                    </span>
                </a>
            </div>
          </div>
        </section>

        {/* AI Flowchart Section */}
        <section className="py-20 bg-white/70">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Your Personalized Journey to Mastery</h2>
                    <p className="text-lg text-gray-600 mt-2">This is how our AI crafts the perfect learning experience just for you.</p>
                </div>
                <AiFlowchart />
            </div>
        </section>

        {/* Community & Career Section */}
        <section ref={communityRef} className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">More Than a Platform. A Community.</h2>
                    <p className="text-lg text-gray-600 mt-2">Join the world's largest and most active community of developers and learners.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className={`text-center md:text-left transition-opacity duration-1000 ${isCommunityVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <p className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">{count}K+</p>
                        <p className="text-2xl font-semibold text-gray-800 mt-2">Active Members Worldwide</p>
                        <p className="text-gray-600 mt-4">
                            From beginners to experts, our community is a vibrant hub for collaboration, support, and networking. Get help, share your projects, and grow together.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                             <div key={index} className={`p-6 bg-white rounded-2xl shadow-md border border-gray-100 transition-all duration-700 ${isCommunityVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 150}ms` }}>
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-gray-900">{feature.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="py-20">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  Ready to Transform Your Future?
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Start your free trial today and experience the future of learning. No credit card required.
                </p>
                <a href="/hub/product" className="inline-block px-10 py-4 rounded-full font-semibold text-xl bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg hover:shadow-green-500/25 hover:scale-105 transition-all">
                    <span className="flex items-center gap-3 mx-auto justify-center">
                        Start Learning for Free <ArrowRight />
                    </span>
                </a>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
