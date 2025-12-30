"use client";

import React, { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  BrainCircuit, 
  Lightbulb, 
  HelpCircle, 
  Code, 
  Sun, 
  Moon,
  Home,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { Button } from "../../../@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../@/components/ui/sheet";

// --- Sub-component: NavActionItem ---
const NavActionItem = ({ name, icon: Icon, path, isActive }) => {
  return (
    <Link
      href={path}
      className={`relative group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
        isActive 
          ? "bg-primary/10 text-primary shadow-sm" 
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
      aria-label={name}
    >
      <Icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-primary" : ""}`} />
      <span className="font-semibold text-sm tracking-tight">{name}</span>
      {isActive && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full animate-in fade-in zoom-in duration-300" />
      )}
    </Link>
  );
};

// --- Sub-component: UtilityButton ---
const UtilityButton = ({ icon: Icon, onClick, isActive, label, title }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`h-10 w-10 rounded-xl transition-all duration-300 ${isActive ? "bg-accent text-primary shadow-inner" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
      aria-label={label}
      title={title}
    >
      <Icon className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
    </Button>
  );
};

// --- Sub-component: UserProfileDropdown ---
const UserProfileDropdown = () => {
  return (
    <div className="flex items-center pl-2 ml-1 border-l border-border/50">
      <UserButton 
        afterSignOutUrl="/"
        appearance={{
          elements: {
            userButtonAvatarBox: "h-9 w-9 border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 shadow-sm"
          }
        }}
      />
    </div>
  );
};

// --- Main Component: WorkspaceNavbar ---
export default function WorkspaceNavbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false); // Local state for demo purposes

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const aiActions = [
    { name: "AI Quiz", icon: BrainCircuit, path: "/workspace/ai-quiz" },
    { name: "Project Guidance", icon: Lightbulb, path: "/workspace/project-guidance" },
    { name: "Doubt Clarification", icon: HelpCircle, path: "/workspace/doubt-clarification" },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? "bg-background/80 backdrop-blur-xl border-b shadow-lg shadow-black/5" 
        : "bg-background border-b"
    }`}>
      <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
        
        {/* LEFT: Logo */}
        <div className="flex items-center">
          <Link href="/workspace" className="flex items-center gap-2 group mr-8">
            <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent hidden sm:block">
              KnowGrow
            </span>
          </Link>
        </div>

        {/* CENTER: AI Main Actions (Desktop) */}
        <nav className="hidden md:flex items-center gap-2">
          {aiActions.map((action) => (
            <NavActionItem 
              key={action.path}
              {...action}
              isActive={pathname === action.path}
            />
          ))}
        </nav>

        {/* RIGHT: Utilities & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          <div className="flex items-center gap-1.5 sm:gap-2 pr-1 sm:pr-2">
            <UtilityButton 
              icon={Code} 
              onClick={() => setIsEditorOpen(!isEditorOpen)}
              isActive={isEditorOpen}
              label="Toggle Code Editor"
              title="Code Editor"
            />
            
            <UtilityButton 
              icon={theme === "dark" ? Sun : Moon} 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              label="Toggle Theme"
              title="Toggle Theme"
            />
          </div>

          <UserProfileDropdown />

          {/* Mobile Menu */}
          <div className="md:hidden ml-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full border-b shadow-2xl rounded-b-[32px] animate-in slide-in-from-top duration-500">
                <SheetHeader className="pb-6 border-b border-border/50">
                  <SheetTitle className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span className="font-black tracking-tighter uppercase text-lg">AI Tools</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="py-8 flex flex-col gap-3">
                  {aiActions.map((action) => {
                    const isActive = pathname === action.path;
                    return (
                      <Link 
                        key={action.path} 
                        href={action.path}
                        className={`flex items-center justify-between px-6 py-5 rounded-[20px] transition-all duration-300 ${
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105" 
                            : "bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <action.icon className="h-6 w-6" />
                          <span className="font-bold text-lg">{action.name}</span>
                        </div>
                        <Sparkles className={`h-4 w-4 ${isActive ? "opacity-100 animate-pulse" : "opacity-0"}`} />
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
