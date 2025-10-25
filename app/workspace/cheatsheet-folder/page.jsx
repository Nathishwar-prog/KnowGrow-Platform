"use client";

import React, { useState, useEffect } from "react";
import { Search, Code, Palette, Zap } from "lucide-react";
import { Input } from "../../../@/components/ui/input";
import { Card, CardContent } from "../../../@/components/ui/card";
import { Separator } from "../../../@/components/ui/separator";
import { Button } from "../../../@/components/ui/button";

// --- Import your linking CheatsheetCard component ---
import CheatsheetCard from "../_components/CheetSheetCard"; 

// --- Mock Data ---
const mockCheatsheets = [
    {
        id: 1,
        name: "HTML Cheatsheet",
        description: "A quick reference for HTML tags, attributes, and best practices.",
        icon: <Code className="h-5 w-5 text-blue-500" />,
        linkPath: "/workspace/cheatsheet-folder/cheatsheets/html", // This path is now used by the Link component
        benefits: ["Faster HTML development", "Cleaner HTML structure", "Best practices for HTML"],
        advice: "Always use the latest HTML5 tags and attributes and use emmet shortcuts.",
    },
    {
        id: 2,
        name: "CSS Cheatsheet",
        description: "A quick reference for CSS properties, selectors, and best practices.",
        icon: <Palette className="h-5 w-5 text-teal-500" />,
        linkPath: "/workspace/cheatsheet-folder/cheatsheets/css",
        benefits: ["Faster CSS development", "Cleaner CSS structure", "Best practices for CSS"],
        advice: "Always use the latest CSS3 properties and selectors and use emmet shortcuts.",
    },
    {
        id: 3,
        name: "JavaScript Cheatsheet",
        description: "A quick reference for JavaScript functions, objects, and best practices.",
        icon: <Zap className="h-5 w-5 text-orange-500" />,
        linkPath: "/workspace/cheatsheet-folder/cheatsheets/javascript",
        benefits: ["Faster JavaScript development", "Cleaner JavaScript structure", "Best practices for JavaScript"],
        advice: "Always use the latest JavaScript ES6+ features and use emmet shortcuts.",
    },
    {
        id: 4,
        name:'Python Cheatsheet',
        description: "A quick reference for Python functions, objects, and best practices.",
        icon: <Code className="h-5 w-5 text-green-500" />,
        linkPath: "/workspace/cheatsheet-folder/cheatsheets/python",
        benefits: ["Faster Python development", "Cleaner Python structure", "Best practices for Python"],
        advice: "Always use the latest Python 3.10+ features and use emmet shortcuts.",
    }
];

// --- Main Cheatsheet Page Component ---
function CheatsheetMain() {
    const [cheatsheetList] = useState(mockCheatsheets);
    const [filteredCheatsheets, setFilteredCheatsheets] = useState(mockCheatsheets);
    const [searchQuery, setSearchQuery] = useState("");

    // Debounced Search Effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearch();
        }, 300); 

        return () => clearTimeout(timeoutId);
    }, [searchQuery, cheatsheetList]);


    const handleSearch = () => {
        const query = searchQuery.trim().toLowerCase();
        
        if (query === "") {
            setFilteredCheatsheets(cheatsheetList);
            return;
        }

        const filtered = cheatsheetList.filter(sheet => {
            return (
                sheet.name.toLowerCase().includes(query) ||
                sheet.description.toLowerCase().includes(query) ||
                sheet.advice.toLowerCase().includes(query)
            );
        });

        setFilteredCheatsheets(filtered);
    };

    return ( 
        <div className="p-6 md:p-10">
            <h1 className='font-extrabold text-4xl text-gray-900 dark:text-gray-50 mb-8'>
                Developer Cheatsheets Library 📚
            </h1>
            
            {/* Search Bar */}
            <div className='flex gap-3 max-w-xl mb-10'>
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                        placeholder="Search for Git, React, Tailwind..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 text-base"
                    />
                </div>
            </div>
            
            <Separator className="mb-8" />

            {/* Results Count */}
            <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                    Showing {filteredCheatsheets.length} resource{filteredCheatsheets.length !== 1 ? 's' : ''}.
                </p>
            </div>

            {/* Cheatsheets Grid */}
            {filteredCheatsheets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCheatsheets.map((sheet) => (
                        // The card itself is now a link.
                        // No onClick prop is needed.
                        <CheatsheetCard 
                            cheatsheet={sheet} 
                            key={sheet.id} 
                        />
                    ))}
                </div>
            ) : (
                 <Card className="border-dashed col-span-full">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <Search className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">No cheatsheets found</h3>
                        <p className="text-muted-foreground mb-4">
                            No resources match your search for "{searchQuery}".
                        </p>
                        <Button variant="outline" onClick={() => setSearchQuery("")}>
                            Clear Search
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* All <Dialog> and modal-related code has been removed.
              Navigation is now handled by the <Link> component
              inside CheatsheetCard.
            */}
        </div>
    );
}

export default CheatsheetMain;