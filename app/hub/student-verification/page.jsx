"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Award, Mail, Users, ArrowRight, CheckCircle } from 'lucide-react';

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
        <a href="/hub/pricing" className="px-6 py-2 rounded-full font-semibold text-md bg-gradient-to-r from-green-500 to-teal-500 text-white hover:scale-105 transition-transform">
          View Plans
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

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, options]);

    return [ref, isVisible];
};


// Main component for the Student Verification page.
export default function StudentVerificationPage() {
    const [heroRef, isHeroVisible] = useOnScreen({ threshold: 0.2 });
    const [benefitsRef, isBenefitsVisible] = useOnScreen({ threshold: 0.2 });
    const [stepsRef, isStepsVisible] = useOnScreen({ threshold: 0.2 });
    const [contactRef, isContactVisible] = useOnScreen({ threshold: 0.2 });
    const [communityRef, isCommunityVisible] = useOnScreen({ threshold: 0.2 });

    const benefits = [
        "80% discount on KnowGrow Pro membership.",
        "Full access to ALL courses and learning paths.",
        "Unlimited use of our AI-powered tools.",
        "Complete source code for all projects.",
        "Exclusive access to our student community.",
        "Priority career and internship support."
    ];

    const steps = [
        { title: "Prepare Your Proof", description: "Have your valid college ID card or an email from your official college email address (.edu, .ac.in, etc.) ready." },
        { title: "Contact Our Admin Team", description: "Reach out to our dedicated admin support with your proof of student status. Use the contact links below." },
        { title: "Get Verified & Enjoy!", description: "Once verified, we'll provide you with a unique discount code to unlock your benefits and start learning!" }
    ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 text-gray-800 overflow-x-hidden">
      <Header />
      <main>
        {/* Hero Section */}
        <section ref={heroRef} className="py-24 text-center">
          <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full flex items-center justify-center mb-6">
                <Award size={48} />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Unlock Your Student Offer
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We're excited to support your learning journey. Verify your student status to receive an exclusive <strong>80% discount</strong> on all KnowGrow resources.
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section ref={benefitsRef} className="py-20 bg-white/70">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className={`text-3xl font-bold text-gray-900 text-center mb-12 transition-all duration-700 ${isBenefitsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>What You'll Get</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {benefits.map((benefit, index) => (
                        <div key={index} className={`flex items-start p-4 transition-all duration-700 ${isBenefitsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ transitionDelay: `${index * 100}ms` }}>
                            <CheckCircle className="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                            <span className="text-gray-700 text-lg">{benefit}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* How-to Steps Section */}
        <section ref={stepsRef} className="py-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`text-center mb-16 transition-all duration-700 ${isStepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Verification is Simple</h2>
                    <p className="text-lg text-gray-600 mt-2">Follow these three easy steps to get verified.</p>
                </div>
                <div className="relative grid md:grid-cols-3 gap-8">
                    {/* Connecting line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 hidden md:block" style={{transform: 'translateY(-50%)'}}></div>
                    {steps.map((step, index) => (
                        <div key={index} className={`relative text-center p-6 transition-all duration-700 ${isStepsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} style={{ transitionDelay: `${index * 200}ms` }}>
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 z-10 relative border-4 border-white">
                                {index + 1}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                            <p className="text-gray-600 mt-2">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Contact Admin Section */}
        <section ref={contactRef} className="py-20 bg-white/70">
            <div className={`max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isContactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Verify?</h2>
                <p className="text-lg text-gray-600 mb-8">
                    Contact our admin team now with your college email or ID card. We'll get you set up in no time!
                </p>
                <a href="mailto:aiautomatedverify@gmail.com?subject=Student%20ID%20Verification" className="inline-block px-10 py-4 rounded-full font-semibold text-xl bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg hover:shadow-green-500/25 hover:scale-105 transition-all">
                    <span className="flex items-center gap-3 mx-auto justify-center">
                        <Mail /> Contact Admin for Verification
                    </span>
                </a>
            </div>
        </section>

        {/* Community CTA Section */}
         <section ref={communityRef} className="py-20">
            <div className={`max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isCommunityVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                  Find More Free Resources
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  While you wait for verification, join our community! Connect with thousands of learners, access free tutorials, and get a head start on your journey.
                </p>
                <a href="/hub/contact" className="inline-block px-8 py-3 rounded-full font-semibold bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all">
                    <span className="flex items-center gap-2">
                        <Users /> Join the Community
                    </span>
                </a>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
