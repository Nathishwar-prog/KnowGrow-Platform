import React from 'react';
import { Search, MessageSquare, BookOpen, Users, LifeBuoy, ChevronRight, Mail, Phone } from 'lucide-react';

// A simple functional component for the header, matching the landing page style.
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
        <a href="/" className="px-4 py-2 rounded-full font-semibold text-md bg-green-500 text-white hover:bg-green-600 transition-colors">
          Back to Home
        </a>
      </div>
    </div>
  </header>
);

// A simple functional component for the footer.
const Footer = () => (
    <footer className="py-12 border-t border-green-500/20 bg-white/30 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} KnowGrow. All rights reserved. Growing knowledge through artificial intelligence.</p>
        </div>
    </footer>
);

// Main component for the Community Support page.
export default function CommunitySupport() {
  const faqItems = [
    { q: "How do I reset my password?", a: "You can reset your password by clicking the 'Forgot Password' link on the login page and following the instructions sent to your email." },
    { q: "Can I access my courses offline?", a: "Currently, our platform requires an active internet connection to access course materials and track progress." },
    { q: "How does the AI personalization work?", a: "Our AI analyzes your learning patterns, quiz results, and interactions to recommend the most relevant content and create a customized learning path for you." },
    { q: "Is there a mobile app?", a: "We are developing a mobile app for both iOS and Android. Stay tuned for updates!" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 text-gray-800">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 text-center bg-white/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              How can we help?
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Find answers to your questions, connect with the community, or contact our support team.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <input
                type="search"
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </section>

        {/* Support Options Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-8 bg-white/60 backdrop-blur-lg rounded-2xl border border-green-500/20 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Knowledge Base</h3>
                <p className="text-gray-600">Explore our comprehensive articles and tutorials to find answers quickly.</p>
              </div>
              <div className="p-8 bg-white/60 backdrop-blur-lg rounded-2xl border border-green-500/20 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Community Forums</h3>
                <p className="text-gray-600">Ask questions, share your knowledge, and connect with other learners.</p>
              </div>
              <div className="p-8 bg-white/60 backdrop-blur-lg rounded-2xl border border-green-500/20 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl flex items-center justify-center mb-4">
                  <LifeBuoy className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Contact Support</h3>
                <p className="text-gray-600">Can't find an answer? Our support team is here to help you.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-green-50/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="text-gray-600 mt-2">Here are some of our most common questions.</p>
            </div>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <details key={index} className="p-4 bg-white rounded-lg shadow-sm cursor-pointer group">
                  <summary className="flex justify-between items-center font-semibold text-gray-800">
                    {item.q}
                    <ChevronRight className="w-5 h-5 text-green-600 transform group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="mt-2 text-gray-600 leading-relaxed">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <h2 className="text-3xl font-bold text-gray-900 mb-4">Still need help?</h2>
             <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Our team is available to assist you. Reach out via email or phone, and we'll get back to you as soon as possible.
             </p>
             <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                <div className="flex items-center text-lg">
                    <Mail className="w-6 h-6 mr-3 text-green-600"/>
                    <a href="mailto:support@knowgrow.com" className="text-green-600 hover:underline">support@knowgrow.com</a>
                </div>
                <div className="flex items-center text-lg">
                    <Phone className="w-6 h-6 mr-3 text-green-600"/>
                    <span className="text-gray-700">+91 123 456 7890</span>
                </div>
             </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
