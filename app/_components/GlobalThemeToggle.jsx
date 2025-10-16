"use client"
import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

function GlobalThemeToggle(){
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';
    return (
        <button
            aria-label="Toggle theme"
            onClick={()=> setTheme(isDark ? 'light' : 'dark')}
            className="fixed top-3 right-3 h-9 w-9 inline-flex items-center justify-center rounded-md border bg-card hover:bg-accent transition-colors z-[60] md:top-4 md:right-4"
        >
            {isDark ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
        </button>
    )
}

export default GlobalThemeToggle;


