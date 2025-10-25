"use client";

import React, { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

import {
  ChevronDown,
  BookOpen,
  Users,
  Star,
  Play,
  ArrowRight,
  Menu,
  X,
  CheckCircle,
  Brain,
  GraduationCap,
  Briefcase,
  Trophy,
  Sparkles
} from "lucide-react";


// A placeholder for the Clerk UserButton to avoid errors


// Reusable redirect button from your code
function RedirectButton({ label, href, variant = "primary", icon, className = "", onClick }) {
  const handleClick = () => {
    if(onClick) {
        onClick();
    } else {
        window.location.href = href;
    }
  };

  const baseClasses =
    "px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center space-x-2 group transition-all duration-300 cursor-pointer";
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
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      <span>{label}</span>
      {icon && icons[icon]}
    </button>
  );
}


// Animated counter component
function AnimatedCounter({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isVisible]);

  React.useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const endValue = parseInt(end);

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * endValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// Demo Modal Component
const DemoModal = ({ show, onClose }) => {
  const [learningStyle, setLearningStyle] = React.useState('visual');

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in-fast">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl relative transform transition-all duration-300 animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
          <X className="w-7 h-7" />
        </button>
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">See KnowGrow in Action</h2>
        <p className="text-center text-gray-600 mb-6">Experience how our AI adapts to <span className="gradient-text font-semibold">your</span> learning style.</p>
        
        <div className="bg-gray-100 p-1 rounded-lg flex justify-center space-x-2 mb-6">
          {['visual', 'reader', 'hands-on'].map(style => (
            <button key={style} onClick={() => setLearningStyle(style)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 w-full ${learningStyle === style ? 'bg-green-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>

        <div className="relative aspect-video rounded-lg bg-gray-50 overflow-hidden p-6 border flex items-center justify-center">
            {learningStyle === 'visual' && (
                <div className="text-center text-blue-800 animate-fade-in w-full">
                    <h3 className="text-xl font-bold mb-2">For Visual Learners</h3>
                    <p className="mb-4">We bring concepts to life with animated diagrams and interactive charts.</p>
                    <div className="w-full h-32 bg-blue-100 rounded-lg flex items-center justify-center p-4 border border-blue-200">
                        {/* Simple animated bar chart */}
                        <div className="flex items-end h-full space-x-4">
                            <div className="w-8 bg-blue-500 rounded-t-md animate-bar-grow" style={{height: '60%', animationDelay: '0s'}}></div>
                            <div className="w-8 bg-blue-500 rounded-t-md animate-bar-grow" style={{height: '90%', animationDelay: '0.2s'}}></div>
                            <div className="w-8 bg-blue-500 rounded-t-md animate-bar-grow" style={{height: '40%', animationDelay: '0.4s'}}></div>
                            <div className="w-8 bg-blue-500 rounded-t-md animate-bar-grow" style={{height: '75%', animationDelay: '0.6s'}}></div>
                        </div>
                    </div>
                </div>
            )}
            {learningStyle === 'reader' && (
                <div className="text-center text-purple-800 animate-fade-in w-full">
                    <h3 className="text-xl font-bold mb-2">For Readers</h3>
                    <p className="mb-4">Get key summaries and highlighted text to focus on important details.</p>
                     <div className="w-full h-32 bg-purple-100 rounded-lg p-4 border border-purple-200 text-left text-sm text-gray-800 overflow-hidden">
                        <p className="animate-text-reveal">Central to our study is the theory of adaptive learning, which posits that optimal educational outcomes are achieved when...</p>
                        <p className="bg-yellow-200/50 my-1 animate-text-reveal" style={{animationDelay: '1s'}}><span className="font-bold">the material dynamically adjusts</span> to the learner's pace and comprehension level.</p>
                        <p className="animate-text-reveal" style={{animationDelay: '2s'}}>This contrasts with traditional static models...</p>
                    </div>
                </div>
            )}
            {learningStyle === 'hands-on' && (
                <div className="text-center text-yellow-800 animate-fade-in w-full">
                    <h3 className="text-xl font-bold mb-2">For Hands-on Learners</h3>
                    <p className="mb-4">Tackle live coding challenges and practical exercises to build real skills.</p>
                    <div className="w-full h-32 bg-gray-800 rounded-lg p-4 border border-gray-600 font-mono text-left text-sm text-green-400 overflow-hidden">
                        <p className="animate-typing">
                            <span className="text-blue-400">function</span> <span className="text-yellow-300">calculate</span>(a, b) &#123;
                        </p>
                        <p className="pl-4 animate-typing" style={{animationDelay: '1.5s'}}>
                            <span className="text-pink-400">return</span> a + b;
                        </p>
                        <p className="animate-typing" style={{animationDelay: '2.5s'}}>&#125;</p>
                    </div>
                </div>
            )}
        </div>
        <div className="mt-6 text-center">
            <RedirectButton label="Start Your Free Trial" href="/hub/product" variant="primary" icon="arrow"/>
        </div>
      </div>
    </div>
  );
};


// Main Landing Page Component
export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState({});
  const [openFaq, setOpenFaq] = React.useState(null);
  const [showDemoModal, setShowDemoModal] = React.useState(false);

  React.useEffect(() => {
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
  
  const testimonials = [
    { name: "Priya Sharma", role: "Computer Science Student, Mumbai", content: "KnowGrow saved my final semester. I was struggling with data structures, but the AI adapted the explanations to my level. Went from failing to scoring 89%!", rating: 5, achievement: "89% Final Score" },
    { name: "Rahul Patel", role: "Working Professional, Bangalore", content: "As a working professional, I needed flexible learning. KnowGrow's bite-sized lessons fit perfectly into my schedule. Got promoted within 6 months!", rating: 5, achievement: "Promoted in 6 months" },
    { name: "Ananya Gupta", role: "Self-learner, Delhi", content: "Finally, a platform that understands I'm a visual learner! The adaptive content with diagrams and interactive examples changed everything for me.", rating: 5, achievement: "3x Faster Learning" },
    { name: "Vikram Singh", role: "Engineering Student, Pune", content: "From 'impossible' to 'I got this!' - KnowGrow transformed my approach to learning. The gamification keeps me hooked every single day.", rating: 5, achievement: "100-day streak" },
    { name: "Sneha Reddy", role: "Career Switcher, Hyderabad", content: "Switching to tech seemed impossible until KnowGrow. The personalized roadmap made complex topics digestible. Now I'm a frontend developer!", rating: 5, achievement: "Career Switched" }
  ];

  const duplicatedTestimonials = [...testimonials, ...testimonials];

  const howItWorks = [
    { step: "1", title: "Tell us about yourself", description: "Share your goals, current level, and learning style preferences", emoji: "💬", color: "from-green-400 to-green-600" },
    { step: "2", title: "AI creates your path", description: "Our AI analyzes your profile and builds a personalized learning roadmap", emoji: "🧠", color: "from-blue-400 to-blue-600" },
    { step: "3", title: "Learn at your pace", description: "Study with adaptive content that evolves based on your progress", emoji: "🚀", color: "from-purple-400 to-purple-600" },
    { step: "4", title: "Track & achieve", description: "Monitor your growth with detailed analytics and celebrate milestones", emoji: "🏆", color: "from-yellow-400 to-yellow-600" }
  ];

  const stats = [
    { value: "15000", label: "Active Learners", suffix: "+" },
    { value: "95", label: "Success Rate", suffix: "%" },
    { value: "4", label: "Average Rating", suffix: ".9" },
    { value: "500", label: "Courses Available", suffix: "+" },
  ];
  
  const personas = [
      { icon: <GraduationCap className="w-8 h-8"/>, title: "The University Student", description: "Ace your exams with AI-powered study plans and last-minute revision modules that focus on your weak spots."},
      { icon: <Briefcase className="w-8 h-8"/>, title: "The Working Professional", description: "Upskill for a promotion with bite-sized, practical lessons that fit perfectly into your busy schedule."},
      { icon: <BookOpen className="w-8 h-8"/>, title: "The Lifelong Learner", description: "Explore new passions with a personalized curriculum that adapts to your curiosity and learning pace."}
  ];
  
  const faqs = [
      { q: "What subjects do you offer?", a: "We offer a wide range of subjects, from STEM fields like Data Science and Programming to humanities and business courses. Our AI is constantly adding and optimizing new learning paths." },
      { q: "Is it really free to start?", a: "Absolutely! Your 14-day free trial gives you full access to all features, no credit card required. You can explore everything KnowGrow has to offer and see the difference for yourself." },
      { q: "Can I use KnowGrow on my phone?", a: "Yes! KnowGrow is fully responsive and works beautifully on any device. You can learn on your desktop, tablet, or mobile phone, with your progress synced everywhere." },
      { q: "How does the AI personalization work?", a: "Our AI analyzes your initial assessment, learning speed, and quiz results to constantly adapt your study material. If you're a visual learner, you'll get more diagrams. If you're struggling with a topic, you'll get simpler explanations." }
  ];
  
  const methodPoints = [
      { emoji: "🎯", title: "Personalized Pace", description: "No more feeling rushed or left behind. Learn at a speed that's right for you." },
      { emoji: "🎮", title: "Gamified Milestones", description: "Stay motivated by earning badges and celebrating your progress with fun challenges."},
      { emoji: "🧘", title: "Stress-Free Environment", description: "Our platform is designed to reduce anxiety with guided breaks and positive reinforcement."}
  ];
  
  const subjects = [
      { emoji: "📊", title: "Data Science", description: "Master Python, SQL, and Machine Learning." },
      { emoji: "💻", title: "Web Development", description: "Build modern websites with React and Node.js." },
      { emoji: "📱", title: "Mobile Development", description: "Create stunning apps for iOS and Android." },
      { emoji: "🤖", title: "Machine Learning", description: "Dive deep into neural networks and AI algorithms." },
      { emoji: "📈", title: "Business & Finance", description: "Understand markets, investing, and corporate strategy." },
      { emoji: "🎨", title: "Creative Arts", description: "Unleash your creativity with courses in design and digital art." }
  ];

  const additionalFeatures = [
    { emoji: "⚡", title: "Instant Doubt Resolution", description: "Get AI-powered answers to your questions 24/7" },
    { emoji: "👥", title: "Study Groups", description: "Connect with peers on similar learning journeys" },
    { emoji: "🏅", title: "Skill Certificates", description: "Earn verified certificates for completed courses" },
    { emoji: "🌍", title: "Multi-language Support", description: "Learn in Hindi, English, and 10+ regional languages" },
    { emoji: "⏰", title: "Flexible Scheduling", description: "Learn anytime with offline mode support" },
    { emoji: "❤️", title: "Mental Wellness", description: "Built-in breaks and stress management tips" }
  ];


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 overflow-x-hidden font-sans">
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes bounce-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        .animate-bounce-float {
            animation: bounce-float 6s ease-in-out infinite;
        }

        .testimonial-scroller { animation: scroll 60s linear infinite; }
        .testimonial-scroller:hover { animation-play-state: paused; }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .gradient-text { background: linear-gradient(135deg, #10b981 0%, #059669 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .draw-line { animation: draw 2s ease-out forwards; }
        @keyframes draw { from { width: 0; } to { width: 100%; } }
        .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
        .animate-fade-in-fast { animation: fadeIn 0.3s ease-in-out; }
        .animate-slide-up { animation: slideUp 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-bar-grow { animation: barGrow 0.5s ease-out forwards; transform-origin: bottom; }
        @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .animate-text-reveal { opacity: 0; animation: fadeIn 0.5s ease-out forwards; }
        .animate-typing { overflow: hidden; white-space: nowrap; animation: typing 1.5s steps(40, end), blink-caret .75s step-end infinite; border-right: .15em solid orange; }
        @keyframes typing { from { width: 0 } to { width: 100% } }
        @keyframes blink-caret { from, to { border-color: transparent } 50% { border-color: orange; } }
        @keyframes pulse-soft {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes rotate-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
      
      <DemoModal show={showDemoModal} onClose={() => setShowDemoModal(false)} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <a href="#" className="flex items-center space-x-2">
             
              <span className="text-2xl font-bold text-gray-900">KnowGrow</span>
            </a>
            <div className="hidden md:flex space-x-8 items-center">
              {["Features", "How It Works", "Subjects", "Who It's For", "Testimonials", "FAQ"].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-600 hover:text-gray-900 transition-colors duration-300">
                  {item}
                </a>
              ))}
            </div>
            <div className="hidden md:flex items-center space-x-4">
               <UserButton />
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        <div className={`md:hidden transition-all duration-300 overflow-hidden bg-white ${isMenuOpen ? "max-h-96 border-t border-gray-200" : "max-h-0"}`}>
          <div className="px-4 py-4 space-y-4 flex flex-col items-start">
            {["Features", "How It Works", "Subjects", "Who It's For", "Testimonials", "FAQ"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="block text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>
                {item}
              </a>
            ))}
            <div className="border-t w-full pt-4 mt-2 flex flex-col space-y-3">
               <UserButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 relative bg-white overflow-hidden">
        <div className="absolute -top-1/2 left-0 w-full h-full opacity-30" style={{background: 'radial-gradient(circle, rgba(209,250,229,0.8) 0%, rgba(255,255,255,0) 60%)'}}></div>
        <div className="absolute top-1/4 -right-1/2 w-full h-full opacity-20" style={{background: 'radial-gradient(circle, rgba(219,234,254,0.7) 0%, rgba(255,255,255,0) 60%)'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className={`transition-all duration-1000 transform ${isVisible.hero ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <div className="animate-float" style={{animationDelay: '0.5s'}}>
                <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
                  Think it's <span className="text-red-500 font-bold line-through">impossible?</span>
                  <br/>
                  <span className="gradient-text">It's possible with KnowGrow.</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Transform your "I can't" into "I did it!" with AI that adapts to you. Every lesson, personalized. Every doubt, resolved. Every dream, achievable.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-start mb-8">
                  <RedirectButton label="Start Your Journey Free" href="/hub/product" variant="primary" icon="arrow" className="text-lg px-8 py-4" />
                  <RedirectButton label="See It In Action" variant="secondary" icon="play" className="text-lg px-8 py-4" onClick={() => setShowDemoModal(true)} />
                </div>
                 <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    <span className="flex items-center"><CheckCircle className="w-5 h-5 text-green-600 mr-2"/>No credit card needed</span>
                    <span className="flex items-center"><CheckCircle className="w-5 h-5 text-green-600 mr-2"/>14-day free trial</span>
                     <span className="flex items-center"><CheckCircle className="w-5 h-5 text-green-600 mr-2"/>Cancel anytime</span>
                </div>
              </div>
            </div>

            <div className={`relative transition-all duration-1000 delay-200 transform ${isVisible.hero ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
                <div className="animate-bounce-float">
                    <button onClick={() => setShowDemoModal(true)} className="relative aspect-video rounded-2xl shadow-2xl overflow-hidden bg-white p-1 group w-full border hover:border-green-400 transition-all duration-300">
                        <div className="bg-white rounded-xl h-full w-full p-8 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <Play className="w-10 h-10 text-white ml-1" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Watch KnowGrow in Action</h3>
                            <p className="text-gray-600">See how AI personalizes your learning journey</p>
                          </div>
                        </div>
                    </button>
                </div>
                
                <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 animate-bounce-float" style={{animationDelay: '1.5s'}}>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-semibold">95% Success Rate</span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 animate-bounce-float" style={{animationDelay: '2.5s'}}>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-semibold">Join 15K+ Learners</span>
                  </div>
                </div>
            </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible['how-it-works'] ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <span className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full mb-4">
              <span className="text-lg">💡</span>
              <span>Simple 4-Step Process</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              How <span className="gradient-text">KnowGrow Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From confusion to confidence in just 4 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className={`hidden md:block absolute top-1/3 left-0 h-1 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 ${isVisible['how-it-works'] ? "draw-line" : ""}`}></div>
            {howItWorks.map((item, index) => (
              <div key={index} className={`relative transition-all duration-700 transform ${isVisible['how-it-works'] ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`} style={{ transitionDelay: `${index * 150}ms` }}>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 relative z-10">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto`}>
                    {item.step}
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-3">{item.emoji}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* The KnowGrow Method Section */}
      <section id="method" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className={`transition-all duration-1000 transform ${isVisible.method ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                        The <span className="gradient-text">KnowGrow Method</span>
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        We believe learning should be empowering, not overwhelming. Our method is built on three core principles to ensure you not only learn, but thrive.
                    </p>
                    <div className="space-y-6">
                        {methodPoints.map((point, index) => (
                            <div key={index} className="flex items-start space-x-4">
                                <div className="text-3xl mt-1">{point.emoji}</div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{point.title}</h3>
                                    <p className="text-gray-600">{point.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`relative w-full h-80 flex items-center justify-center transition-all duration-1000 delay-200 transform ${isVisible.method ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
                    <div className="relative w-80 h-80">
                        <div className="absolute inset-10 bg-gradient-to-br from-green-300 to-blue-300 rounded-full" style={{ animation: 'pulse-soft 6s ease-in-out infinite' }}></div>
                        <div className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-full" style={{ animation: 'rotate-slow 30s linear infinite' }}></div>
                        <div className="absolute inset-5 border border-dashed border-gray-300 rounded-full" style={{ animation: 'rotate-slow 25s linear infinite reverse' }}></div>
                        
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center animate-bounce-float" style={{ animationDuration: '8s' }}>
                            <span className="text-2xl">🎯</span>
                        </div>
                        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center animate-bounce-float" style={{ animationDuration: '7s', animationDelay: '2s' }}>
                            <span className="text-2xl">🎮</span>
                        </div>
                        <div className="absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center animate-bounce-float" style={{ animationDuration: '9s', animationDelay: '1s' }}>
                            <span className="text-2xl">🧘</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Explore Subjects Section */}
      <section id="subjects" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible.subjects ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                    Explore Our <span className="gradient-text">Most Popular Subjects</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Find your passion or get ahead in your career with our expert-designed courses.
                </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {subjects.map((subject, index) => (
                    <div key={index} className={`bg-white rounded-xl p-8 text-center border border-gray-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:border-green-400 ${isVisible.subjects ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} style={{ transitionDelay: `${index * 100}ms`}}>
                        <div className="text-5xl mb-4">{subject.emoji}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{subject.title}</h3>
                        <p className="text-gray-600">{subject.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
      
      {/* "Who Is This For?" Section */}
      <section id="who-it's-for" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible["who-it's-for"] ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                      Built for <span className="gradient-text">Every Kind of Learner</span>
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                      No matter where you are in your journey, KnowGrow adapts to you.
                  </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                  {personas.map((persona, index) => (
                      <div key={index} className={`bg-gray-50/70 rounded-xl p-8 border border-gray-200 transition-all duration-500 transform hover:-translate-y-2 ${isVisible["who-it's-for"] ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} style={{ transitionDelay: `${index * 150}ms` }}>
                          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg flex items-center justify-center mb-6">
                              {persona.icon}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">{persona.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{persona.description}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible.testimonials ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              <span className="gradient-text">Success Stories</span> from our Students
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real results from real learners across India
            </p>
          </div>
        </div>
        <div className="relative w-full overflow-hidden group">
          <div className="testimonial-scroller flex space-x-8 p-4 w-max">
            {duplicatedTestimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 w-[400px] flex-shrink-0 transition-transform duration-300 group-hover:scale-[1.02]">
                  <div className="flex mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />)}</div>
                  <blockquote className="text-lg font-medium text-gray-800 leading-relaxed mb-6">"{testimonial.content}"</blockquote>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                  <div className="mt-6">
                    <span className="inline-flex items-center space-x-2 bg-green-100 text-green-800 font-semibold px-3 py-1.5 rounded-full text-sm">
                      <Trophy className="w-4 h-4"/>
                      <span>{testimonial.achievement}</span>
                    </span>
                  </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-transparent to-gray-50 pointer-events-none"></div>
        </div>
      </section>
      
       {/* Additional Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible.features ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                    Everything you need, <span className="gradient-text">and more.</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    We've packed KnowGrow with features designed for a stress-free and effective learning experience.
                </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {additionalFeatures.map((feature, index) => (
                    <div 
                      key={index}
                      className={`transition-all duration-500 transform ${isVisible.features ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                      style={{transitionDelay: `${index * 100}ms`}}
                    >
                        <div className="flex items-start space-x-4">
                            <div className="text-3xl">{feature.emoji}</div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible.faq ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                      Frequently Asked <span className="gradient-text">Questions</span>
                  </h2>
                  <p className="text-xl text-gray-600">
                      Have questions? We've got answers.
                  </p>
              </div>
              <div className="space-y-4">
                  {faqs.map((faq, index) => (
                      <div key={index} className={`border bg-white border-gray-200 rounded-lg transition-all duration-500 ${isVisible.faq ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`} style={{ transitionDelay: `${index * 150}ms` }}>
                          <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex justify-between items-center text-left p-6 font-semibold text-lg text-gray-800 hover:bg-gray-50/50">
                              <span>{faq.q}</span>
                              <ChevronDown className={`w-6 h-6 transform transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-green-600' : 'rotate-0 text-gray-400'}`} />
                          </button>
                          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}>
                              <p className="p-6 pt-0 text-gray-600 leading-relaxed">{faq.a}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 transform ${ isVisible.cta ? "scale-100 opacity-100" : "scale-95 opacity-0" }`}>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
              Stop Doubting, Start <span className="gradient-text">Growing.</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Your future self is waiting. Give them the advantage of personalized AI learning. Join thousands of students who are learning smarter, not harder.
            </p>
            <RedirectButton
              label="Claim Your 14-Day Free Trial"
              href="/hub/product"
              variant="primary"
              icon="arrow"
              className="text-lg px-10 py-5"
            />
             <p className="mt-4 text-sm text-gray-500">No credit card required. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">KnowGrow</span>
            </div>
            
            <div className="flex space-x-6 text-gray-500">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} KnowGrow. All rights reserved. Made with ❤️ for the learners of India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

