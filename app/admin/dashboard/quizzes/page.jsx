"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../@/components/ui/card";
import { Button } from "../../../../@/components/ui/button";
import { Input } from "../../../../@/components/ui/input";
import { Search, Loader2, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../../../../@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "../../../../@/components/ui/alert-dialog";

export default function QuizzesManagement() {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredQuizzes(quizzes);
    } else {
      const filtered = quizzes.filter(
        (quiz) =>
          quiz.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          quiz.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          quiz.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredQuizzes(filtered);
    }
  }, [searchQuery, quizzes]);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/quizzes");
      const data = await response.json();
      if (data.success) {
        setQuizzes(data.quizzes);
        setFilteredQuizzes(data.quizzes);
      } else {
        toast.error(data.error || "Failed to fetch quizzes");
      }
    } catch (error) {
      toast.error("Failed to fetch quizzes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const response = await fetch(
        `/api/admin/quizzes?quizId=${deleteConfirm.quizId}`,
        { method: "DELETE" }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Quiz deleted successfully");
        fetchQuizzes();
      } else {
        toast.error(data.error || "Failed to delete quiz");
      }
    } catch (error) {
      toast.error("Failed to delete quiz");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: "bg-emerald-100 text-emerald-800",
      medium: "bg-amber-100 text-amber-800",
      hard: "bg-rose-100 text-rose-800"
    };
    return colors[difficulty?.toLowerCase()] || colors.medium;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
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
          ) : filteredQuizzes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No quizzes found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Quiz</th>
                    <th className="text-left p-3">Topic</th>
                    <th className="text-left p-3">Difficulty</th>
                    <th className="text-left p-3">Questions</th>
                    <th className="text-left p-3">Creator</th>
                    <th className="text-left p-3">Created</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuizzes.map((quiz) => (
                    <tr
                      key={quiz.quizId}
                      className="border-b hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <td className="p-3">
                        <p className="font-medium">{quiz.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {quiz.description || "No description"}
                        </p>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{quiz.topic}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty}
                        </Badge>
                      </td>
                      <td className="p-3">{quiz.questionCount}</td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {quiz.userEmail}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(quiz.createdAt)}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => setDeleteConfirm(quiz)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm?.title}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
