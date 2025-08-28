"use client";

import React, { useRef } from 'react';
import { Linkedin, Github, MessageSquare, Instagram, Send, Users, ShieldCheck, Mail, Phone } from 'lucide-react';

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


// Main component for the Contact page.
export default function ContactPage() {
    const communityRef = useRef(null);
    const adminRef = useRef(null);

    const scrollTo = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 text-gray-800">
       <style>{`
        html {
            scroll-behavior: smooth;
        }
      `}</style>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-24 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-teal-500 to-green-600 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              We're here to help. Whether you have a question for the community or need direct support from our team, find the right channel below.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button onClick={() => scrollTo(communityRef)} className="px-8 py-3 rounded-full font-semibold text-lg bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all flex items-center justify-center gap-2">
                    <Users size={20} /> Community Support
                </button>
                <button onClick={() => scrollTo(adminRef)} className="px-8 py-3 rounded-full font-semibold text-lg bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                    <ShieldCheck size={20} /> Admin & Account Support
                </button>
            </div>
          </div>
        </section>

        {/* Community Support Section */}
        <section ref={communityRef} id="community" className="py-20 bg-white/70">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Join the Conversation</h2>
                <p className="text-lg text-gray-600 mt-2 mb-12 max-w-2xl mx-auto">
                    Have a general question or want to connect with fellow learners? Our community channels are the best place to start.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {/* Social Links */}
                    <a href="https://chat.whatsapp.com/BoTkCUH5DCDBk22ApdYl1D" className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3">
                        <MessageSquare className="w-10 h-10 text-green-500" />
                        <span className="font-semibold">WhatsApp</span>
                    </a>
                     <a href="https://t.me/skilldevelopersteam" className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3">
                        <Send className="w-10 h-10 text-green-500" />
                        <span className="font-semibold">Telegram</span>
                    </a>
                    <a href="https://www.instagram.com/knowgrow.ai/" className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3">
                        <Instagram className="w-10 h-10 text-green-500" />
                        <span className="font-semibold">Instagram</span>
                    </a>
                    <a href="https://www.linkedin.com/company/knowgrow/" className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3">
                        <Linkedin className="w-10 h-10 text-green-500" />
                        <span className="font-semibold">LinkedIn</span>
                    </a>
                    <a href="https://github.com/Nathishwar-prog" className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3">
                        <Github className="w-10 h-10 text-green-500" />
                        <span className="font-semibold">GitHub</span>
                    </a>
                </div>
            </div>
        </section>

        {/* Admin & Direct Support Section */}
        <section ref={adminRef} id="admin" className="py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Admin & Account Support</h2>
                    <p className="text-lg text-gray-600 mt-2 max-w-3xl mx-auto">
                        For specific questions about <span className="font-semibold text-green-600">payments, membership subscriptions, or student ID verification</span>, please contact our admin team directly.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-lg mx-auto">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">Direct Contact Channels</h3>
                    <p className="text-gray-600 text-center mb-6">
                        Please allow up to 24 hours for a response from our admin team.
                    </p>
                    <div className="space-y-4">
                        <a href="mailto:nathishwarc@gmail.com" className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:shadow-lg hover:bg-white transition-all border border-transparent hover:border-gray-200">
                            <Mail className="w-8 h-8 text-green-500 flex-shrink-0"/>
                            <div>
                                <p className="font-semibold">Email Support</p>
                                <p className="text-gray-500">admin@knowgrow.com</p>
                            </div>
                        </a>
                        <a href="https://chat.whatsapp.com/BoTkCUH5DCDBk22ApdYl1D" className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:shadow-lg hover:bg-white transition-all border border-transparent hover:border-gray-200">
                            <Phone className="w-8 h-8 text-green-500 flex-shrink-0"/>
                            <div>
                                <p className="font-semibold">WhatsApp</p>
                                <p className="text-gray-500">Message us for quick support</p>
                            </div>
                        </a>
                        <a href="https://www.linkedin.com/in/nathishwar/" className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:shadow-lg hover:bg-white transition-all border border-transparent hover:border-gray-200">
                            <Linkedin className="w-8 h-8 text-green-500 flex-shrink-0"/>
                            <div>
                                <p className="font-semibold">Admin LinkedIn</p>
                                <p className="text-gray-500">Connect with our support lead</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
