"use client"
import { UserButton, useUser } from "@clerk/nextjs";
import { SidebarTrigger } from "../../../@/components/ui/sidebar";
import React, { useState, useContext } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, HelpCircle, FileText, Lightbulb, Code, X, Home, User } from "lucide-react";
import { Button } from "../../../@/components/ui/button";
import Link from "next/link";
import DoubtClearAI from "./DoubtClearAI";
import QuizGenerateAI from "./QuizGenerateAI";
import ProjectGuidanceAI from "./ProjectGuidanceAI";
import { UserDetailContext } from "../../../context/UserDetailContext";

function Appheader({hideSidebar=false}){
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';
    const { user } = useUser();
    const { userDetail } = useContext(UserDetailContext);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const [isDoubtClearOpen, setIsDoubtClearOpen] = useState(false);
    const [isQuizGenerateOpen, setIsQuizGenerateOpen] = useState(false);
    const [isProjectGuidanceOpen, setIsProjectGuidanceOpen] = useState(false);

    return (
        <div className='p-4 flex justify-between items-center shadow-sm border-b sticky top-0 bg-background z-50'> 
            <div className='flex items-center gap-3'>
                {!hideSidebar && <SidebarTrigger />}
                <Link href="/workspace" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground hidden md:block">Workspace</span>
                </Link>
            </div>
            
            {/* Center AI Tools Buttons */}
            <div className='flex items-center gap-2 md:gap-3'>
                {/* Doubt Clear AI Button */}
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden sm:flex items-center gap-2 text-xs md:text-sm"
                    onClick={() => setIsDoubtClearOpen(true)}
                >
                    <HelpCircle className="h-4 w-4" />
                    <span className="hidden md:inline">Doubt Clarification</span>
                </Button>

                {/* Quiz Generate AI Button */}
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden sm:flex items-center gap-2 text-xs md:text-sm"
                    onClick={() => setIsQuizGenerateOpen(true)}
                >
                    <FileText className="h-4 w-4" />
                    <span className="hidden md:inline">Test Knowledge</span>
                </Button>

                {/* Project Guidance Button */}
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden sm:flex items-center gap-2 text-xs md:text-sm"
                    onClick={() => setIsProjectGuidanceOpen(true)}
                >
                    <Lightbulb className="h-4 w-4" />
                    <span className="hidden md:inline">Project Guidance</span>
                </Button>
            </div>

            <div className='flex items-center gap-3'>
                {/* Code Editor Toggle Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                    className="flex items-center gap-2"
                >
                    <Code className="h-4 w-4" />
                    <span className="hidden sm:inline">Code Editor</span>
                </Button>

                {/* Theme Toggle Button */}
                <button
                  aria-label="Toggle theme"
                  onClick={()=> setTheme(isDark ? 'light' : 'dark')}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-md border bg-card hover:bg-accent transition-colors"
                >
                  {isDark ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
                </button>
                
                {/* User Profile Component */}
                <Link href="/workspace/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                        {user?.imageUrl ? (
                            <img 
                                src={user.imageUrl} 
                                alt="Profile" 
                                className="h-8 w-8 rounded-full object-cover"
                            />
                        ) : (
                            <User className="h-4 w-4 text-white" />
                        )}
                    </div>
                    <div className="hidden md:block">
                        <div className="text-sm font-medium text-foreground">
                            {user?.fullName || user?.firstName || 'User'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {user?.primaryEmailAddress?.emailAddress || 'user@example.com'}
                        </div>
                    </div>
                </Link>
            </div>

            {/* Right Sidebar */}
            {isRightSidebarOpen && (
                <div className="fixed top-0 right-0 h-full w-80 bg-background border-l shadow-lg z-40 transform transition-transform duration-300 ease-in-out">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Code Editor</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsRightSidebarOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="p-4">
                        <div className="text-center text-muted-foreground">
                            Code Editor feature coming soon...
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay for mobile */}
            {isRightSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsRightSidebarOpen(false)}
                />
            )}

            {/* AI Components */}
            <DoubtClearAI 
                isOpen={isDoubtClearOpen} 
                onClose={() => setIsDoubtClearOpen(false)} 
            />
            <QuizGenerateAI 
                isOpen={isQuizGenerateOpen} 
                onClose={() => setIsQuizGenerateOpen(false)} 
            />
            <ProjectGuidanceAI 
                isOpen={isProjectGuidanceOpen} 
                onClose={() => setIsProjectGuidanceOpen(false)} 
            />
        </div>
    )
}

export default Appheader;