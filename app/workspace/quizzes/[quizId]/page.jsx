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

    const [userAnswers, setUserAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (quizId) {
            fetchQuiz();
        }
    }, [quizId]);

    const handleAnswerSelect = (questionIdx, answerKey) => {
        if (isSubmitted) return;
        setUserAnswers(prev => ({
            ...prev,
            [questionIdx]: answerKey
        }));
    };

    const handleSubmitQuiz = () => {
        if (Object.keys(userAnswers).length < questions.length) {
            if (!confirm("You haven't answered all questions. Submit anyway?")) {
                return;
            }
        }

        let calculatedScore = 0;
        questions.forEach((q, idx) => {
            if (userAnswers[idx] === q.correctAnswer) {
                calculatedScore++;
            }
        });

        setScore(calculatedScore);
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRestart = () => {
        setUserAnswers({});
        setIsSubmitted(false);
        setScore(0);
    };

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

            {isSubmitted && (
                <Card className="mb-8 border-2 border-green-500 bg-green-50 animate-in fade-in slide-in-from-top-4 duration-500">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-green-100 p-4 rounded-full mb-4">
                                <CheckCircle2 className="h-12 w-12 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-green-800 mb-2">Quiz Completed!</h2>
                            <p className="text-xl text-green-700 mb-4">
                                You scored <span className="font-extrabold text-4xl mx-2">{score}</span> out of <span className="font-bold">{questions.length}</span>
                            </p>
                            <div className="w-full max-w-md bg-green-200 rounded-full h-4 mb-6">
                                <div 
                                    className="bg-green-600 h-4 rounded-full transition-all duration-1000" 
                                    style={{ width: `${(score / questions.length) * 100}%` }}
                                ></div>
                            </div>
                            <Button 
                                variant="outline" 
                                onClick={handleRestart}
                                className="bg-white hover:bg-green-100 border-green-300 text-green-800 font-bold"
                            >
                                Retake Quiz
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

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
                    <Card key={idx} className={`overflow-hidden transition-all duration-300 ${
                        isSubmitted 
                        ? (userAnswers[idx] === q.correctAnswer ? 'border-green-300 shadow-green-50' : 'border-red-200 shadow-red-50')
                        : 'hover:border-blue-300'
                    }`}>
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
                                    const isSelected = userAnswers[idx] === key;
                                    const isCorrect = key === q.correctAnswer;
                                    const showResult = isSubmitted;

                                    let bgColor = "bg-background";
                                    let borderColor = "border-muted";
                                    let textColor = "text-foreground";

                                    if (showResult) {
                                        if (isCorrect) {
                                            bgColor = "bg-green-100";
                                            borderColor = "border-green-500";
                                            textColor = "text-green-900";
                                        } else if (isSelected && !isCorrect) {
                                            bgColor = "bg-red-100";
                                            borderColor = "border-red-500";
                                            textColor = "text-red-900";
                                        }
                                    } else if (isSelected) {
                                        bgColor = "bg-blue-50";
                                        borderColor = "border-blue-500";
                                        textColor = "text-blue-900";
                                    }

                                    return (
                                        <button 
                                            key={key}
                                            disabled={isSubmitted}
                                            onClick={() => handleAnswerSelect(idx, key)}
                                            className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all text-left w-full ${bgColor} ${borderColor} ${textColor} ${
                                                !isSubmitted && "hover:bg-muted/50 cursor-pointer"
                                            }`}
                                        >
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0 ${
                                                isSelected || (showResult && isCorrect)
                                                ? (isCorrect && showResult ? 'bg-green-600 text-white' : 'bg-blue-600 text-white')
                                                : 'bg-muted text-muted-foreground'
                                            }`}>
                                                {key}
                                            </span>
                                            <span className="flex-grow font-medium">{value}</span>
                                            
                                            {showResult && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                                            {showResult && isSelected && !isCorrect && <AlertCircle className="h-5 w-5 text-red-600" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {isSubmitted && q.explanation && (
                                <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-xl animate-in slide-in-from-bottom-2">
                                    <p className="text-sm font-bold text-blue-800 mb-1 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        Explanation:
                                    </p>
                                    <p className="text-sm text-blue-700 leading-relaxed">
                                        {q.explanation}
                                    </p>
                                    <p className="text-xs font-bold mt-2 text-green-700">
                                        Correct Answer: {q.correctAnswer}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {!isSubmitted && (
                <div className="mt-12 flex justify-center">
                    <Button 
                        size="lg" 
                        onClick={handleSubmitQuiz}
                        className="px-12 py-6 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
                    >
                        Submit Quiz
                    </Button>
                </div>
            )}
            
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
