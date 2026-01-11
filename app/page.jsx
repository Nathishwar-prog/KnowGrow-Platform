"use client";

import React, { useState, useEffect, useContext } from "react";
import { UserButton, useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import dynamic from "next/dynamic";
import axios from "axios";
import { Menu, X, ChevronDown, Loader2 } from "lucide-react";
import { UserDetailContext } from "../context/UserDetailContext";
import HeroSection from "./_components/landing/HeroSection";

// Dynamic imports for performance
const FeaturesSection = dynamic(() => import("./_components/landing/FeaturesSection"), {
  loading: () => <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-green-500" /></div>
});
const TestimonialsSection = dynamic(() => import("./_components/landing/TestimonialsSection"));
const FAQSection = dynamic(() => import("./_components/landing/FAQSection"));
const ContinueLearningSection = dynamic(() => import("./_components/landing/ContinueLearningSection"));
const SearchResultsSection = dynamic(() => import("./_components/landing/SearchResultsSection"));

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingEnrolledCourses, setLoadingEnrolledCourses] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { userDetail } = useContext(UserDetailContext);

  // Logout function
  const logout = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Fetch enrolled courses for authenticated users
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (user && isLoaded) {
        try {
          setLoadingEnrolledCourses(true);
          const response = await axios.get('/api/enroll-course');
          setEnrolledCourses(response.data);
        } catch (error) {
          console.error("Error fetching enrolled courses:", error);
        } finally {
          setLoadingEnrolledCourses(false);
        }
      }
    };

    fetchEnrolledCourses();
  }, [user, isLoaded]);

  // Enhanced similarity function for text matching
  const calculateSimilarity = (str1, str2) => {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    if (str1.includes(str2) || str2.includes(str1)) {
      return 0.9;
    }

    const words1 = str1.split(/\s+/).filter(word => word.length > 2);
    const words2 = str2.split(/\s+/).filter(word => word.length > 2);

    if (words1.length === 0 || words2.length === 0) return 0;

    let matches = 0;
    words1.forEach(word1 => {
      if (words2.some(word2 => word1.includes(word2) || word2.includes(word1))) {
        matches++;
      }
    });

    return matches / Math.max(words1.length, words2.length);
  };

  // Handle search functionality
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchQuery("");
      return;
    }

    try {
      setIsSearching(true);

      // Small delay to ensure UI updates properly
      await new Promise(resolve => setTimeout(resolve, 100));

      // Search for courses using the enhanced API
      const response = await axios.get(`/api/courses?courseId=0&search=${encodeURIComponent(query)}`);

      setSearchResults(response.data);

      setTimeout(() => {
        const element = document.getElementById('search-results');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error("Error searching courses:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 overflow-x-hidden font-sans">
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .gradient-text {
            background: linear-gradient(90deg, #10B981, #06B6D4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}
      </style>
      {/* Navigation */}
      <nav className="fixed top-0  w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/Logo.png" alt="KnowGrow Logo" className="h-10 w-auto" />
              <span className="ml-3 text-2xl font-bold text-gray-900">KnowGrow</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/hub/product" className="text-gray-700 hover:text-gray-900">Product</Link>
            <Link href="/hub/pricing" className="text-gray-700 hover:text-gray-900">Pricing</Link>
            <Link href="/hub/about" className="text-gray-700 hover:text-gray-900">About</Link>
            <Link href="/hub/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center text-gray-700 hover:text-gray-900">
                  <span className="mr-2">{userDetail?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link href="/workspace" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dashboard</Link>
                    <Link href="/workspace/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</Link>
                    <button onClick={logout} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full hover:from-green-600 hover:to-teal-600 transition-all duration-300">Login</Link>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-gray-900">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 py-3 space-y-1">
              <Link href="/hub/product" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Product</Link>
              <Link href="/hub/pricing" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Pricing</Link>
              <Link href="/hub/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">About</Link>
              <Link href="/hub/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Contact</Link>
            </div>
            {user ? (
              <div className="px-4 py-3 space-y-1">
                <Link href="/workspace" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dashboard</Link>
                <Link href="/workspace/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</Link>
                <button onClick={logout} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
              </div>
            ) : (
              <Link href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Login</Link>
            )}
          </div>
        )}
      </nav>

      {/* Continue Learning Section */}
      {user && isLoaded && enrolledCourses.length > 0 && (
        <ContinueLearningSection enrolledCourses={enrolledCourses} />
      )}

      {/* Hero Section */}
      <HeroSection
        onSearch={handleSearch}
        onQueryChange={setSearchQuery}
        setShowDemoModal={setShowDemoModal}
      />

      {/* Search Results Section */}
      {searchQuery && (isSearching || searchResults.length > 0 || (searchResults.length === 0 && !isSearching)) && (
        <SearchResultsSection
          searchQuery={searchQuery}
          isSearching={isSearching}
          searchResults={searchResults}
          userDetail={userDetail}
        />
      )}

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
            <button onClick={() => setShowDemoModal(false)} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">See KnowGrow In Action</h2>
            <p className="text-gray-600 mb-8">Experience the personalized learning journey with our demo course.</p>
            <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" className="w-full h-96 rounded-lg" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="flex items-center">
                <img src="/Logo.png" alt="KnowGrow Logo" className="h-10 w-auto" />
                <span className="ml-3 text-2xl font-bold text-gray-100">KnowGrow</span>
              </Link>
              <p className="mt-4 text-gray-400">Transform your learning journey with KnowGrow.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/hub/product" className="text-gray-400 hover:text-gray-100">Product</Link></li>
                <li><Link href="/hub/pricing" className="text-gray-400 hover:text-gray-100">Pricing</Link></li>
                <li><Link href="/hub/about" className="text-gray-400 hover:text-gray-100">About</Link></li>
                <li><Link href="/hub/contact" className="text-gray-400 hover:text-gray-100">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Follow Us</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-gray-100">Facebook</a></li>
                <li><a href="#" className="text-gray-400 hover:text-gray-100">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-gray-100">Instagram</a></li>
                <li><a href="#" className="text-gray-400 hover:text-gray-100">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-400">© 2023 KnowGrow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
