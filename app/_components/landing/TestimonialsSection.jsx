"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Priya Sharma",
        role: "Software Developer",
        avatar: "PS",
        rating: 5,
        text: "KnowGrow transformed how I learn. The AI-generated courses are incredibly well-structured, and the doubt clarification feature saved me hours of searching.",
        highlight: "Saved hours of searching"
    },
    {
        name: "Rahul Verma",
        role: "College Student",
        avatar: "RV",
        rating: 5,
        text: "As a student preparing for placements, the project guidance feature helped me build a solid portfolio. The personalized learning path made all the difference.",
        highlight: "Built solid portfolio"
    },
    {
        name: "Ananya Patel",
        role: "Data Analyst",
        avatar: "AP",
        rating: 5,
        text: "The adaptive quizzes are brilliant! They identified my weak areas and helped me focus on what mattered. I've never learned this efficiently before.",
        highlight: "Learn efficiently"
    },
    {
        name: "Vikram Singh",
        role: "Career Changer",
        avatar: "VS",
        rating: 5,
        text: "Switching careers seemed daunting until I found KnowGrow. The AI tutor guided me step-by-step, and now I'm confident in my new tech skills.",
        highlight: "Confident in new skills"
    },
    {
        name: "Meera Krishnan",
        role: "Freelancer",
        avatar: "MK",
        rating: 5,
        text: "I love how the platform adapts to my schedule. Whether I have 15 minutes or 2 hours, there's always something valuable to learn.",
        highlight: "Adapts to my schedule"
    },
    {
        name: "Arjun Reddy",
        role: "Tech Lead",
        avatar: "AR",
        rating: 5,
        text: "Even as a senior developer, KnowGrow helps me stay updated with new technologies. The AI keeps the content relevant and current.",
        highlight: "Stay updated"
    }
];

function TestimonialCard({ testimonial, index }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.avatar}
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
                <Quote className="w-8 h-8 text-green-200" />
            </div>

            <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
            </div>

            <p className="text-gray-600 leading-relaxed mb-4">{testimonial.text}</p>

            <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {testimonial.highlight}
            </div>
        </div>
    );
}

export default function TestimonialsSection() {
    const [isVisible, setIsVisible] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (headerRef.current) observer.observe(headerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headerRef} className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Star className="w-4 h-4 fill-yellow-500" />
                        Loved by Learners
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        What Our Community Says
                    </h2>
                    <p className="text-lg text-gray-600">
                        Join thousands of learners who have transformed their careers with KnowGrow.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
