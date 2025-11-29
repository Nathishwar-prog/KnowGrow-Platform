"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch, onQueryChange }) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        onQueryChange(value);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search courses, topics, or skills..."
                    className="w-full px-6 py-4 text-lg rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-lg"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full p-3 hover:from-green-600 hover:to-teal-600 transition-all duration-300"
                >
                    <Search className="w-5 h-5" />
                </button>
            </div>
        </form>
    );
}
