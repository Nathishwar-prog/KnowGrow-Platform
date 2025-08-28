"use client";

import React, { useRef, useEffect, useState } from 'react';
import { BookCopy, Award, Briefcase, ArrowRight, AlertTriangle } from 'lucide-react';

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


// Main component for the Exam Center page.
export default function ExamCenterPage() {
    const examRef = useRef(null);
    const verificationRef = useRef(null);
    const internshipRef = useRef(null);

    const [examVisibleRef, isExamVisible] = useOnScreen({ threshold: 0.2 });
    const [verificationVisibleRef, isVerificationVisible] = useOnScreen({ threshold: 0.2 });
    const [internshipVisibleRef, isInternshipVisible] = useOnScreen({ threshold: 0.2 });

    const scrollTo = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 text-gray-800 overflow-x-hidden">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-24 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-teal-500 to-green-600 bg-clip-text text-transparent">
              Welcome to the KnowGrow Exam Center
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              This is your hub for official certifications and career opportunities. Take the next step in your professional journey.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button onClick={() => scrollTo(examRef)} className="px-6 py-3 rounded-full font-semibold text-lg bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all flex items-center justify-center gap-2">
                    <BookCopy size={20} /> Book Your Exam
                </button>
                <button onClick={() => scrollTo(verificationRef)} className="px-6 py-3 rounded-full font-semibold text-lg bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all flex items-center justify-center gap-2">
                    <Award size={20} /> Certificate Verification
                </button>
                <button onClick={() => scrollTo(internshipRef)} className="px-6 py-3 rounded-full font-semibold text-lg bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                    <Briefcase size={20} /> Internship Portal
                </button>
            </div>
             <div className="mt-8 text-center">
                <p className="text-gray-600 flex items-center justify-center gap-2">
                    <AlertTriangle size={20} className="text-yellow-500" />
                    Kindly read all instructions before applying to anything.
                </p>
            </div>
          </div>
        </section>

        {/* Instructions Section */}
        <div className="space-y-4">
            {/* Book Your Exam */}
            <section ref={examRef} id="book-exam" className="py-20 bg-white/70">
                <div ref={examVisibleRef} className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 ${isExamVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Booking Your Proctored Exam</h2>
                        <div className="space-y-4 text-gray-700 leading-relaxed">
                            <p><strong>Eligibility:</strong> You must be a KnowGrow Pro member and have completed 100% of the relevant learning path.</p>
                            <p><strong>System Requirements:</strong> A stable internet connection, a webcam, a microphone, and a quiet room are required. The exam must be taken on a desktop or laptop computer.</p>
                            <p><strong>Rules of Conduct:</strong> No external resources (notes, books, other websites) are permitted. You must remain in view of the webcam for the entire duration of the exam. Any violation will result in immediate disqualification.</p>
                        </div>
                        <a href="/hub/restrict" className="inline-block mt-8 px-8 py-3 rounded-full font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors">
                            Go to Exam Portal
                        </a>
                    </div>
                    <div className="p-8">
                        {/* Diagram for Exam Booking */}
                        <svg viewBox="0 0 200 150" className="w-full h-auto">
                            <rect x="30" y="20" width="140" height="110" rx="10" fill="#f0fdf4" stroke="#d1fae5" strokeWidth="2"/>
                            <rect x="40" y="30" width="120" height="15" fill="#d1fae5"/>
                            <circle cx="160" cy="120" r="20" fill="#10b981"/>
                            <path d="M154 115 l6 6 l6 -12" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
                            <path d="M45 55 h110 M45 70 h110 M45 85 h70" stroke="#a7f3d0" strokeWidth="4" strokeLinecap="round"/>
                            <circle cx="60" cy="115" r="10" fill="#fde047"/>
                            <path d="M60 110 v10 M55 115 h10" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                </div>
            </section>

            {/* Certificate Verification */}
            <section ref={verificationRef} id="verify-certificate" className="py-20">
                <div ref={verificationVisibleRef} className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 ${isVerificationVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                     <div className="p-8 md:order-2">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Certificate Verification Hub</h2>
                        <div className="space-y-4 text-gray-700 leading-relaxed">
                            <p><strong>Authenticity Guaranteed:</strong> Every KnowGrow certificate comes with a unique, verifiable ID. This ensures that your credentials can be trusted by employers and academic institutions.</p>
                            <p><strong>How to Verify:</strong> To verify a certificate, you will need the full name of the recipient and the unique certificate ID. Enter these details into our verification portal.</p>
                            <p><strong>For Employers:</strong> Instantly confirm the qualifications of potential candidates, streamlining your hiring process.</p>
                        </div>
                         <a href="/hub/comming-soon" className="inline-block mt-8 px-8 py-3 rounded-full font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors">
                            Verify a Certificate
                        </a>
                    </div>
                    <div className="p-8 md:order-1">
                        {/* Diagram for Verification */}
                        <svg viewBox="0 0 200 150" className="w-full h-auto">
                            <path d="M20 30 L180 30 L160 120 L40 120 Z" fill="#f0fdf4" stroke="#d1fae5" strokeWidth="2"/>
                            <circle cx="100" cy="75" r="30" fill="#10b981" />
                            <path d="M90 70 l8 15 l15 -20" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
                            <path d="M50 45 h100 M60 55 h80" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="150" cy="100" r="15" fill="#fde047"/>
                        </svg>
                    </div>
                </div>
            </section>

            {/* Internship Portal */}
            <section ref={internshipRef} id="apply-internship" className="py-20 bg-white/70">
                <div ref={internshipVisibleRef} className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 ${isInternshipVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Internship Application Portal</h2>
                        <div className="space-y-4 text-gray-700 leading-relaxed">
                            <p><strong>Eligibility:</strong> To apply for internships, you must be an active KnowGrow Pro member and hold at least one verified Pro-level certificate.</p>
                            <p><strong>Application Process:</strong> Browse available positions in the portal. Your KnowGrow profile, including completed courses and certificates, will be automatically attached to your application.</p>
                            <p><strong>Our Commitment:</strong> We partner with leading tech companies to provide you with exclusive internship opportunities to kickstart your career.</p>
                        </div>
                        <a href="/hub/comming-soon" className="inline-block mt-8 px-8 py-3 rounded-full font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors">
                            Browse Internships
                        </a>
                    </div>
                     <div className="p-8">
                        {/* Diagram for Internships */}
                        <svg viewBox="0 0 200 150" className="w-full h-auto">
                            <rect x="20" y="50" width="50" height="80" rx="5" fill="#d1fae5"/>
                            <rect x="80" y="30" width="40" height="100" rx="5" fill="#a7f3d0"/>
                            <rect x="130" y="60" width="50" height="70" rx="5" fill="#6ee7b7"/>
                            <circle cx="100" cy="75" r="25" fill="#10b981"/>
                            <path d="M92 70 l6 6 l10 -10" stroke="white" fill="none" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                    </div>
                </div>
            </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
