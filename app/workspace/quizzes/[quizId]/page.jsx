"use client"

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from "../../../@/components/ui/card";
import { Button } from "../../../@/components/ui/button";
import { Badge } from "../../../@/components/ui/badge";
import { Skeleton } from "../../../@/components/ui/skeleton";
import { 
    ChevronLeft, 
    Trash2, 
    FileQuestion, 
    Target, 
    Calendar,
    User,
    Loader2,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

function QuizViewPage() {
    const { quizId } = useParams();
    const router = useRouter();
    const { user } = useUser();
    const [quiz, setQuiz] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (quizId) {
            fetchQuiz();
        }
    }, [quizId]);

    const fetchQuiz = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`/api/quizzes/${quizId}`);
            if (response.data.success) {
                setQuiz(response.data.quiz);
            } else {
                setError(response.data.error || "Failed to load quiz");
            }
        } catch (err) {
            console.error("Error fetching quiz:", err);
            setError(err.response?.data?.error || "Failed to load quiz");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
            return;
        }

        try {
            setIsDeleting(true);
            const response = await axios.delete(`/api/quizzes/${quizId}`);
            if (response.data.success) {
                toast.success("Quiz deleted successfully");
                router.push("/workspace/quizzes");
            } else {
                toast.error(response.data.error || "Failed to delete quiz");
            }
        } catch (err) {
            console.error("Error deleting quiz:", err);
            toast.error(err.response?.data?.error || "Failed to delete quiz");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-8 w-48" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-10 w-3/4 mb-2" />
                        <Skeleton className="h-6 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-xl" />
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                        <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
                        <p className="text-red-600 mb-6">{error}</p>
                        <Button onClick={() => router.push("/workspace/quizzes")}>
                            Back to Quizzes
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isOwner = quiz?.createdBy === user?.id;
    const questions = Array.isArray(quiz?.quizData) ? quiz.quizData : quiz?.quizData?.questions || [];

    return (
        <div className="p-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-6">
                <Button 
                    variant="ghost" 
                    onClick={() => router.push("/workspace/quizzes")}
                    className="flex items-center gap-2"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Quizzes
                </Button>

                {isOwner && (
                    <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2"
                    >
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        Delete Quiz
                    </Button>
                )}
            </div>

            <Card className="mb-8 border-2 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CardTitle className="text-3xl font-bold mb-2">{quiz?.title}</CardTitle>
                            <CardDescription className="text-lg">{quiz?.description}</CardDescription>
                        </div>
                        <Badge className="px-3 py-1 text-sm bg-blue-100 text-blue-800 border-blue-200">
                            {quiz?.difficulty}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-b">
                        <div className="flex items-center gap-3">
                            <Target className="h-5 w-5 text-purple-500" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Topic</p>
                                <p className="font-medium">{quiz?.topic}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FileQuestion className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Questions</p>
                                <p className="font-medium">{quiz?.questionCount} total</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-green-500" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Created By</p>
                                <p className="font-medium truncate max-w-[200px]">{quiz?.userEmail}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Quiz Content
            </h2>

            <div className="space-y-6">
                {questions.map((q, idx) => (
                    <Card key={idx} className="overflow-hidden hover:border-blue-300 transition-colors">
                        <div className="bg-muted/30 p-4 border-b">
                            <h3 className="font-bold flex gap-3 text-lg">
                                <span className="flex-shrink-0 bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
                                    {idx + 1}
                                </span>
                                {q.question}
                            </h3>
                        </div>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(q.options || {}).map(([key, value]) => {
                                    const isCorrect = key === q.correctAnswer;
                                    return (
                                        <div 
                                            key={key}
                                            className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                                                isCorrect 
                                                ? 'bg-green-50 border-green-200 text-green-900' 
                                                : 'bg-background border-muted'
                                            }`}
                                        >
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0 ${
                                                isCorrect ? 'bg-green-200 text-green-700' : 'bg-muted text-muted-foreground'
                                            }`}>
                                                {key}
                                            </span>
                                            <span className="flex-grow">{value}</span>
                                            {isCorrect && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                                        </div>
                                    );
                                })}
                            </div>
                            {q.explanation && (
                                <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                                    <p className="text-sm font-bold text-blue-800 mb-1 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        Explanation:
                                    </p>
                                    <p className="text-sm text-blue-700 leading-relaxed">
                                        {q.explanation}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            <div className="mt-10 text-center text-muted-foreground">
                <p className="flex items-center justify-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    Quiz generated on {new Date(quiz?.createdAt).toLocaleDateString()} at {new Date(quiz?.createdAt).toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
}

export default QuizViewPage;
