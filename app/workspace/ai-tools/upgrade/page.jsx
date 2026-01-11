"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../@/components/ui/card"; // Adjust path as needed
import { Button } from "../../../../@/components/ui/button"; // Adjust path as needed
import { Sparkles, ArrowRight, CheckCircle } from "lucide-react";

/**
 * An attractive card component to upsell users to a premium plan.
 * You can place this component on pages where content is restricted.
 */
export function UpgradePlanCard({ toolCount = "all" }) {
  return (
    <Card className="w-full max-w-lg mx-auto my-12 border-primary/30 border-2 shadow-xl shadow-primary/10">
      
      <CardHeader className="items-center text-center p-6">
        {/* 1. Attractive Visual: A large, "premium" icon */}
        <div className="p-4 bg-primary/10 rounded-full mb-4 border-4 border-primary/20">
          <Sparkles className="h-12 w-12 text-primary" />
        </div>
        
        {/* 2. The Main Message */}
        <CardTitle className="text-3xl font-extrabold text-gray-900 dark:text-gray-50">
          Level Up Your Knowledge
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground pt-2">
          Please upgrade your plan to access <strong>{toolCount}</strong> premium AI tools and cheatsheets.
        </CardDescription>
      </CardHeader>

      {/* 3. Feature List (The "Why") */}
      <CardContent className="p-6">
        <h3 className="text-md font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">Your upgrade will unlock:</h3>
        <ul className="space-y-3 text-base text-gray-700 dark:text-gray-300">
          <li className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
            <span>Access to <strong>all Premium AI Tools</strong></span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
            <span>Full <strong>Developer Cheatsheet</strong> library</span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
            <span>Unlimited <strong>AI code & image</strong> generation</span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
            <span>Priority email support</span>
          </li>
        </ul>
      </CardContent>

      {/* 4. The Call-to-Action (CTA) Button */}
      <CardFooter className="p-6">
        <Button 
          size="lg" 
          className="w-full text-lg h-12 font-bold group"
          onClick={() => console.log("Navigate to pricing page")} // Replace with your navigation logic
        >
          Upgrade Your Plan coming soon...
          <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default UpgradePlanCard;