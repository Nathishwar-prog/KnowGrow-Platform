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
    Check,
    ChevronRight,
    Trophy,
    CheckCircle2
} from "lucide-react";
import MarkdownRenderer from "../../../app/workspace/_components/MarkdownRenderer";

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
        if (percentage >= 90) return { text: "Elite Achievement! 🏆", color: "text-emerald-500" };
        if (percentage >= 70) return { text: "Strong Performance! 🚀", color: "text-primary" };
        if (percentage >= 50) return { text: "Solid Foundation! 💪", color: "text-amber-500" };
        return { text: "Keep Pushing! 📚", color: "text-rose-500" };
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
        <div className="space-y-12">
            {submitted && (
                <div className="animate-in fade-in slide-in-from-top-12 duration-1000">
                    <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-primary/10 via-background to-background p-12 border-2 border-primary/20 shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-[32px] bg-primary/20 flex items-center justify-center mb-8 shadow-inner border border-primary/30 transform hover:rotate-12 transition-transform duration-500">
                                <Trophy className="h-12 w-12 text-primary" />
                            </div>
                            
                            <h3 className={`text-5xl font-black tracking-tighter mb-4 ${scoreMessage.color}`}>
                                {scoreMessage.text}
                            </h3>
                            
                            <div className="flex items-baseline gap-3 mb-8">
                                <span className="text-7xl font-black text-foreground">{score.percentage}%</span>
                                <span className="text-2xl font-black text-muted-foreground uppercase tracking-widest">Accuracy</span>
                            </div>

                            <div className="w-full max-w-xl bg-muted/50 rounded-full h-4 mb-10 overflow-hidden border border-border/50">
                                <div 
                                    className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" 
                                    style={{ width: `${score.percentage}%` }}
                                />
                            </div>

                            <p className="text-2xl font-bold text-muted-foreground mb-12">
                                You mastered <span className="text-foreground font-black">{score.correct}</span> out of <span className="text-foreground font-black">{score.total}</span> concepts
                            </p>

                            <Button 
                                size="lg"
                                onClick={handleRetake}
                                className="h-16 px-12 rounded-3xl bg-primary text-primary-foreground font-black text-lg uppercase tracking-widest shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95"
                            >
                                <Target className="h-6 w-6 mr-3" />
                                Retake Challenge
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-10">
                {questions.map((question, index) => {
                    const questionId = question.id || index;
                    const iconData = getQuestionIcon(getQuestionType(question));
                    const difficultyData = getDifficultyConfig(question.difficulty);
                    const isCorrect = submitted && isAnswerCorrect(question, questionId);
                    const questionType = getQuestionType(question);
                    const options = normalizeOptions(question);

                    return (
                        <div key={questionId} className={`group relative animate-in slide-in-from-bottom-8 fade-in duration-700 [animation-delay:${index * 100}ms]`}>
                            <div className={`absolute -inset-0.5 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/30 via-transparent to-primary/30 blur-2xl ${submitted ? (isCorrect ? 'from-emerald-500/20' : 'from-rose-500/20') : ''}`} />
                            
                            <Card className={`relative border-2 transition-all duration-500 rounded-[40px] overflow-hidden ${
                                submitted 
                                    ? (isCorrect ? 'border-emerald-500/30 bg-emerald-500/[0.02]' : 'border-rose-500/30 bg-rose-500/[0.02]') 
                                    : 'border-border/60 hover:border-primary/40 bg-card/40 backdrop-blur-sm'
                            }`}>
                                <CardHeader className="p-10 pb-6">
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex items-start gap-6 flex-1">
                                            <div className={`w-16 h-16 rounded-2xl ${iconData.bg} flex items-center justify-center flex-shrink-0 shadow-inner border border-black/5`}>
                                                <span className="text-3xl">{iconData.icon}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Module {index + 1}</span>
                                                    {submitted && (
                                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isCorrect ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                                                            {isCorrect ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                            {isCorrect ? 'Validated' : 'Incorrect'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-2xl font-black text-foreground tracking-tight leading-tight">
                                                    <MarkdownRenderer content={question.question} />
                                                </div>
                                                
                                                {(question.code || question.codeExample) && (
                                                    <div className="mt-6 relative group/code">
                                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl blur opacity-50 group-hover/code:opacity-100 transition duration-500" />
                                                        <pre className="relative bg-slate-900 text-slate-100 rounded-xl p-6 overflow-x-auto text-sm font-mono border border-white/10 shadow-2xl scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                                            <code>{question.code || question.codeExample}</code>
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {question.difficulty && (
                                            <Badge variant="outline" className={`rounded-2xl px-5 py-2 text-[10px] font-black uppercase tracking-widest border-2 ${difficultyData.color}`}>
                                                {difficultyData.icon} {question.difficulty}
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="p-10 pt-0 space-y-8">
                                    {(questionType === 'multiple_choice' || questionType === 'true_false') && options.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {Array.isArray(question.options) ? (
                                                question.options.map((option, optionIndex) => {
                                                    const optionLetter = String.fromCharCode(65 + optionIndex);
                                                    const isSelected = userAnswers[questionId] === option;
                                                    const isCorrectOption = submitted && option === question.correctAnswer;
                                                    const isWrongSelected = submitted && isSelected && !isCorrectOption;

                                                    return (
                                                        <label 
                                                            key={optionIndex} 
                                                            className={`group/opt flex items-center gap-5 p-6 rounded-[32px] border-2 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                                                                submitted 
                                                                    ? isCorrectOption 
                                                                        ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]' 
                                                                        : isWrongSelected 
                                                                            ? 'border-rose-500 bg-rose-500/10'
                                                                            : 'border-border/40 bg-muted/20 opacity-60'
                                                                    : isSelected
                                                                        ? 'border-primary bg-primary/10 shadow-[0_20px_40px_-12px_rgba(var(--primary),0.2)] scale-[1.02]'
                                                                        : 'border-border/60 hover:border-primary/30 hover:bg-muted/40 hover:-translate-y-1'
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
                                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
                                                                submitted && isCorrectOption
                                                                    ? 'bg-emerald-500 text-white'
                                                                    : isSelected
                                                                        ? 'bg-primary text-primary-foreground'
                                                                        : 'bg-muted/80 text-muted-foreground group-hover/opt:bg-primary/20 group-hover/opt:text-primary'
                                                            }`}>
                                                                {optionLetter}
                                                            </div>
                                                            <span className="flex-1 font-bold text-lg tracking-tight">
                                                                <MarkdownRenderer content={option} />
                                                            </span>
                                                            
                                                            {submitted && isCorrectOption && <CheckCircle className="h-6 w-6 text-emerald-500 animate-in zoom-in duration-300" />}
                                                            {submitted && isWrongSelected && <XCircle className="h-6 w-6 text-rose-500 animate-in zoom-in duration-300" />}
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
                                                            className={`group/opt flex items-center gap-5 p-6 rounded-[32px] border-2 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                                                                submitted 
                                                                    ? isCorrectOption 
                                                                        ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]' 
                                                                        : isWrongSelected 
                                                                            ? 'border-rose-500 bg-rose-500/10'
                                                                            : 'border-border/40 bg-muted/20 opacity-60'
                                                                    : isSelected
                                                                        ? 'border-primary bg-primary/10 shadow-[0_20px_40px_-12px_rgba(var(--primary),0.2)] scale-[1.02]'
                                                                        : 'border-border/60 hover:border-primary/30 hover:bg-muted/40 hover:-translate-y-1'
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
                                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
                                                                submitted && isCorrectOption
                                                                    ? 'bg-emerald-500 text-white'
                                                                    : isSelected
                                                                        ? 'bg-primary text-primary-foreground'
                                                                        : 'bg-muted/80 text-muted-foreground group-hover/opt:bg-primary/20 group-hover/opt:text-primary'
                                                            }`}>
                                                                {key}
                                                            </div>
                                                            <span className="flex-1 font-bold text-lg tracking-tight">
                                                                <MarkdownRenderer content={value} />
                                                            </span>
                                                        </label>
                                                    );
                                                })
                                            )}
                                        </div>
                                    )}

                                    {(questionType === 'short_answer' || questionType === 'fill_blank' || questionType === 'code') && (
                                        <div className="relative group/input">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/5 rounded-[28px] blur opacity-0 group-focus-within/input:opacity-100 transition-opacity" />
                                            <Input
                                                placeholder={questionType === 'code' ? "Implement your logic here..." : "Analyze and provide your insight..."}
                                                value={userAnswers[questionId] || ''}
                                                onChange={(e) => handleTextChange(questionId, e.target.value)}
                                                disabled={submitted}
                                                className={`relative h-20 px-8 text-xl border-2 rounded-[24px] bg-background/50 backdrop-blur-sm transition-all duration-300 focus:border-primary/50 focus:ring-0 font-bold tracking-tight ${questionType === 'code' ? 'font-mono' : ''}`}
                                            />
                                        </div>
                                    )}

                                    {submitted && (
                                        <div className="animate-in slide-in-from-top-4 duration-700 space-y-6">
                                            <div className={`p-8 rounded-[32px] border-2 space-y-6 ${
                                                isCorrect 
                                                    ? 'bg-emerald-500/5 border-emerald-500/20' 
                                                    : 'bg-rose-500/5 border-rose-500/20'
                                            }`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isCorrect ? 'bg-emerald-500/20 text-emerald-600' : 'bg-rose-500/20 text-rose-600'}`}>
                                                        {isCorrect ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                                                    </div>
                                                    <div>
                                                        <span className={`text-[11px] font-black uppercase tracking-[0.2em] block mb-1 ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>System Feedback</span>
                                                        <span className="text-xl font-black">{isCorrect ? 'Absolute Precision! 🎉' : 'Conceptual Divergence Found'}</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-background/40 p-5 rounded-2xl border border-border/50">
                                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-2">Your Answer</span>
                                                        <p className="font-bold text-lg">{userAnswers[questionId] || 'No input detected'}</p>
                                                    </div>
                                                    <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20">
                                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2">Expected Logic</span>
                                                        <div className="font-black text-lg text-emerald-700 dark:text-emerald-400">
                                                            <MarkdownRenderer content={question.correctAnswer} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {question.explanation && (
                                                    <div className="bg-primary/5 p-8 rounded-[28px] border border-primary/20 relative overflow-hidden group/exp">
                                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/exp:opacity-20 transition-opacity">
                                                            <Sparkles className="h-12 w-12 text-primary" />
                                                        </div>
                                                        <div className="relative z-10">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <AlertCircle className="h-5 w-5 text-primary" />
                                                                <span className="text-sm font-black text-primary uppercase tracking-[0.2em]">Deep Learning Insight</span>
                                                            </div>
                                                            <div className="text-[16px] leading-relaxed text-foreground/80 font-medium">
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
                        </div>
                    );
                })}
            </div>

            {!submitted && questions.length > 0 && (
                <div className="flex flex-col items-center gap-6 py-12 animate-in fade-in duration-1000">
                    <div className="flex items-center gap-3 px-6 py-2 bg-muted/40 rounded-full border border-border/50 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        {Object.keys(userAnswers).length} of {questions.length} Concepts Mapped
                    </div>
                    
                    <Button
                        onClick={handleSubmit}
                        disabled={Object.keys(userAnswers).length === 0}
                        className="h-20 px-16 rounded-[32px] bg-primary text-primary-foreground font-black text-xl uppercase tracking-widest shadow-[0_32px_64px_-16px_rgba(var(--primary),0.4)] transition-all hover:scale-105 active:scale-95 hover:shadow-[0_48px_80px_-16px_rgba(var(--primary),0.5)] group"
                    >
                        Analyze & Finalize Quiz
                        <ChevronRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform" />
                    </Button>
                </div>
            )}
        </div>
    );
}

export default QuizRenderer;
