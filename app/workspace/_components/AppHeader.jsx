"use client"
import React, { useState, useContext, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { SidebarTrigger } from "../../../@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { 
    Moon, 
    Sun, 
    Menu, 
    X, 
    Home, 
    LayoutDashboard, 
    Book, 
    Compass, 
    FileQuestion, 
    PencilRulerIcon,
    Bell,
    Settings,
    User,
    Code,
    HelpCircle,
    FileText,
    Lightbulb
} from "lucide-react";
import { Button } from "../../../@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetTrigger 
} from "../../../@/components/ui/sheet";
import DoubtClearAI from "./DoubtClearAI";
import QuizGenerateAI from "./QuizGenerateAI";
import ProjectGuidanceAI from "./ProjectGuidanceAI";
import { UserDetailContext } from "../../../context/UserDetailContext";

const navItems = [
    {
        name: "My Learning",
        path: "/workspace/my-learning",
        icon: Book
    },
    {
        name: "Courses",
        path: "/workspace/explore",
        icon: Compass
    },
    {
        name: "AI Tools",
        path: "/workspace/ai-tools",
        icon: PencilRulerIcon
    },
    {
        name: "Quizzes",
        path: "/workspace/quizzes",
        icon: FileQuestion
    },
    {
        name: "Projects",
        path: "/workspace",
        icon: LayoutDashboard
    }
];

function AppHeader({ hideSidebar = false }) {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';
    const { user } = useUser();
    const { userDetail } = useContext(UserDetailContext);
    const pathname = usePathname();
    
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const [isDoubtClearOpen, setIsDoubtClearOpen] = useState(false);
    const [isQuizGenerateOpen, setIsQuizGenerateOpen] = useState(false);
    const [isProjectGuidanceOpen, setIsProjectGuidanceOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
            isScrolled 
            ? "bg-background/80 backdrop-blur-md border-b shadow-sm" 
            : "bg-background border-b"
        }`}>
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                
                {/* Left Section: Logo & Sidebar Trigger */}
                <div className="flex items-center gap-4">
                    {!hideSidebar && (
                        <div className="lg:hidden">
                            <SidebarTrigger />
                        </div>
                    )}
                    <Link href="/workspace" className="flex items-center gap-2 group">
                        <div className="h-9 w-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                            <Home className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent hidden sm:block">
                            KnowGrow
                        </span>
                    </Link>
                </div>

                {/* Center Section: Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                href={item.path}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                    isActive 
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                }`}
                            >
                                <item.icon className={`h-4 w-4 ${isActive ? "text-emerald-500" : ""}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Section: Actions & Profile */}
                <div className="flex items-center gap-2 md:gap-3">
                    
                    {/* Quick Tools Dropdown or Icons (Optional refinement) */}
                    <div className="hidden xl:flex items-center gap-2 mr-2 border-r pr-4">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-full"
                            onClick={() => setIsDoubtClearOpen(true)}
                            title="Doubt Clearing"
                        >
                            <HelpCircle className="h-5 w-5 text-muted-foreground" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-full"
                            onClick={() => setIsQuizGenerateOpen(true)}
                            title="Generate Quiz"
                        >
                            <FileText className="h-5 w-5 text-muted-foreground" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-full"
                            onClick={() => setIsProjectGuidanceOpen(true)}
                            title="Project Guidance"
                        >
                            <Lightbulb className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </div>

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(isDark ? 'light' : 'dark')}
                        className="h-9 w-9 rounded-full"
                    >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>

                    {/* Code Editor Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                        className={`h-9 w-9 rounded-full ${isRightSidebarOpen ? "bg-accent" : ""}`}
                    >
                        <Code className="h-5 w-5" />
                    </Button>

                    {/* User Profile */}
                    <div className="flex items-center pl-2 ml-1 border-l">
                        <UserButton 
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "h-9 w-9 border-2 border-emerald-500/20 hover:border-emerald-500/50 transition-colors"
                                }
                            }}
                        />
                    </div>

                    {/* Mobile Menu Trigger */}
                    <div className="lg:hidden ml-1">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <SheetHeader className="border-b pb-4 mb-4">
                                    <SheetTitle className="flex items-center gap-2">
                                        <div className="h-8 w-8 bg-emerald-500 rounded flex items-center justify-center text-white">
                                            <Home className="h-4 w-4" />
                                        </div>
                                        KnowGrow
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-2">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.path;
                                        return (
                                            <Link 
                                                key={item.path} 
                                                href={item.path}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                                                    isActive 
                                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                                }`}
                                            >
                                                <item.icon className={`h-5 w-5 ${isActive ? "text-emerald-500" : ""}`} />
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                    <div className="mt-6 pt-6 border-t space-y-4">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">AI Tools</p>
                                        <button 
                                            onClick={() => setIsDoubtClearOpen(true)}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                                        >
                                            <HelpCircle className="h-5 w-5" />
                                            Doubt Clearing
                                        </button>
                                        <button 
                                            onClick={() => setIsQuizGenerateOpen(true)}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                                        >
                                            <FileText className="h-5 w-5" />
                                            Generate Quiz
                                        </button>
                                        <button 
                                            onClick={() => setIsProjectGuidanceOpen(true)}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                                        >
                                            <Lightbulb className="h-5 w-5" />
                                            Project Guidance
                                        </button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            {/* Code Editor Panel */}
            {isRightSidebarOpen && (
                <div className="fixed top-16 right-0 h-[calc(100vh-64px)] w-80 bg-background border-l shadow-2xl z-40 animate-in slide-in-from-right duration-300">
                    <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                        <div className="flex items-center gap-2">
                            <Code className="h-4 w-4 text-emerald-500" />
                            <h3 className="font-semibold">Code Editor</h3>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsRightSidebarOpen(false)}
                            className="h-8 w-8 rounded-full"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="p-8 flex flex-col items-center justify-center text-center h-full">
                        <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                            <Code className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h4 className="text-lg font-medium mb-2">Editor coming soon</h4>
                        <p className="text-sm text-muted-foreground">
                            We're working on a powerful integrated code editor for your learning journey.
                        </p>
                    </div>
                </div>
            )}

            {/* Mobile Overlay for Code Editor */}
            {isRightSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsRightSidebarOpen(false)}
                />
            )}

            {/* AI Components Modals */}
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
        </header>
    );
}

export default AppHeader;
