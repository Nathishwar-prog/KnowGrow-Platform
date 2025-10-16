"use client"
import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "../../../@/components/ui/sidebar";
import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

function Appheader({hideSidebar=false}){
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';
    return (
        <div className='p-4 flex justify-between items-center shadow-sm border-b sticky top-0 bg-background z-50'> 
            <div className='flex items-center gap-3'>
                {!hideSidebar && <SidebarTrigger />}
                <span className="text-sm font-medium text-muted-foreground hidden md:block">Workspace</span>
            </div>
            <div className='flex items-center gap-3'>
                <button
                  aria-label="Toggle theme"
                  onClick={()=> setTheme(isDark ? 'light' : 'dark')}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-md border bg-card hover:bg-accent transition-colors"
                >
                  {isDark ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
                </button>
                <UserButton/>
            </div>
        </div>
    )
}

export default Appheader;