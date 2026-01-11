"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "../../../@/components/ui/input"; // Assuming Shadcn UI paths
import { Button } from "../../../@/components/ui/button"; // Assuming Shadcn UI paths
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../@/components/ui/card"; // Assuming Shadcn UI paths
import { Search, Loader2, AlertCircle, RefreshCw, ArrowRight } from "lucide-react";

// --- Mock Data for AI Tools ---
const mockAITools = [
    {
        id: 1,
        name: "AI Code Generator",
        description: "Generate boilerplate code snippets instantly from natural language descriptions.",
        link: "/workspace/ai-tools/upgrade",
        category: "Development",
    },
    {
        id: 2,
        name: "Image Enhancer Pro",
        description: "Upscale and enhance image quality using state-of-the-art super-resolution AI.",
        link: "/workspace/ai-tools/upgrade",
        category: "Design",
    },
    {
        id: 3,
        name: "Content Writer Bot",
        description: "Create engaging articles, blog posts, and marketing copy in seconds.",
        link: "/workspace/ai-tools/upgrade",
        category: "Content",
    },
    {
        id: 4,
        name: "Data Analyst Assistant",
        description: "Ask questions about your data and receive instant insights and visualizations.",
        link: "/workspace/ai-tools/upgrade",
        category: "Data Science",
    },
    {
        id: 5,
        name: "Language Translator AI",
        description: "Real-time, high-accuracy translation for over 100 languages.",
        link: "/workspace/ai-tools/upgrade",
        category: "Utility",
    },
    {
        id: 6,
        name: "SEO Keyword Planner",
        description: "Discover high-ranking keywords and optimize your content strategy.",
        link: "/workspace/ai-tools/upgrade",
        category: "Marketing",
    },
];

// --- AIToolCard Component (Replacement for CourseCard) ---
const AIToolCard = ({ tool }) => {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">{tool.name}</CardTitle>
                <CardDescription>{tool.category}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground min-h-[40px]">{tool.description}</p>
                <a href={tool.link} className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    Use Tool
                    <ArrowRight className="h-4 w-4 ml-1" />
                </a>
            </CardContent>
        </Card>
    );
}

// --- Main ExploreAITools Component ---
function AITools() {
    // Replaced courseList with toolList for better naming
    const [toolList, setToolList] = useState(mockAITools); 
    const [filteredTools, setFilteredTools] = useState(mockAITools);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(null);

    // Mock fetching logic (Simulate an API call)
    const GetAIToolList = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            // In a real app, this would be an axios.get('/api/ai-tools')
            setToolList(mockAITools);
            setFilteredTools(mockAITools);
        } catch (err) {
            console.error('Error fetching tools:', err);
            setError('Failed to load AI tools. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Automatically load tools on mount
        GetAIToolList();
    }, [GetAIToolList]);

    // Debounced search effect for client-side filtering
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearch();
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchQuery, toolList]);


    const handleSearch = useCallback(() => {
        const query = searchQuery.trim().toLowerCase();
        setIsSearching(true);

        if (query === "") {
            setFilteredTools(toolList);
            setIsSearching(false);
            return;
        }

        // Client-side filtering logic
        const filtered = toolList.filter(tool => {
            return (
                tool.name.toLowerCase().includes(query) ||
                tool.description.toLowerCase().includes(query) ||
                tool.category.toLowerCase().includes(query)
            );
        });

        setFilteredTools(filtered);
        setIsSearching(false);

    }, [searchQuery, toolList]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // --- RENDER START ---
    return ( 
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className='font-extrabold text-4xl text-gray-900 dark:text-gray-50'>Explore AI Tools 🚀</h1>
                <Button 
                    variant="outline" 
                    onClick={GetAIToolList}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>
            
            {/* Search Bar Section */}
            <div className='flex gap-3 max-w-3xl mx-auto mb-8 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                        placeholder="Search AI tools by name or description..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-12 h-14 text-base focus:ring-2 focus:ring-primary/50"
                    />
                    {isSearching && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-primary" />
                    )}
                </div>
            </div>

            {/* --- Content Area --- */}

            {/* Loading State */}
            {isLoading && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[0,1,2,3,4,5].map((item) => (
                            <Card key={item}>
                                <CardHeader>
                                    <div className="flex flex-col space-y-2">
                                        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                                        <div className="h-4 w-1/4 bg-gray-100 dark:bg-gray-700 rounded" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded" />
                                        <div className="h-3 w-5/6 bg-gray-100 dark:bg-gray-700 rounded" />
                                        <div className="h-3 w-1/3 bg-gray-100 dark:bg-gray-700 rounded" />
                                    </div>
                                    <div className="h-4 w-1/4 mt-4 bg-primary/20 rounded" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 my-8">
                    <CardContent className="flex items-center gap-4 p-6">
                        <AlertCircle className="h-6 w-6 text-red-500" />
                        <div>
                            <h3 className="font-semibold text-red-700 dark:text-red-400">Error Loading Tools</h3>
                            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={GetAIToolList}
                            className="ml-auto"
                        >
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Tools Grid */}
            {!isLoading && !error && (
                <>
                    {/* Results Count */}
                    <div className="mb-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            {searchQuery ? (
                                `Found ${filteredTools.length} tool${filteredTools.length !== 1 ? 's' : ''} matching "${searchQuery}"`
                            ) : (
                                `Showing ${filteredTools.length} AI tool${filteredTools.length !== 1 ? 's' : ''}`
                            )}
                        </p>
                    </div>

                    {/* No Results */}
                    {filteredTools.length === 0 && (
                        <Card className="border-dashed my-8">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No AI tools found</h3>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    {searchQuery ? 
                                        `No tools match your search "${searchQuery}". Try different keywords like 'code' or 'image'.` :
                                        "No AI tools are available at the moment."
                                    }
                                </p>
                                {searchQuery && (
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setSearchQuery("")}
                                    >
                                        Clear Search
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* AI Tool Cards Grid */}
                    {filteredTools.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTools.map((tool) => (
                                <AIToolCard tool={tool} key={tool.id} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AITools;