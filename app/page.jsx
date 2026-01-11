"use client";

import React, { useState, useEffect, useContext } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import dynamic from "next/dynamic";
import axios from "axios";
import { Menu, X, ChevronDown, Loader2, Brain } from "lucide-react";
import { UserDetailContext } from "../context/UserDetailContext";
import HeroSection from "./_components/landing/HeroSection";
import ProblemSolutionSection from "./_components/landing/ProblemSolutionSection";
import HowItWorksSection from "./_components/landing/HowItWorksSection";
import CTASection from "./_components/landing/CTASection";

const FeaturesSection = dynamic(() => import("./_components/landing/FeaturesSection"), {
    loading: () => <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-green-500" /></div>
});
const TestimonialsSection = dynamic(() => import("./_components/landing/TestimonialsSection"));
const FAQSection = dynamic(() => import("./_components/landing/FAQSection"));
const ContinueLearningSection = dynamic(() => import("./_components/landing/ContinueLearningSection"));

export default function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [scrolled, setScrolled] = useState(false);

    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const { userDetail } = useContext(UserDetailContext);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const logout = async () => {
        try {
            await signOut();
            window.location.href = '/';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            if (user && isLoaded) {
                try {
                    const response = await axios.get('/api/enroll-course');
                    setEnrolledCourses(response.data);
                } catch (error) {
                    console.error("Error fetching enrolled courses:", error);
                }
            }
        };
        fetchEnrolledCourses();
    }, [user, isLoaded]);

    return (
        <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden font-sans">
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-lg shadow-sm" : "bg-transparent"}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">KnowGrow</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/hub/product" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Product</Link>
                        <Link href="/hub/features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</Link>
                        <Link href="/hub/pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Pricing</Link>
                        <Link href="/hub/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">About</Link>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                        {userDetail?.name?.charAt(0) || user?.firstName?.charAt(0) || "U"}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
                                </button>
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                        <Link href="/workspace" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Dashboard</Link>
                                        <Link href="/workspace/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Settings</Link>
                                        <hr className="my-2 border-gray-100" />
                                        <button onClick={logout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Sign out</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Sign in</Link>
                                <Link
                                    href="/sign-up"
                                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-5 py-2.5 rounded-full font-semibold shadow-lg shadow-green-500/20 hover:shadow-xl transition-all duration-300"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100">
                        <div className="px-4 py-4 space-y-3">
                            <Link href="/hub/product" className="block py-2 text-gray-700 font-medium">Product</Link>
                            <Link href="/hub/features" className="block py-2 text-gray-700 font-medium">Features</Link>
                            <Link href="/hub/pricing" className="block py-2 text-gray-700 font-medium">Pricing</Link>
                            <Link href="/hub/about" className="block py-2 text-gray-700 font-medium">About</Link>
                            <hr className="border-gray-100" />
                            {user ? (
                                <>
                                    <Link href="/workspace" className="block py-2 text-gray-700 font-medium">Dashboard</Link>
                                    <button onClick={logout} className="block py-2 text-red-600 font-medium">Sign out</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/sign-in" className="block py-2 text-gray-700 font-medium">Sign in</Link>
                                    <Link
                                        href="/sign-up"
                                        className="block w-full text-center bg-gradient-to-r from-green-500 to-teal-500 text-white px-5 py-3 rounded-full font-semibold"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {user && isLoaded && enrolledCourses.length > 0 && (
                <ContinueLearningSection enrolledCourses={enrolledCourses} />
            )}

            <HeroSection setShowDemoModal={setShowDemoModal} />
            <ProblemSolutionSection />
            <FeaturesSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <FAQSection />
            <CTASection />

            {showDemoModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDemoModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowDemoModal(false)}
                            className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">See KnowGrow in Action</h2>
                            <p className="text-gray-600 mb-6">Experience the AI-powered learning journey</p>
                            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                                <iframe
                                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <footer className="bg-gray-900 text-gray-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-9 h-9 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                                    <Brain className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">KnowGrow</span>
                            </div>
                            <p className="text-gray-400 max-w-md mb-6">
                                Transform your learning journey with AI-powered personalized courses. Learn smarter, achieve faster.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Product</h3>
                            <ul className="space-y-3">
                                <li><Link href="/hub/product" className="text-gray-400 hover:text-white transition-colors">Overview</Link></li>
                                <li><Link href="/hub/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                                <li><Link href="/hub/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link href="/workspace" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Company</h3>
                            <ul className="space-y-3">
                                <li><Link href="/hub/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                                <li><Link href="/hub/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                                <li><Link href="/security/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
                                <li><Link href="/security/terms-conditions" className="text-gray-400 hover:text-white transition-colors">Terms</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
                        <p>&copy; {new Date().getFullYear()} KnowGrow. All rights reserved. Made with care for learners everywhere.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
