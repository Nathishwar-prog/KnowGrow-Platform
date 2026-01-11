"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { Users, BookOpen, FileQuestion, TrendingUp } from "lucide-react";
import axios from "axios";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        courses: 0,
        quizzes: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const headers = { Authorization: `Bearer ${token}` };

            const [usersRes, coursesRes, quizzesRes] = await Promise.all([
                axios.get("/api/admin/users", { headers }),
                axios.get("/api/admin/courses", { headers }),
                axios.get("/api/admin/quizzes", { headers })
            ]);

            setStats({
                users: usersRes.data.count || 0,
                courses: coursesRes.data.count || 0,
                quizzes: quizzesRes.data.count || 0
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const statCards = [
        {
            title: "Total Users",
            value: stats.users,
            icon: Users,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-900/20"
        },
        {
            title: "Total Courses",
            value: stats.courses,
            icon: BookOpen,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50 dark:bg-green-900/20"
        },
        {
            title: "Total Quizzes",
            value: stats.quizzes,
            icon: FileQuestion,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-900/20"
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
                <p className="text-muted-foreground">Welcome to the admin dashboard. Here's a quick overview of your platform.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-5 w-5 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{isLoading ? "..." : stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <TrendingUp className="h-3 w-3 inline mr-1" />
                                Active in platform
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Manage your platform resources</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a href="/admin/dashboard/users" className="p-4 border-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <Users className="h-6 w-6 mb-2 text-blue-500" />
                            <h3 className="font-semibold">Manage Users</h3>
                            <p className="text-sm text-muted-foreground">View, edit, and delete users</p>
                        </a>
                        <a href="/admin/dashboard/courses" className="p-4 border-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <BookOpen className="h-6 w-6 mb-2 text-green-500" />
                            <h3 className="font-semibold">Manage Courses</h3>
                            <p className="text-sm text-muted-foreground">View and manage all courses</p>
                        </a>
                        <a href="/admin/dashboard/quizzes" className="p-4 border-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <FileQuestion className="h-6 w-6 mb-2 text-purple-500" />
                            <h3 className="font-semibold">Manage Quizzes</h3>
                            <p className="text-sm text-muted-foreground">View and manage all quizzes</p>
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

