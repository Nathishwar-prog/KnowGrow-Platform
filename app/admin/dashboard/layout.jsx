"use client"

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
    LayoutDashboard, 
    Users, 
    BookOpen, 
    FileQuestion, 
    LogOut, 
    Menu, 
    X,
    Shield
} from "lucide-react";
import { Button } from "../../../@/components/ui/button";
import { toast } from "sonner";

export default function AdminDashboardLayout({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminData, setAdminData] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (token) verifyAdmin();
        else router.push("/admin/login");
    }, []);
    

    const verifyAdmin = async () => {
        const token = localStorage.getItem("adminToken");
        const storedAdminData = localStorage.getItem("adminData");

        if (!token) {
            router.push("/admin/login");
            return;
        }

        try {
            const response = await fetch("/api/admin/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "verify",
                    token
                }),
            });

            const data = await response.json();

            if (data.success) {
                setIsAdmin(true);
                setAdminData(data.admin);
            } else {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminData");
                router.push("/admin/login");
            }
        } catch (error) {
            console.error("Verification error:", error);
            router.push("/admin/login");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        toast.success("Logged out successfully");
        router.push("/admin/login");
    };

    const menuItems = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            path: "/admin/dashboard"
        },
        {
            title: "Users",
            icon: Users,
            path: "/admin/dashboard/users"
        },
        {
            title: "Courses",
            icon: BookOpen,
            path: "/admin/dashboard/courses"
        },
        {
            title: "Quizzes",
            icon: FileQuestion,
            path: "/admin/dashboard/quizzes"
        }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Shield className="h-12 w-12 animate-pulse mx-auto text-blue-500" />
                    <p className="mt-4 text-muted-foreground">Verifying access...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <header className="bg-white dark:bg-slate-800 border-b sticky top-0 z-50">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden"
                        >
                            {isSidebarOpen ? <X /> : <Menu />}
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                                <p className="text-xs text-muted-foreground">KnowGrow Platform</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold">{adminData?.name}</p>
                            <p className="text-xs text-muted-foreground">{adminData?.email}</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="flex items-center gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 border-r transition-transform duration-300 ease-in-out`}>
                    <nav className="p-4 space-y-2 mt-4">
                        {menuItems.map((item, index) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={index}
                                    href={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                                            : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                    }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.title}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}

