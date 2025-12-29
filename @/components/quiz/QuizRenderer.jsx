"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { 
    CheckCircle, 
    XCircle, 
    AlertCircle, 
    Sparkles, 
    Target, 
    Award,
    Code2,
    Copy,
    Check
} from "lucide-react";

const CodeBlock = ({ code, language = 'javascript' }) => {
    const [copied, setCopied] = useState(false);

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code');
        }
    };

    return (
        <div className="relative group">
            <div className="absolute top-2 right-2 z-10">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyCode}
                    className="h-8 w-8 p-0 bg-slate-700 hover:bg-slate-600"
                >
                    {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3 text-slate-300" />}
                </Button>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
                    <Code2 className="h-4 w-4 text-blue-400" />
                    <span className="text-xs text-slate-400 font-mono">{language}</span>
                </div>
                <pre className="text-sm">
                    <code className="text-slate-100 font-mono">{code}</code>
                </pre>
            </div>
        </div>
    );
};

const getQuestionIcon = (type) => {
    const icons = {
        'multiple_choice': { icon: '📝', bg: 'bg-blue-500/10', color: 'text-blue-500' },
        'true_false': { icon: '✓', bg: 'bg-green-500/10', color: 'text-green-500' },
        'fill_blank': { icon: '✏️', bg: 'bg-purple-500/10', color: 'text-purple-500' },
        'short_answer': { icon: '💭', bg: 'bg-pink-500/10', color: 'text-pink-500' },
        'code': { icon: '💻', bg: 'bg-orange-500/10', color: 'text-orange-500' },
        'default': { icon: '❓', bg: 'bg-gray-500/10', color: 'text-gray-500' }
    };
    return icons[type] || icons.default;
};

const getDifficultyConfig = (difficulty) => {
    const configs = {
        'easy': { 
            color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
            icon: '🌱'
        },
        'medium': { 
            color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
            icon: '⚡'
        },
        'hard': { 
            color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800',
            icon: '🔥'
        }
    };
    return configs[difficulty?.toLowerCase()] || configs.medium;
};

export function QuizRenderer({ 
    questions = [], 
    mode = "attempt",
    showAnswers = false,
    onSubmit,
    onRetake
}) {
    const [userAnswers, setUserAnswers] = useState({});
    const [submitted, setSubmitted] = useState(showAnswers);

    const handleAnswerChange = (questionId, answer) => {
        if (submitted) return;
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleTextChange = (questionId, value) => {
        if (submitted) return;
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = () => {
        if (Object.keys(userAnswers).length < questions.length) {
            if (!confirm("You haven't answered all questions. Submit anyway?")) {
                return;
            }
        }
        setSubmitted(true);
        if (onSubmit) {
            onSubmit(userAnswers);
        }
    };

    const handleRetake = () => {
        setUserAnswers({});
        setSubmitted(false);
        if (onRetake) {
            onRetake();
        }
    };

    const calculateScore = () => {
        if (!submitted) return { correct: 0, total: 0, percentage: 0 };
        
        const correct = questions.filter((q, idx) => {
            const qId = q.id || idx;
            const userAnswer = userAnswers[qId];
            const correctAnswer = q.correctAnswer;
            
            if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
                return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
            }
            return userAnswer === correctAnswer;
        }).length;
        
        const total = questions.length;
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
        
        return { correct, total, percentage };
    };

    const getScoreMessage = (percentage) => {
        if (percentage >= 90) return { text: "Outstanding! 🎉", color: "text-green-500" };
        if (percentage >= 70) return { text: "Great Job! 🌟", color: "text-blue-500" };
        if (percentage >= 50) return { text: "Good Effort! 💪", color: "text-yellow-500" };
        return { text: "Keep Learning! 📚", color: "text-orange-500" };
    };

    const score = calculateScore();
    const scoreMessage = getScoreMessage(score.percentage);

    const isAnswerCorrect = (question, questionId) => {
        const userAnswer = userAnswers[questionId];
        const correctAnswer = question.correctAnswer;
        
        if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
            return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
        }
        return userAnswer === correctAnswer;
    };

    const normalizeOptions = (question) => {
        if (Array.isArray(question.options)) {
            return question.options;
        }
        if (question.options && typeof question.options === 'object') {
            return Object.entries(question.options).map(([key, value]) => ({
                key,
                value,
                display: `${key}. ${value}`
            }));
        }
        return [];
    };

    const getQuestionType = (question) => {
        if (question.type) return question.type;
        if (question.options && (Array.isArray(question.options) || typeof question.options === 'object')) {
            return 'multiple_choice';
        }
        return 'short_answer';
    };

    return (
        <div className="space-y-6">
            {submitted && (
                <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/30 animate-in fade-in slide-in-from-top-4 duration-500">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full mb-4">
                                <Award className="h-12 w-12 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className={`text-3xl font-bold ${scoreMessage.color}`}>
                                {scoreMessage.text}
                            </h3>
                            <p className="text-xl text-green-700 dark:text-green-300 mb-4 mt-2">
                                You scored <span className="font-extrabold text-4xl mx-2">{score.correct}</span> out of <span className="font-bold">{score.total}</span>
                            </p>
                            <div className="w-full max-w-md bg-green-200 dark:bg-green-900 rounded-full h-4 mb-6">
                                <div 
                                    className="bg-green-600 h-4 rounded-full transition-all duration-1000" 
                                    style={{ width: `${score.percentage}%` }}
                                />
                            </div>
                            <div className="text-center mb-4">
                                <div className="text-5xl font-bold text-primary">{score.percentage}%</div>
                                <div className="text-sm text-muted-foreground mt-1">Score</div>
                            </div>
                            <Button 
                                variant="outline" 
                                onClick={handleRetake}
                                className="bg-white hover:bg-green-100 border-green-300 text-green-800 font-bold dark:bg-green-950 dark:hover:bg-green-900 dark:text-green-300"
                            >
                                <Target className="h-4 w-4 mr-2" />
                                Retake Quiz
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-6">
                {questions.map((question, index) => {
                    const questionId = question.id || index;
                    const iconData = getQuestionIcon(getQuestionType(question));
                    const difficultyData = getDifficultyConfig(question.difficulty);
                    const isCorrect = submitted && isAnswerCorrect(question, questionId);
                    const questionType = getQuestionType(question);
                    const options = normalizeOptions(question);

                    return (
                        <Card key={questionId} className={`border-2 transition-all duration-300 hover:shadow-lg ${
                            submitted 
                                ? (isCorrect ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' : 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20') 
                                : 'hover:border-primary/50'
                        }`}>
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className={`p-3 ${iconData.bg} rounded-xl`}>
                                            <span className="text-2xl">{iconData.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CardTitle className="text-lg font-bold">
                                                    Question {index + 1}
                                                </CardTitle>
                                                {submitted && (
                                                    isCorrect ? 
                                                        <CheckCircle className="h-5 w-5 text-green-500" /> : 
                                                        <XCircle className="h-5 w-5 text-red-500" />
                                                )}
                                            </div>
                                            <CardDescription className="text-base font-medium text-foreground">
                                                {question.question}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    {question.difficulty && (
                                        <Badge className={`${difficultyData.color} px-3 py-1 font-semibold`}>
                                            {difficultyData.icon} {question.difficulty}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {(questionType === 'multiple_choice' || questionType === 'true_false') && options.length > 0 && (
                                    <div className="space-y-3">
                                        {Array.isArray(question.options) ? (
                                            question.options.map((option, optionIndex) => {
                                                const optionLetter = String.fromCharCode(65 + optionIndex);
                                                const isSelected = userAnswers[questionId] === option;
                                                const isCorrectOption = submitted && option === question.correctAnswer;
                                                const isWrongSelected = submitted && isSelected && !isCorrectOption;

                                                return (
                                                    <label 
                                                        key={optionIndex} 
                                                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                                            submitted 
                                                                ? isCorrectOption 
                                                                    ? 'border-green-500 bg-green-50 dark:bg-green-950/30' 
                                                                    : isWrongSelected 
                                                                        ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                                                                        : 'border-border bg-muted/30'
                                                                : isSelected
                                                                    ? 'border-primary bg-primary/10 shadow-md'
                                                                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                                        } ${submitted ? 'cursor-default' : ''}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${questionId}`}
                                                            value={option}
                                                            checked={isSelected}
                                                            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
                                                            disabled={submitted}
                                                            className="w-5 h-5 accent-primary"
                                                        />
                                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                                                            submitted && isCorrectOption
                                                                ? 'bg-green-500 text-white'
                                                                : isSelected
                                                                    ? 'bg-primary text-primary-foreground'
                                                                    : 'bg-muted text-muted-foreground'
                                                        }`}>
                                                            {optionLetter}
                                                        </div>
                                                        <span className="flex-1 font-medium">{option}</span>
                                                        {submitted && isCorrectOption && (
                                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                                        )}
                                                        {submitted && isWrongSelected && (
                                                            <XCircle className="h-5 w-5 text-red-500" />
                                                        )}
                                                    </label>
                                                );
                                            })
                                        ) : (
                                            Object.entries(question.options).map(([key, value]) => {
                                                const isSelected = userAnswers[questionId] === key;
                                                const isCorrectOption = submitted && key === question.correctAnswer;
                                                const isWrongSelected = submitted && isSelected && !isCorrectOption;

                                                return (
                                                    <label 
                                                        key={key} 
                                                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                                            submitted 
                                                                ? isCorrectOption 
                                                                    ? 'border-green-500 bg-green-50 dark:bg-green-950/30' 
                                                                    : isWrongSelected 
                                                                        ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                                                                        : 'border-border bg-muted/30'
                                                                : isSelected
                                                                    ? 'border-primary bg-primary/10 shadow-md'
                                                                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                                        } ${submitted ? 'cursor-default' : ''}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${questionId}`}
                                                            value={key}
                                                            checked={isSelected}
                                                            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
                                                            disabled={submitted}
                                                            className="w-5 h-5 accent-primary"
                                                        />
                                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                                                            submitted && isCorrectOption
                                                                ? 'bg-green-500 text-white'
                                                                : isSelected
                                                                    ? 'bg-primary text-primary-foreground'
                                                                    : 'bg-muted text-muted-foreground'
                                                        }`}>
                                                            {key}
                                                        </div>
                                                        <span className="flex-1 font-medium">{value}</span>
                                                        {submitted && isCorrectOption && (
                                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                                        )}
                                                        {submitted && isWrongSelected && (
                                                            <XCircle className="h-5 w-5 text-red-500" />
                                                        )}
                                                    </label>
                                                );
                                            })
                                        )}
                                    </div>
                                )}

                                {(questionType === 'short_answer' || questionType === 'fill_blank' || questionType === 'code') && (
                                    <div className="space-y-2">
                                        <Input
                                            placeholder={questionType === 'code' ? "Write your code answer..." : "Type your answer here..."}
                                            value={userAnswers[questionId] || ''}
                                            onChange={(e) => handleTextChange(questionId, e.target.value)}
                                            disabled={submitted}
                                            className={`h-12 text-base border-2 ${questionType === 'code' ? 'font-mono' : ''}`}
                                        />
                                    </div>
                                )}

                                {question.codeExample && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                            <Code2 className="h-4 w-4" />
                                            Code Example:
                                        </div>
                                        <CodeBlock code={question.codeExample} />
                                    </div>
                                )}

                                {submitted && (
                                    <div className={`mt-4 p-6 rounded-xl border-2 space-y-4 ${
                                        isCorrect 
                                            ? 'bg-green-50 dark:bg-green-950/30 border-green-500' 
                                            : 'bg-red-50 dark:bg-red-950/30 border-red-500'
                                    }`}>
                                        <div className="flex items-center gap-3">
                                            {isCorrect ? (
                                                <>
                                                    <CheckCircle className="h-6 w-6 text-green-500" />
                                                    <span className="font-bold text-lg text-green-700 dark:text-green-400">
                                                        Correct! Well done! 🎉
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-6 w-6 text-red-500" />
                                                    <span className="font-bold text-lg text-red-700 dark:text-red-400">
                                                        Not quite right
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        
                                        {!isCorrect && userAnswers[questionId] && (
                                            <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                                                <div className="text-sm font-semibold text-muted-foreground mb-1">Your Answer:</div>
                                                <div className="font-medium">{userAnswers[questionId]}</div>
                                            </div>
                                        )}

                                        <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                                            <div className="text-sm font-semibold text-muted-foreground mb-1">Correct Answer:</div>
                                            <div className="font-bold text-green-600 dark:text-green-400">
                                                {question.correctAnswer}
                                            </div>
                                        </div>

                                        {question.explanation && (
                                            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <div className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-1">
                                                            Explanation:
                                                        </div>
                                                        <div className="text-sm leading-relaxed">{question.explanation}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {question.hint && (
                                            <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                                                <div className="flex items-start gap-2">
                                                    <Sparkles className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <div className="text-sm font-bold text-purple-700 dark:text-purple-400 mb-1">
                                                            Hint:
                                                        </div>
                                                        <div className="text-sm text-muted-foreground leading-relaxed">
                                                            {question.hint}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {!submitted && questions.length > 0 && (
                <div className="flex justify-center pt-6">
                    <Button
                        onClick={handleSubmit}
                        disabled={Object.keys(userAnswers).length === 0}
                        size="lg"
                        className="px-12 h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
                    >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Submit Quiz
                    </Button>
                </div>
            )}
        </div>
    );
}

export default QuizRenderer;
