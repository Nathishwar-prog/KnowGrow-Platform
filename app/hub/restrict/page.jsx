import React from 'react';
import { Lock, ArrowRight, Star } from 'lucide-react';

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
        <a href="/" className="px-6 py-2 rounded-full font-semibold text-md bg-gradient-to-r from-green-500 to-teal-500 text-white hover:scale-105 transition-transform">
          Back to Home
        </a>
      </div>
    </div>
  </header>
);

// Reusable Footer component
const Footer = () => (
    <footer className="py-12 border-t border-green-500/20 bg-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} KnowGrow. All rights reserved. Growing knowledge through artificial intelligence.</p>
        </div>
    </footer>
);

// Animated Lock Graphic
const LockAnimation = () => (
    <div className="relative w-48 h-48 mx-auto">
        <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse"></div>
        <div className="absolute inset-4 bg-green-200 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-24 h-24 text-green-600" />
        </div>
    </div>
);


// Main component for the "No Access" page.
export default function NoAccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 text-gray-800 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <LockAnimation />
            <h1 className="text-4xl md:text-5xl font-bold mt-8 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Access This Feature with Pro
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              It looks like you've found an exclusive feature! This service is available to our <strong>KnowGrow Pro</strong> members. Upgrade your plan to unlock this and many other premium tools.
            </p>
            <a href="/hub/pricing" className="inline-block px-10 py-4 rounded-full font-semibold text-xl bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg hover:shadow-green-500/25 hover:scale-105 transition-all">
                <span className="flex items-center gap-3 mx-auto justify-center">
                    <Star size={20} /> Upgrade Your Plan <ArrowRight />
                </span>
            </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
