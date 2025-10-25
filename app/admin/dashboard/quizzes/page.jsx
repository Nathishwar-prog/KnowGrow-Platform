"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../@/components/ui/card";
import { Button } from "../../../../@/components/ui/button";
import { Input } from "../../../../@/components/ui/input";
import { Search, Loader2, Trash2, Eye } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Badge } from "../../../../@/components/ui/badge";

export default function QuizzesManagement() {
    const [quizzes, setQuizzes] = useState([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredQuizzes(quizzes);
        } else {
            const filtered = quizzes.filter(quiz =>
                quiz.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                quiz.topic?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredQuizzes(filtered);
        }
    }, [searchQuery, quizzes]);

    const fetchQuizzes = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const response = await axios.get("/api/admin/quizzes", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setQuizzes(response.data.quizzes);
                setFilteredQuizzes(response.data.quizzes);
            }
        } catch (error) {
            toast.error("Failed to fetch quizzes");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (quizId) => {
        if (!confirm("Are you sure you want to delete this quiz?")) return;

        try {
            const token = localStorage.getItem("adminToken");
            const response = await axios.delete(`/api/admin/quizzes?quizId=${quizId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                toast.success("Quiz deleted successfully");
                fetchQuizzes();
            }
        } catch (error) {
            toast.error("Failed to delete quiz");
        }
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            'easy': 'bg-emerald-100 text-emerald-800',
            'medium': 'bg-amber-100 text-amber-800',
            'hard': 'bg-rose-100 text-rose-800'
        };
        return colors[difficulty] || colors.medium;
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold">Quizzes Management</h2>
                <p className="text-muted-foreground">Manage all platform quizzes</p>
            </div>

            <div className="flex gap-3 max-w-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search quizzes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Quizzes ({filteredQuizzes.length})</CardTitle>
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
                                        <th className="text-left p-3">Title</th>
                                        <th className="text-left p-3">Topic</th>
                                        <th className="text-left p-3">Difficulty</th>
                                        <th className="text-left p-3">Questions</th>
                                        <th className="text-left p-3">Creator</th>
                                        <th className="text-right p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredQuizzes.map((quiz) => (
                                        <tr key={quiz.quizId} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                                            <td className="p-3 font-medium">{quiz.title}</td>
                                            <td className="p-3">
                                                <Badge variant="outline">{quiz.topic}</Badge>
                                            </td>
                                            <td className="p-3">
                                                <Badge className={getDifficultyColor(quiz.difficulty)}>
                                                    {quiz.difficulty}
                                                </Badge>
                                            </td>
                                            <td className="p-3">{quiz.questionCount}</td>
                                            <td className="p-3 text-sm text-muted-foreground">{quiz.userEmail}</td>
                                            <td className="p-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-700"
                                                        onClick={() => handleDelete(quiz.quizId)}
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

