"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  BrainCircuit,
  BarChart3,
  Wrench,
  X,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

// Reusable Header component for consistency
const Header = () => (
  <header className="bg-white/95 backdrop-blur-lg border-b border-green-500/20 sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <a href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v11.494m-5.22-6.22l-1.58 1.58a6 6 0 108.486 8.486L12 18.75l-1.78-1.78a6 6 0 00-8.486-8.486l1.58-1.58A6 6 0 0112 6.253z"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            KnowGrow
          </span>
        </a>
        <a
          href="/"
          className="px-4 py-2 rounded-full font-semibold text-md bg-green-500 text-white hover:bg-green-600 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  </header>
);

// Reusable Footer component
const Footer = () => (
  <footer className="py-12 border-t border-green-500/20 bg-white/30 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
      <p>
        &copy; {new Date().getFullYear()} KnowGrow. All rights reserved. Growing
        knowledge through artificial intelligence.
      </p>
    </div>
  </footer>
);

// Product Modal Component
const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform scale-95 hover:scale-100 transition-transform duration-300" onClick={e => e.stopPropagation()}>
        <div className="p-8 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                {product.icon}
            </div>
            <div>
                <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
                <span className="text-sm font-medium bg-green-100 text-green-700 py-1 px-3 rounded-full">{product.category}</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">How It Works</h3>
              <p className="text-gray-600 leading-relaxed">{product.howItWorks}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Advantages</h3>
              <ul className="space-y-2">
                {product.advantages.map((adv, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <a href={product.path} className="inline-block px-8 py-3 rounded-full font-semibold text-lg bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg hover:shadow-green-500/25 hover:scale-105 transition-all">
                <span className="flex items-center gap-2">
                    Go to {product.name} <ArrowRight size={20} />
                </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};


// Main component for the AI Products Hub page.
export default function AiProductsHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ==================================================================
  // TO ADD A NEW PRODUCT, COPY A BLOCK AND PASTE IT INTO THIS LIST
  // ==================================================================
  const products = [
    // BLOCK 1: Product Example
    {
      id: 1,
      name: "AI Tutor",
      path: "/workspace",
      category: "Learning Tools",
      icon: <BrainCircuit size={32} />,
      description: "An intelligent assistant that builds complete course content, creates a personalized learning roadmap, and trains you to become an expert.",
      howItWorks: "Our AI analyzes your goals, tracks your progress, and dynamically adjusts your schedule to focus on areas needing improvement, ensuring you are always prepared.",
      advantages: [
        'Reduces procrastination with a clear, actionable plan.',
        'Improves retention by scheduling revision sessions at optimal times.',
        'Adapts to unexpected changes in your schedule automatically.'
      ],
    },
    // END BLOCK 1

    // BLOCK 2: Product Example
    {
      id: 2,
      name: "Performance Analytics",
      path: "/hub/restrict",
      category: "Analytics",
      icon: <BarChart3 size={32} />,
      description: "A powerful dashboard that visualizes your learning progress, highlighting strengths and weaknesses across subjects.",
      howItWorks: "The system aggregates data from your quizzes and study sessions to generate insightful charts, giving you a clear view of your academic performance.",
      advantages: [
        'Identify knowledge gaps before they become major issues.',
        'Track your improvement over time to stay motivated.',
        'Benchmark your performance with anonymized peer data.'
      ],
    },
    // END BLOCK 2

    // BLOCK 3: Product Example
    {
      id: 3,
      name: "Smart Content Generator",
      path: "/hub/restrict",
      category: "Productivity",
      icon: <Wrench size={32} />,
      description: "Generate flashcards, summaries, and practice questions from your course materials in seconds.",
      howItWorks: "Upload your lecture notes or articles. Our AI will extract key concepts and generate a variety of study aids tailored to your content.",
      advantages: [
        'Save hours of manual work creating study materials.',
        'Generate unlimited practice questions to test your knowledge.',
        'Create concise summaries for quick review before exams.'
      ],
    },
    // END BLOCK 3

    // TO ADD A NEW PRODUCT, PASTE THE COPIED BLOCK HERE
  ];
  // ==================================================================

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, products]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 text-gray-800">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 text-center bg-white/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Our AI Products & Services
            </h1>
            <p className="text-lg text-gray-600">
              Discover intelligent tools designed to enhance your learning and
              productivity.
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 sticky top-[72px] bg-gray-50/80 backdrop-blur-lg z-30 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-grow w-full md:w-auto">
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                      selectedCategory === category
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-600 hover:bg-green-100"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="cursor-pointer bg-white/60 backdrop-blur-lg rounded-2xl border border-green-500/20 p-8 hover:shadow-2xl hover:border-green-400/50 hover:-translate-y-2 transition-all group h-full"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      {product.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4 h-20">
                      {product.description}
                    </p>
                    <span className="font-semibold text-green-600 group-hover:underline">
                      Learn More &rarr;
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 md:col-span-2 lg:col-span-3 text-center">
                  No products found. Try adjusting your search or filter.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
