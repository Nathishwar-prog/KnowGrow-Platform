"use client";

import React, { useState, useEffect, useRef } from "react";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Book, 
  Compass, 
  FileQuestion, 
  PencilRulerIcon, 
  BookOpen, 
  WalletCards, 
  UserCircle2Icon,
  BrainCircuit, 
  Lightbulb, 
  HelpCircle, 
  BarChart3,
  Code, 
  Sun, 
  Moon,
  ChevronDown,
  Sparkles,
  FileText,
  Library,
  Menu,
  X,
  Plus
} from "lucide-react";
import { Button } from "../../../@/components/ui/button";
import AddNewCourseDialog from "./AddNewCourseDialog";

// --- Sub-component: NavDropdownItem ---
const NavDropdownItem = ({ title, icon: Icon, path, isActive, onClick }) => {
  return (
    <Link
      href={path}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${
        isActive 
          ? "bg-primary/10 text-primary shadow-sm" 
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      <Icon className={`h-4.5 w-4.5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
      <span>{title}</span>
      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
    </Link>
  );
};

// --- Sub-component: DirectNavItem ---
const DirectNavItem = ({ title, icon: Icon, path, isActive }) => {
  return (
    <Link
      href={path}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
        isActive 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden lg:inline">{title}</span>
    </Link>
  );
};

// --- Sub-component: WorkspaceNavDropdown (with Hover) ---
const WorkspaceNavDropdown = ({ label, items, pathname }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const hasActiveItem = items.some(item => pathname === item.path || (item.path !== '/workspace' && pathname.startsWith(item.path)));

  return (
    <div 
      className="relative" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
          hasActiveItem 
            ? "bg-primary/5 text-primary" 
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        }`}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-60 bg-background border rounded-2xl shadow-2xl p-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col gap-1">
            {items.map((item) => (
              <NavDropdownItem 
                key={item.path} 
                {...item} 
                isActive={pathname === item.path || (item.path !== '/workspace' && pathname.startsWith(item.path))}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-component: CreateCourseButton ---
const CreateCourseButton = () => {
  return (
    <AddNewCourseDialog>
      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-4 h-10 gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
        <Plus className="h-5 w-5" />
        <span className="hidden sm:inline">Create Course</span>
      </Button>
    </AddNewCourseDialog>
  );
};

// --- Main Component: WorkspaceNavbar ---
export default function WorkspaceNavbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const workspaceItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/workspace' },
    { title: 'My Learning', icon: Book, path: '/workspace/my-learning' },
    { title: 'Explore Courses', icon: Compass, path: '/workspace/explore' },
    { title: 'Quizzes', icon: FileQuestion, path: '/workspace/quizzes' },
    { title: 'AI Tools', icon: PencilRulerIcon, path: '/workspace/ai-tools' },
  ];

  const directItems = [
    { title: 'AI Quiz', icon: BrainCircuit, path: '/workspace/ai-quiz' },
    { title: 'Project Guidance', icon: Lightbulb, path: '/workspace/project-guidance' },
    { title: 'Doubt Clarification', icon: HelpCircle, path: '/workspace/doubt-clarification' },
  ];

  const resourceItems = [
    { title: 'Docs', icon: FileText, path: '/workspace/resources/docs' },
    { title: 'References', icon: Library, path: '/workspace/resources/references' },
  ];

  return (
    <header className={`sticky top-0 z-[60] w-full transition-all duration-300 ${
      isScrolled 
        ? "bg-background/80 backdrop-blur-xl border-b shadow-lg shadow-black/5" 
        : "bg-background border-b"
    }`}>
      <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LEFT: Logo & Navigation */}
        <div className="flex items-center gap-2">
          <Link href="/workspace" className="flex items-center gap-2 group mr-4 lg:mr-8">
            <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tighter hidden sm:block">
              KnowGrow
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 lg:gap-3">
            <WorkspaceNavDropdown label="Workspace" items={workspaceItems} pathname={pathname} />
            
            <div className="h-6 w-px bg-border mx-1 hidden lg:block" />
            
            <div className="flex items-center gap-1">
              {directItems.map(item => (
                <DirectNavItem key={item.path} {...item} isActive={pathname === item.path} />
              ))}
            </div>

            <div className="h-6 w-px bg-border mx-1 hidden lg:block" />

            <WorkspaceNavDropdown label="Resources" items={resourceItems} pathname={pathname} />
          </div>
        </div>

        {/* RIGHT: Utilities, Create, Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          <div className="hidden sm:flex items-center gap-2">
            <CreateCourseButton />
            
            <div className="h-6 w-px bg-border/60 mx-1" />
            
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-300"
              title="Code Editor"
            >
              <Code className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-300"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

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

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 rounded-xl hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background z-[70] overflow-y-auto p-4 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
          <div className="flex flex-col gap-4">
            <div className="px-2">
               <CreateCourseButton />
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Main</h3>
                <div className="grid grid-cols-1 gap-1">
                  {workspaceItems.map(item => (
                    <NavDropdownItem 
                      key={item.path} 
                      {...item} 
                      isActive={pathname === item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">AI Workspace</h3>
                <div className="grid grid-cols-1 gap-1">
                  {directItems.map(item => (
                    <NavDropdownItem 
                      key={item.path} 
                      {...item} 
                      isActive={pathname === item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Resources</h3>
                <div className="grid grid-cols-1 gap-1">
                  {resourceItems.map(item => (
                    <NavDropdownItem 
                      key={item.path} 
                      {...item} 
                      isActive={pathname === item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t flex items-center justify-between px-4">
                <span className="text-sm font-medium">Appearance</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-xl gap-2"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
