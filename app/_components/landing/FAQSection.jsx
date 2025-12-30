"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "What is KnowGrow?",
        answer: "KnowGrow is an AI-powered learning platform that creates personalized courses, adaptive quizzes, and provides real-time tutoring. Just describe what you want to learn, and our AI generates a complete learning path tailored to your goals and pace."
    },
    {
        question: "How does the AI course generation work?",
        answer: "Simply enter your learning goal—like 'Learn Python for data science' or 'Master React.js'—and our AI analyzes thousands of learning resources to create a structured course with chapters, lessons, and practice exercises customized for your skill level."
    },
    {
        question: "Is KnowGrow suitable for complete beginners?",
        answer: "Absolutely! Our AI adapts to all skill levels. Whether you're starting from zero or advancing existing skills, the platform adjusts content complexity, pacing, and explanations to match your current understanding."
    },
    {
        question: "How does the doubt clarification feature work?",
        answer: "Got stuck? Just ask! Our AI tutor is available 24/7 to answer questions in context. It understands what you're learning and provides clear, relevant explanations—like having a personal tutor always by your side."
    },
    {
        question: "Can I track my learning progress?",
        answer: "Yes! Your personalized dashboard shows real-time progress across all courses. Track completed lessons, quiz scores, project milestones, and identify areas needing more focus—all in one beautiful interface."
    },
    {
        question: "Do I need a credit card to start?",
        answer: "No credit card required! Start with our 14-day free trial to explore all features. You can cancel anytime, and we'll never charge you unexpectedly."
    },
    {
        question: "What makes KnowGrow different from other platforms?",
        answer: "Unlike static courses, KnowGrow dynamically generates and adapts content using AI. Every course is unique to you, quizzes adjust to your performance, and you get instant help for any doubt—all integrated into one seamless learning experience."
    },
    {
        question: "Can I use KnowGrow for exam preparation?",
        answer: "Yes! Set your exam syllabus as your learning goal, and the AI creates a targeted study plan. Smart quizzes help reinforce concepts, and progress tracking ensures you're exam-ready on time."
    }
];

function FAQItem({ faq, index, isOpen, onToggle }) {
    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 text-left"
            >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-green-600" : ""}`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"}`}
            >
                <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                </div>
            </div>
        </div>
    );
}

export default function FAQSection() {
    const [openFaq, setOpenFaq] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <HelpCircle className="w-4 h-4" />
                        Got Questions?
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600">
                        Everything you need to know about KnowGrow. Can't find your answer? Contact us!
                    </p>
                </div>

                <div className={`space-y-4 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            faq={faq}
                            index={index}
                            isOpen={openFaq === index}
                            onToggle={() => setOpenFaq(openFaq === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
