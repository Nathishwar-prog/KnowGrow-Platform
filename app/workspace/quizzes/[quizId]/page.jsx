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
} from "../../../../@/components/ui/card";
import { Button } from "../../../../@/components/ui/button";
import { Badge } from "../../../../@/components/ui/badge";
import { Skeleton } from "../../../../@/components/ui/skeleton";
import { QuizRenderer } from "../../../../@/components/quiz/QuizRenderer";
import { 
    ChevronLeft, 
    Trash2, 
    FileQuestion, 
    Target, 
    Calendar,
    User,
    Loader2,
    AlertCircle,
    Clock,
    BookOpen
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
    
    const normalizeQuestions = () => {
        const rawQuestions = Array.isArray(quiz?.quizData) 
            ? quiz.quizData 
            : quiz?.quizData?.questions || [];
        
        return rawQuestions.map((q, idx) => ({
            id: q.id || idx,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            hint: q.hint,
            type: q.type,
            difficulty: q.difficulty,
            code: q.code || q.codeExample,
            codeExample: q.code || q.codeExample
        }));
    };

    const questions = normalizeQuestions();
    const quizMetadata = quiz?.quizData || {};

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

            <Card className="mb-8 border-2 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CardTitle className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {quiz?.title}
                            </CardTitle>
                            <CardDescription className="text-lg">{quiz?.description || quizMetadata.description}</CardDescription>
                        </div>
                        <Badge className="px-3 py-1 text-sm bg-blue-100 text-blue-800 border-blue-200">
                            {quiz?.difficulty}
                        </Badge>
                    </div>
                </div>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 border-t border-b">
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
                                <p className="font-medium">{questions.length} total</p>
                            </div>
                        </div>
                        {quizMetadata.estimatedTime && (
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-orange-500" />
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Est. Time</p>
                                    <p className="font-medium">{quizMetadata.estimatedTime}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-green-500" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Created By</p>
                                <p className="font-medium truncate max-w-[200px]">{quiz?.userEmail}</p>
                            </div>
                        </div>
                    </div>

                    {quizMetadata.learningObjectives && quizMetadata.learningObjectives.length > 0 && (
                        <div className="mt-6 bg-white/60 dark:bg-black/30 rounded-xl p-6">
                            <h4 className="font-bold mb-3 flex items-center gap-2 text-lg">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Learning Objectives
                            </h4>
                            <ul className="space-y-2">
                                {quizMetadata.learningObjectives.map((objective, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        <span className="text-sm">{objective}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>

            <QuizRenderer 
                questions={questions}
                mode="attempt"
                showAnswers={false}
            />
            
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
