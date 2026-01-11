"use client";

import React from "react";
import Link from "next/link";
import { Search, Loader2, ArrowRight } from "lucide-react";

export default function SearchResultsSection({ searchQuery, isSearching, searchResults, userDetail }) {
    return (
        <section id="search-results" className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    {isSearching ? `Searching for "${searchQuery}"...` : searchResults.length > 0 ? `Found ${searchResults.length} course${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"` : `No courses found for "${searchQuery}"`}
                </h2>

                {isSearching ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full mb-4">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Searching for courses matching "{searchQuery}"...
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
                                    <div className="p-6">
                                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {searchResults.map((course, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.name}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            {course.level}
                                        </span>
                                        <Link
                                            href={`/course/${course.cid}`}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                                        >
                                            View Course
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto text-center py-12">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="mx-auto bg-gradient-to-br from-green-100 to-teal-100 rounded-full w-24 h-24 flex items-center justify-center mb-6">
                                <Search className="w-12 h-12 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Sorry, {userDetail?.name || 'learner'}!</h3>
                            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                                You searched for "{searchQuery}" but I couldn't find any courses on this topic yet. You're the first to ask! I'm excited to create a course just for you.
                            </p>
                            <Link
                                href="/workspace"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                Create Your Course
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
