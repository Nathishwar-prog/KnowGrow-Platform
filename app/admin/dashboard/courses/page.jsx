"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../@/components/ui/card";
import { Button } from "../../../../@/components/ui/button";
import { Input } from "../../../../@/components/ui/input";
import { Search, Loader2, Trash2, Eye } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Badge } from "../../../../@/components/ui/badge";

export default function CoursesManagement() {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredCourses(courses);
        } else {
            const filtered = courses.filter(course =>
                course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.category?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredCourses(filtered);
        }
    }, [searchQuery, courses]);

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const response = await axios.get("/api/admin/courses", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setCourses(response.data.courses);
                setFilteredCourses(response.data.courses);
            }
        } catch (error) {
            toast.error("Failed to fetch courses");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (cid) => {
        if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;

        try {
            const token = localStorage.getItem("adminToken");
            const response = await axios.delete(`/api/admin/courses?cid=${cid}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                toast.success("Course deleted successfully");
                fetchCourses();
            }
        } catch (error) {
            toast.error("Failed to delete course");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold">Courses Management</h2>
                <p className="text-muted-foreground">Manage all platform courses</p>
            </div>

            <div className="flex gap-3 max-w-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Courses ({filteredCourses.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3">Course Name</th>
                                        <th className="text-left p-3">Category</th>
                                        <th className="text-left p-3">Level</th>
                                        <th className="text-left p-3">Chapters</th>
                                        <th className="text-left p-3">Creator</th>
                                        <th className="text-right p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCourses.map((course) => (
                                        <tr key={course.cid} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                                            <td className="p-3 font-medium">{course.name || "Untitled"}</td>
                                            <td className="p-3">
                                                <Badge variant="outline">{course.category || "N/A"}</Badge>
                                            </td>
                                            <td className="p-3">
                                                <Badge className={
                                                    course.level === "Beginner" ? "bg-green-100 text-green-800" :
                                                    course.level === "Intermediate" ? "bg-yellow-100 text-yellow-800" :
                                                    "bg-red-100 text-red-800"
                                                }>
                                                    {course.level}
                                                </Badge>
                                            </td>
                                            <td className="p-3">{course.noOfChapters || 0}</td>
                                            <td className="p-3 text-sm text-muted-foreground">{course.userEmail}</td>
                                            <td className="p-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(`/workspace/view-course/${course.cid}`, '_blank')}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-700"
                                                        onClick={() => handleDelete(course.cid)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

