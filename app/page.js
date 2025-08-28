"use client";

import React, { useState, useEffect } from "react";
// import { useTheme } from "./security/ThemeProvider/page";
import {
  ChevronDown,
  BookOpen,
  Users,
  Zap,
  Star,
  Play,
  ArrowRight,
  Menu,
  X,
  CheckCircle,
  Brain,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

// Reusable redirect button
function RedirectButton({ label, href, variant = "primary", icon }) {
  const handleClick = () => {
    window.location.href = href;
  };

  const baseClasses =
    "px-8 py-4 rounded-full font-semibold text-lg flex items-center space-x-2 group transition-all duration-300 cursor-pointer";
  const variants = {
    primary:
      "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg hover:shadow-green-500/25 hover:scale-105",
    secondary: "border-2 border-green-400 hover:bg-green-400/10 text-green-600",
  };

  const icons = {
    arrow: (
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
    ),
    play: (
      <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
    ),
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      <span>{label}</span>
      {icon && icons[icon]}
    </button>
  );
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [dots, setDots] = useState([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document
      .querySelectorAll("section[id]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const randomDots = [...Array(20)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
    }));
    setDots(randomDots);
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Personalization",
      description:
        "Adaptive learning paths that evolve with your progress and learning style.",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Interactive Content",
      description:
        "Engaging multimedia lessons with hands-on exercises and real-time feedback.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaborative Learning",
      description:
        "Connect with peers, join study groups, and learn together in virtual classrooms.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast Progress",
      description:
        "Accelerate your learning with AI-optimized study schedules and smart reminders.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "University Student",
      content:
        "KnowGrow revolutionized how I study. The AI recommendations are spot-on!",
      rating: 5,
    },
    {
      name: "Marcus Chen",
      role: "Lifelong Learner",
      content:
        "Finally, a learning platform that adapts to my busy schedule. Absolutely brilliant!",
      rating: 5,
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Educator",
      content:
        "The interactive content and personalized approach make complex topics accessible for everyone.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 text-gray-800 overflow-x-hidden">
      {/* Animated background dots */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {dots.map((dot, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-300 rounded-full opacity-30 animate-pulse"
            style={dot}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrollY > 50
            ? "bg-white/95 backdrop-blur-lg border-b border-green-500/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                KnowGrow
              </span>
            </div>

            <div className="hidden md:flex space-x-8 items-center">
              {["Features", "Pricing", "About", "Contact","ExamCenter"].map((item) => (
                <a
                  key={item}
                  href={`/hub/${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-green-600 transition-colors duration-300 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
              

          



              <UserButton afterSignOutUrl="/" />
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-green-600/10 hover:bg-green-600/20 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-green-700" />
              ) : (
                <Menu className="w-6 h-6 text-green-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-64 bg-white/95 backdrop-blur-lg" : "max-h-0"
          }`}
        >
          <div className="px-4 py-4 space-y-4">
            {["Features", "Pricing", "About", "Contact","ExamCenter"].map((item) => (
              <a
                key={item}
                href={`/hub/${item.toLowerCase()}`}
                className="block text-gray-600 hover:text-green-600 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-xl text-green-600 mb-4 font-semibold">
            Welcome to KnowGrow
          </h2>

          <div
            className={`transition-all duration-1000 transform ${
              isVisible.hero
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 via-teal-500 to-green-600 bg-clip-text text-transparent">
              Grow Your Knowledge with AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Adaptive AI-powered learning paths tailored to your progress and
              style.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <RedirectButton
                label="Start Learning Now"
                href="/hub/product"
                variant="primary"
                icon="arrow"
              />
              <RedirectButton
                label="Watch Demo"
                href="/hub/demo"
                variant="secondary"
                icon="play"
              />
            </div>

            <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Free 7-day trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-green-500" />
        </div>

        {/* Floating background elements */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-green-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-teal-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-1000 transform ${
              isVisible.features
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our AI-powered platform helps you grow and learn
              effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 bg-white/50 backdrop-blur-lg rounded-2xl border border-green-500/20 hover:border-green-400/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10 ${
                  isVisible.features
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl flex items-center justify-center mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-green-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-1000 transform ${
              isVisible.testimonials
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              What Our Learners Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of learners who've transformed their education
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`p-8 bg-white/50 backdrop-blur-lg rounded-2xl border border-green-500/20 hover:border-green-400/50 transition-all duration-500 transform hover:scale-105 ${
                  isVisible.testimonials
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-800">
                    {testimonial.name}
                  </p>
                  <p className="text-green-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 relative">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-1000 transform ${
              isVisible.cta
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Ready to Grow Your Knowledge?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join over 100,000 students who are already learning smarter, not
              harder with KnowGrow.
            </p>
            <RedirectButton
              label="Get Started Free"
              href="/hub/product"
              variant="primary"
              icon="arrow"
            />
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-green-500/20 bg-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                KnowGrow
              </span>
            </div>

            <div className="flex space-x-6 text-gray-500">
              <Link
                href="/security/privacy"
                className="hover:text-green-600 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/security/terms-conditions"
                className="hover:text-green-600 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/security/support"
                className="hover:text-green-600 transition-colors"
              >
                Support
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-green-500/20 text-center text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} KnowGrow. All rights reserved.
              Growing knowledge through artificial intelligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
