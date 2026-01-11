"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <section id="faq" className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <button onClick={() => setOpenFaq(openFaq === 1 ? null : 1)} className="w-full px-6 py-4 text-left flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">What is KnowGrow?</h3>
                            <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === 1 ? 'rotate-180' : ''}`} />
                        </button>
                        {openFaq === 1 && (
                            <div className="px-6 py-4">
                                <p className="text-gray-600">KnowGrow is an AI-powered learning platform that offers personalized courses and expert guidance to help you achieve your learning goals.</p>
                            </div>
                        )}
                    </div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <button onClick={() => setOpenFaq(openFaq === 2 ? null : 2)} className="w-full px-6 py-4 text-left flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">How does personalized learning work?</h3>
                            <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === 2 ? 'rotate-180' : ''}`} />
                        </button>
                        {openFaq === 2 && (
                            <div className="px-6 py-4">
                                <p className="text-gray-600">Personalized learning adapts to your learning pace and style, providing tailored lessons and resources to help you succeed.</p>
                            </div>
                        )}
                    </div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <button onClick={() => setOpenFaq(openFaq === 3 ? null : 3)} className="w-full px-6 py-4 text-left flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Do I need a credit card to sign up?</h3>
                            <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === 3 ? 'rotate-180' : ''}`} />
                        </button>
                        {openFaq === 3 && (
                            <div className="px-6 py-4">
                                <p className="text-gray-600">No, you can start your journey free without a credit card. We offer a 14-day free trial.</p>
                            </div>
                        )}
                    </div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <button onClick={() => setOpenFaq(openFaq === 4 ? null : 4)} className="w-full px-6 py-4 text-left flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Can I cancel my subscription?</h3>
                            <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === 4 ? 'rotate-180' : ''}`} />
                        </button>
                        {openFaq === 4 && (
                            <div className="px-6 py-4">
                                <p className="text-gray-600">Yes, you can cancel your subscription anytime. There are no long-term commitments.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
