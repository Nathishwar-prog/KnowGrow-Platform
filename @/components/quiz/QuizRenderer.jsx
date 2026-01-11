"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { 
    CheckCircle, 
    XCircle, 
    AlertCircle, 
    Sparkles, 
    Target, 
    Trophy,
    ChevronRight,
    CheckCircle2
} from "lucide-react";
import MarkdownRenderer from "../../../app/workspace/_components/MarkdownRenderer";
import { onQuizComplete } from "../../lib/dashboardEvents";

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
            color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
            icon: '🌱'
        },
        'medium': { 
            color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
            icon: '⚡'
        },
        'hard': { 
            color: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
            icon: '🔥'
        }
    };
    return configs[difficulty?.toLowerCase()] || configs.medium;
};

function CodeBlock({ code }) {
    if (!code) return null;
    
    return (
        <div className="mt-4 relative group/code">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl blur opacity-50 group-hover/code:opacity-100 transition duration-500" />
            <pre className="relative bg-slate-900 text-slate-100 rounded-xl p-4 sm:p-6 overflow-x-auto text-xs sm:text-sm font-mono border border-white/10 shadow-xl max-w-full">
                <code className="whitespace-pre-wrap break-words sm:whitespace-pre sm:break-normal">{code}</code>
            </pre>
        </div>
    );
}

function QuestionText({ text }) {
    if (!text) return null;
    
    const codeBlockMatch = text.match(/```[\s\S]*?```/);
    if (codeBlockMatch) {
        const parts = text.split(/```[\s\S]*?```/);
        const codeContent = codeBlockMatch[0].replace(/```\w*\n?/, '').replace(/```$/, '');
        
        return (
            <div className="space-y-3">
                {parts[0] && (
                    <div className="text-base sm:text-lg md:text-xl font-bold text-foreground leading-relaxed">
                        <MarkdownRenderer content={parts[0].trim()} />
                    </div>
                )}
                <CodeBlock code={codeContent.trim()} />
                {parts[1] && (
                    <div className="text-base sm:text-lg font-medium text-foreground/80">
                        <MarkdownRenderer content={parts[1].trim()} />
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <div className="text-base sm:text-lg md:text-xl font-bold text-foreground leading-relaxed">
            <MarkdownRenderer content={text} />
        </div>
    );
}

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
        onQuizComplete();
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
        if (percentage >= 90) return { text: "Elite Achievement!", color: "text-emerald-500" };
        if (percentage >= 70) return { text: "Strong Performance!", color: "text-primary" };
        if (percentage >= 50) return { text: "Solid Foundation!", color: "text-amber-500" };
        return { text: "Keep Pushing!", color: "text-rose-500" };
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

    const getQuestionType = (question) => {
        if (question.type) return question.type;
        if (question.options && (Array.isArray(question.options) || typeof question.options === 'object')) {
            return 'multiple_choice';
        }
        return 'short_answer';
    };

    return (
        <div className="space-y-8 sm:space-y-10">
            {submitted && (
                <div className="animate-in fade-in slide-in-from-top-8 duration-700">
                    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-10 border-2 border-primary/20 shadow-xl">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 shadow-inner border border-primary/30">
                                <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                            </div>
                            
                            <h3 className={`text-2xl sm:text-4xl font-bold mb-3 ${scoreMessage.color}`}>
                                {scoreMessage.text}
                            </h3>
                            
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-4xl sm:text-6xl font-black text-foreground">{score.percentage}%</span>
                                <span className="text-lg sm:text-xl font-bold text-muted-foreground uppercase tracking-wider">Accuracy</span>
                            </div>

                            <div className="w-full max-w-md bg-muted/50 rounded-full h-3 mb-8 overflow-hidden border border-border/50">
                                <div 
                                    className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" 
                                    style={{ width: `${score.percentage}%` }}
                                />
                            </div>

                            <p className="text-lg sm:text-xl font-semibold text-muted-foreground mb-8">
                                You mastered <span className="text-foreground font-bold">{score.correct}</span> out of <span className="text-foreground font-bold">{score.total}</span> questions
                            </p>

                            <Button 
                                size="lg"
                                onClick={handleRetake}
                                className="h-12 sm:h-14 px-8 sm:px-10 rounded-2xl bg-primary text-primary-foreground font-bold text-base sm:text-lg shadow-xl transition-all hover:scale-105 active:scale-95"
                            >
                                <Target className="h-5 w-5 mr-2" />
                                Retake Quiz
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6 sm:space-y-8">
                {questions.map((question, index) => {
                    const questionId = question.id || index;
                    const iconData = getQuestionIcon(getQuestionType(question));
                    const difficultyData = getDifficultyConfig(question.difficulty);
                    const isCorrect = submitted && isAnswerCorrect(question, questionId);
                    const questionType = getQuestionType(question);
                    const hasCodeBlock = question.code || question.codeExample;

                    return (
                        <Card key={questionId} className={`relative border-2 transition-all duration-300 rounded-xl sm:rounded-2xl overflow-hidden ${
                            submitted 
                                ? (isCorrect ? 'border-emerald-500/30 bg-emerald-500/[0.02]' : 'border-rose-500/30 bg-rose-500/[0.02]') 
                                : 'border-border/60 hover:border-primary/40 bg-card/40'
                        }`}>
                            <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${iconData.bg} flex items-center justify-center flex-shrink-0 shadow-inner border border-black/5`}>
                                            <span className="text-xl sm:text-2xl">{iconData.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                                <span className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wider">Question {index + 1}</span>
                                                {submitted && (
                                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${isCorrect ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                                                        {isCorrect ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                        {isCorrect ? 'Correct' : 'Incorrect'}
                                                    </div>
                                                )}
                                            </div>
                                            <QuestionText text={question.question} />
                                            
                                            {hasCodeBlock && (
                                                <CodeBlock code={question.code || question.codeExample} />
                                            )}
                                        </div>
                                    </div>
                                    {question.difficulty && (
                                        <Badge variant="outline" className={`rounded-lg px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider border ${difficultyData.color} shrink-0`}>
                                            {difficultyData.icon} {question.difficulty}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
                                {(questionType === 'multiple_choice' || questionType === 'true_false') && question.options && (
                                    <div className="grid grid-cols-1 gap-3">
                                        {Array.isArray(question.options) ? (
                                            question.options.map((option, optionIndex) => {
                                                const optionLetter = String.fromCharCode(65 + optionIndex);
                                                const isSelected = userAnswers[questionId] === option;
                                                const isCorrectOption = submitted && option === question.correctAnswer;
                                                const isWrongSelected = submitted && isSelected && !isCorrectOption;

                                                return (
                                                    <label 
                                                        key={optionIndex} 
                                                        className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                                            submitted 
                                                                ? isCorrectOption 
                                                                    ? 'border-emerald-500 bg-emerald-500/10' 
                                                                    : isWrongSelected 
                                                                        ? 'border-rose-500 bg-rose-500/10'
                                                                        : 'border-border/40 bg-muted/20 opacity-60'
                                                                : isSelected
                                                                    ? 'border-primary bg-primary/10'
                                                                    : 'border-border/60 hover:border-primary/30 hover:bg-muted/40'
                                                        } ${submitted ? 'cursor-default' : ''}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${questionId}`}
                                                            value={option}
                                                            checked={isSelected}
                                                            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
                                                            disabled={submitted}
                                                            className="hidden"
                                                        />
                                                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-200 shrink-0 ${
                                                            submitted && isCorrectOption
                                                                ? 'bg-emerald-500 text-white'
                                                                : isSelected
                                                                    ? 'bg-primary text-primary-foreground'
                                                                    : 'bg-muted/80 text-muted-foreground'
                                                        }`}>
                                                            {optionLetter}
                                                        </div>
                                                        <span className="flex-1 font-medium text-sm sm:text-base leading-relaxed pt-1">
                                                            <MarkdownRenderer content={option} />
                                                        </span>
                                                        
                                                        {submitted && isCorrectOption && <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-1" />}
                                                        {submitted && isWrongSelected && <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-1" />}
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
                                                        className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                                            submitted 
                                                                ? isCorrectOption 
                                                                    ? 'border-emerald-500 bg-emerald-500/10' 
                                                                    : isWrongSelected 
                                                                        ? 'border-rose-500 bg-rose-500/10'
                                                                        : 'border-border/40 bg-muted/20 opacity-60'
                                                                : isSelected
                                                                    ? 'border-primary bg-primary/10'
                                                                    : 'border-border/60 hover:border-primary/30 hover:bg-muted/40'
                                                        } ${submitted ? 'cursor-default' : ''}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${questionId}`}
                                                            value={key}
                                                            checked={isSelected}
                                                            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
                                                            disabled={submitted}
                                                            className="hidden"
                                                        />
                                                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-200 shrink-0 ${
                                                            submitted && isCorrectOption
                                                                ? 'bg-emerald-500 text-white'
                                                                : isSelected
                                                                    ? 'bg-primary text-primary-foreground'
                                                                    : 'bg-muted/80 text-muted-foreground'
                                                        }`}>
                                                            {key}
                                                        </div>
                                                        <span className="flex-1 font-medium text-sm sm:text-base leading-relaxed pt-1">
                                                            <MarkdownRenderer content={value} />
                                                        </span>
                                                    </label>
                                                );
                                            })
                                        )}
                                    </div>
                                )}

                                {(questionType === 'short_answer' || questionType === 'fill_blank' || questionType === 'code') && (
                                    <div className="relative">
                                        <Input
                                            placeholder={questionType === 'code' ? "Enter your answer..." : "Type your answer..."}
                                            value={userAnswers[questionId] || ''}
                                            onChange={(e) => handleTextChange(questionId, e.target.value)}
                                            disabled={submitted}
                                            className={`h-12 sm:h-14 px-4 sm:px-6 text-base border-2 rounded-xl bg-background/50 transition-all duration-200 focus:border-primary/50 focus:ring-0 font-medium ${questionType === 'code' ? 'font-mono' : ''}`}
                                        />
                                    </div>
                                )}

                                {submitted && (
                                    <div className="animate-in slide-in-from-top-4 duration-500 space-y-4">
                                        <div className={`p-4 sm:p-6 rounded-xl border-2 space-y-4 ${
                                            isCorrect 
                                                ? 'bg-emerald-500/5 border-emerald-500/20' 
                                                : 'bg-rose-500/5 border-rose-500/20'
                                        }`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isCorrect ? 'bg-emerald-500/20 text-emerald-600' : 'bg-rose-500/20 text-rose-600'}`}>
                                                    {isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <span className={`text-xs font-bold uppercase tracking-wider block mb-0.5 ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>Feedback</span>
                                                    <span className="text-base sm:text-lg font-bold">{isCorrect ? 'Correct!' : 'Not quite right'}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="bg-background/40 p-3 sm:p-4 rounded-xl border border-border/50">
                                                    <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Your Answer</span>
                                                    <p className="font-semibold text-sm sm:text-base break-words">{userAnswers[questionId] || 'No answer provided'}</p>
                                                </div>
                                                <div className="bg-emerald-500/10 p-3 sm:p-4 rounded-xl border border-emerald-500/20">
                                                    <span className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1.5">Correct Answer</span>
                                                    <div className="font-bold text-sm sm:text-base text-emerald-700 dark:text-emerald-400 break-words">
                                                        <MarkdownRenderer content={question.correctAnswer} />
                                                    </div>
                                                </div>
                                            </div>

                                            {question.explanation && (
                                                <div className="bg-primary/5 p-4 sm:p-6 rounded-xl border border-primary/20 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-3 opacity-10">
                                                        <Sparkles className="h-8 w-8 text-primary" />
                                                    </div>
                                                    <div className="relative z-10">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <AlertCircle className="h-4 w-4 text-primary" />
                                                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Explanation</span>
                                                        </div>
                                                        <div className="text-sm sm:text-base leading-relaxed text-foreground/80 font-medium">
                                                            <MarkdownRenderer content={question.explanation} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {!submitted && questions.length > 0 && (
                <div className="flex flex-col items-center gap-4 py-8">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-muted/40 rounded-full border border-border/50 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        {Object.keys(userAnswers).length} of {questions.length} answered
                    </div>
                    
                    <Button
                        onClick={handleSubmit}
                        disabled={Object.keys(userAnswers).length === 0}
                        className="h-14 sm:h-16 px-10 sm:px-14 rounded-2xl bg-primary text-primary-foreground font-bold text-base sm:text-lg shadow-xl transition-all hover:scale-105 active:scale-95 group"
                    >
                        Submit Quiz
                        <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            )}
        </div>
    );
}

export default QuizRenderer;
