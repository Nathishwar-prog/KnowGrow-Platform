"use client";

import React, { useState } from 'react';
import { HardHat, Bell, CheckCircle } from 'lucide-react';

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

// Animated Graphic Component
const ConstructionAnimation = () => (
    <div className="relative w-64 h-64 mx-auto">
        <style>{`
            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes rotate-reverse {
                from { transform: rotate(360deg); }
                to { transform: rotate(0deg); }
            }
            .gear-1 { animation: rotate 10s linear infinite; transform-origin: center; }
            .gear-2 { animation: rotate-reverse 15s linear infinite; transform-origin: center; }
            .gear-3 { animation: rotate 20s linear infinite; transform-origin: center; }
        `}</style>
        <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Gear 1 */}
            <path className="gear-1" fill="#a7f3d0" d="M100 85 a15 15 0 1 0 0.0001 0 M100 50 l5 15 h-10 l5 -15 M139 61 l-8 13 v-16 l8 3 M139 139 l-13 8 h16 l-3 -8 M100 150 l-5 -15 h10 l-5 15 M61 139 l8 -13 v16 l-8 -3 M61 61 l13 -8 h-16 l3 8" />
            {/* Gear 2 */}
            <path className="gear-2" fill="#6ee7b7" d="M50 120 a10 10 0 1 0 0.0001 0 M50 100 l4 10 h-8 l4 -10 M71 110 l-4 9 v-11 l4 2 M71 130 l-9 4 h11 l-2 -4 M50 140 l-4 -10 h8 l-4 10 M29 130 l4 -9 v11 l-4 -2 M29 110 l9 -4 h-11 l2 4" />
             {/* Gear 3 */}
            <path className="gear-3" fill="#34d399" d="M150 70 a8 8 0 1 0 0.0001 0 M150 55 l3 7.5 h-6 l3 -7.5 M166 63 l-3 6.5 v-8 l3 1.5 M166 77 l-6.5 3 h8 l-1.5 -3 M150 85 l-3 -7.5 h6 l-3 7.5 M134 77 l3 -6.5 v8 l-3 -1.5 M134 63 l6.5 -3 h-8 l1.5 3" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
            <HardHat className="w-20 h-20 text-green-600" />
        </div>
    </div>
);


// Main component for the "Coming Soon" page.
export default function ComingSoonPage() {
  const [notified, setNotified] = useState(false);

  const handleNotifyClick = () => {
    setNotified(true);
    // In a real app, you might also send an API request here
    // to add the user to a notification list.
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 text-gray-800 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <ConstructionAnimation />
            <h1 className="text-4xl md:text-5xl font-bold mt-8 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Something Awesome is on the Way!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Our team is currently developing this exciting new feature. We're working hard to bring it to you and will notify you as soon as it's ready!
            </p>
            
            <div className="h-16 flex items-center justify-center">
                {!notified ? (
                  <button 
                    onClick={handleNotifyClick}
                    className="inline-block px-8 py-3 rounded-full font-semibold bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all"
                  >
                      <span className="flex items-center gap-2">
                          <Bell size={20} /> Notify Me When It's Ready
                      </span>
                  </button>
                ) : (
                  <div className="text-center p-4 rounded-lg bg-green-100 text-green-800 animate-fade-in">
                    <p className="font-semibold flex items-center justify-center gap-2">
                      <CheckCircle size={20} /> You're on the list!
                    </p>
                    <p className="text-sm">We will contact you after the product is updated.</p>
                  </div>
                )}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
