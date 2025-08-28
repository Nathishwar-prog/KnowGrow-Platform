"use client";
import React from 'react';
import { Check, Star, ArrowRight, Book, Award } from 'lucide-react';

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


// Main component for the Pricing page.
export default function PricingPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 text-gray-800">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-24 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-teal-500 to-green-600 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Choose the plan that's right for your learning journey. Unlock your potential with full access to our platform.
            </p>
          </div>
        </section>

        {/* Pricing Cards Section */}
        <section className="pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Pay per Course Card */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200 p-8 h-full flex flex-col">
                        <div className="flex-grow">
                            <h3 className="text-2xl font-bold text-gray-900">Pay Per Course</h3>
                            <p className="text-gray-600 mt-2">Perfect for focusing on a single skill or technology.</p>
                            <p className="text-4xl font-bold text-gray-900 mt-6">From $49.99</p>
                            <p className="text-gray-500">per course</p>
                            <ul className="space-y-4 mt-8 text-gray-700">
                                <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" /><span>Lifetime access to course materials.</span></li>
                                <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" /><span>Certificate of completion.</span></li>
                                <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" /><span>Access to course-specific community channels.</span></li>
                            </ul>
                        </div>
                        <a href="/hub/product" className="mt-8 block w-full text-center px-6 py-3 rounded-full font-semibold text-md border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-colors">
                            Browse Courses
                        </a>
                    </div>

                    {/* Membership Plan Card (Highlighted) */}
                    <div className="bg-white rounded-2xl border-4 border-green-500 p-8 shadow-2xl relative transform lg:scale-105">
                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                            <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                                <Star size={16} /> Best Value
                            </div>
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-2xl font-bold text-gray-900">KnowGrow Pro</h3>
                            <p className="text-green-600 font-semibold mt-2">The ultimate plan for continuous learning and growth.</p>
                            <p className="text-4xl font-bold text-gray-900 mt-6">$29.99<span className="text-xl font-normal text-gray-500">/month</span></p>
                            <p className="text-gray-500">Billed annually, or $39 billed monthly</p>
                             <ul className="space-y-4 mt-8 text-gray-700">
                                <li className="flex items-start font-semibold"><Check className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" /><span>Access ALL courses, tools, and source code.</span></li>
                                <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" /><span>Full access to our global developer community.</span></li>
                                <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" /><span>Exclusive career support and job board access.</span></li>
                                <li className="flex items-start"><Check className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" /><span>Downloadable resources and project files.</span></li>
                            </ul>
                        </div>
                        <a href="/hub/contact" className="mt-8 block w-full text-center px-6 py-3 rounded-full font-semibold text-md bg-gradient-to-r from-green-500 to-teal-500 text-white hover:scale-105 transition-transform shadow-lg">
                            Start Pro Membership
                        </a>
                    </div>
                </div>
            </div>
        </section>

        {/* Student Discount Section */}
        <section className="py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-12 text-white text-center shadow-xl">
                    <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-6">
                        <Award size={32} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold">Are you a Student?</h2>
                    <p className="text-5xl md:text-7xl font-bold my-4">Get 80% OFF</p>
                    <p className="text-lg max-w-2xl mx-auto mb-8">
                        We believe in empowering the next generation of builders and creators. Verify your student status to get an 80% discount on all our courses and membership plans.
                    </p>
                    <a href="/hub/student-verification" className="inline-block px-8 py-3 rounded-full font-semibold bg-white text-green-600 hover:bg-gray-100 transition-colors shadow-md">
                        Verify and Claim Discount
                    </a>
                </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              <details className="p-4 bg-white rounded-lg shadow-sm cursor-pointer group">
                  <summary className="flex justify-between items-center font-semibold text-gray-800">
                    Can I switch plans later?
                    <ChevronRight className="w-5 h-5 text-green-600 transform group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="mt-2 text-gray-600 leading-relaxed">
                    Yes, you can upgrade from a per-course purchase to a Pro membership at any time. We'll even credit the cost of your recent course purchases towards your first year of membership.
                  </p>
              </details>
              <details className="p-4 bg-white rounded-lg shadow-sm cursor-pointer group">
                  <summary className="flex justify-between items-center font-semibold text-gray-800">
                    What happens if I cancel my Pro membership?
                    <ChevronRight className="w-5 h-5 text-green-600 transform group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="mt-2 text-gray-600 leading-relaxed">
                    If you cancel your Pro membership, you will retain access to all features until the end of your billing period. After that, you will lose access to Pro courses and tools but will still have an account on our platform.
                  </p>
              </details>
               <details className="p-4 bg-white rounded-lg shadow-sm cursor-pointer group">
                  <summary className="flex justify-between items-center font-semibold text-gray-800">
                    Is there a free trial for the Pro membership?
                    <ChevronRight className="w-5 h-5 text-green-600 transform group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="mt-2 text-gray-600 leading-relaxed">
                    Absolutely! All new users can enjoy a 7-day free trial of KnowGrow Pro to explore all our courses and features. No credit card is required to start the trial.
                  </p>
              </details>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

// A simple ChevronRight icon component to avoid dependency errors if lucide-react is not fully configured
const ChevronRight = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m9 18 6-6-6-6"/>
    </svg>
);
