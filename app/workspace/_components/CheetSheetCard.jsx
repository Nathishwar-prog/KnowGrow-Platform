// CheatsheetCard.jsx
"use client";

import React from "react";
import Link from "next/link"; // Import Link for navigation
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../@/components/ui/card";
import { BookOpen, Zap } from "lucide-react";

/**
 * Renders a card that links to a separate page for a cheatsheet.
 * @param {object} props
 * @param {object} props.cheatsheet - The cheatsheet object with name, description, benefits, advice, and linkPath.
 */
const CheatsheetCard = ({ cheatsheet }) => {
    return (
        // Wrap the entire card in a Link component.
        // It will navigate to the path defined in your data (e.g., /cheatsheets/react-hooks)
        <Link href={cheatsheet.linkPath} passHref>
            <Card
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 flex flex-col justify-between h-full"
            >
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                            {cheatsheet.name}
                        </CardTitle>
                        {cheatsheet.icon}
                    </div>
                    <CardDescription className="pt-1 min-h-[40px]">
                        {cheatsheet.description}
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 flex-1">
                    {/* Benefits Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1 flex items-center">
                            <Zap className="h-4 w-4 mr-1.5" />
                            Key Benefits:
                        </h3>
                        <ul className="list-disc ml-6 space-y-0.5 text-sm text-gray-700 dark:text-gray-300">
                            {/* Show first 2 benefits */}
                            {cheatsheet.benefits.slice(0, 2).map((benefit, index) => (
                                <li key={index} className="truncate">{benefit}</li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Advice Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 mb-1">
                            Advice:
                        </h3>
                        <p className="text-sm italic text-gray-600 dark:text-gray-400">
                            {cheatsheet.advice}
                        </p>
                    </div>
                </CardContent>
                
                {/* Link/Action Footer */}
                <div className="px-6 pb-6 pt-3 border-t border-dashed">
                    <div className="flex items-center text-sm font-medium text-primary hover:text-primary/80 group-hover:underline transition-colors">
                        View Cheatsheet
                        <BookOpen className="h-4 w-4 ml-2" />
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default CheatsheetCard;