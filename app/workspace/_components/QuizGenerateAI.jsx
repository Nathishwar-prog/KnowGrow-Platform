"use client";
import React, { useState } from "react";
import { Button } from "../../../@/components/ui/button";
import { Input } from "../../../@/components/ui/input";
import { ScrollArea } from "../../../@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { Badge } from "../../../@/components/ui/badge";
import { Bot, CheckCircle, XCircle, Clock, Target, Loader2, Copy, Check, Sparkles, Award, TrendingUp, BookOpen, Code2, AlertCircle } from "lucide-react";

const QuizGenerateAI = ({ isOpen, onClose }) => {
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [copiedQuizId, setCopiedQuizId] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState({});

  const [formData, setFormData] = useState({
    topic: "",
    difficulty: "medium",
    questionCount: 5,
    questionTypes: ["multiple_choice", "short_answer"]
  });

  const generateQuiz = async () => {
    if (!formData.topic.trim()) return;

    setIsLoading(true);
    setQuizData(null);
    setUserAnswers({});
    setShowResults(false);
    setSelectedAnswer({});

    try {
      const response = await fetch('/api/quiz-generate-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setQuizData(data.quiz);
        
        // Save quiz to database only if generation was successful
        await saveQuizToDatabase(data.quiz);
      } else {
        throw new Error(data.error || 'Failed to generate quiz');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveQuizToDatabase = async (quiz) => {
    try {
      const quizId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId,
          title: quiz.title || formData.topic,
          description: quiz.description || "",
          topic: formData.topic,
          difficulty: formData.difficulty,
          questionCount: quiz.totalQuestions || quiz.questions.length,
          quizData: quiz
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log('Quiz saved to database successfully');
      } else {
        const errorMsg = data.error || 'Failed to save quiz to database';
        console.error('Quiz save error:', errorMsg);
        // Optionally notify user via a non-intrusive way if needed, 
        // but the prompt says "Don't show error to user, just log it" was already there.
        // However, I'll ensure it logs clearly.
      }
    } catch (error) {
      console.error('Network or Server Error saving quiz:', error);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    setSelectedAnswer(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setQuizData(null);
    setUserAnswers({});
    setShowResults(false);
    setSelectedAnswer({});
  };

  const copyQuizToClipboard = async () => {
    if (!quizData) return;
    
    const quizText = `Quiz: ${quizData.title}\n\n${quizData.description}\n\n` +
      quizData.questions.map((q, i) => 
        `${i + 1}. ${q.question}\n${q.options ? q.options.map((opt, j) => `   ${String.fromCharCode(65 + j)}. ${opt}`).join('\n') : ''}\n`
      ).join('\n');
    
    try {
      await navigator.clipboard.writeText(quizText);
      setCopiedQuizId(true);
      setTimeout(() => setCopiedQuizId(null), 2000);
    } catch (err) {
      console.error('Failed to copy quiz: ', err);
    }
  };

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
    return configs[difficulty] || configs.medium;
  };

  const calculateScore = () => {
    if (!quizData || !showResults) return { correct: 0, total: 0, percentage: 0 };
    
    const correct = quizData.questions.filter(q => 
      userAnswers[q.id] === q.correctAnswer
    ).length;
    const total = quizData.questions.length;
    const percentage = Math.round((correct / total) * 100);
    
    return { correct, total, percentage };
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 90) return { text: "Outstanding! 🎉", color: "text-green-500" };
    if (percentage >= 70) return { text: "Great Job! 🌟", color: "text-blue-500" };
    if (percentage >= 50) return { text: "Good Effort! 💪", color: "text-yellow-500" };
    return { text: "Keep Learning! 📚", color: "text-orange-500" };
  };

  if (!isOpen) return null;

  const score = calculateScore();
  const scoreMessage = getScoreMessage(score.percentage);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-border/50">
        {/* Enhanced Header */}
        <div className="relative p-6 border-b bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Quiz Generate AI
                </h2>
                <p className="text-sm text-muted-foreground">Powered by Ruixen AI Modal</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-destructive/10">
              <span className="text-2xl">×</span>
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          {!quizData ? (
            /* Enhanced Quiz Generation Form */
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-4">
                
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Generate Your Quiz
                </h3>
                <p className="text-muted-foreground text-lg">
                  Create a comprehensive quiz on any topic with AI-powered questions
                </p>
              </div>

              <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Quiz Configuration
                  </CardTitle>
                  <CardDescription>
                    Customize your quiz based on your learning needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      Topic
                    </label>
                    <Input
                      value={formData.topic}
                      onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                      placeholder="e.g., React Hooks, Machine Learning, Data Structures..."
                      className="w-full h-12 text-lg border-2 focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Difficulty Level
                      </label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                      >
                        <SelectTrigger className="h-12 border-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">🌱 Easy - Beginner Friendly</SelectItem>
                          <SelectItem value="medium">⚡ Medium - Intermediate</SelectItem>
                          <SelectItem value="hard">🔥 Hard - Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        Number of Questions
                      </label>
                      <Select
                        value={formData.questionCount.toString()}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, questionCount: parseInt(value) }))}
                      >
                        <SelectTrigger className="h-12 border-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 Questions - Quick Quiz</SelectItem>
                          <SelectItem value="5">5 Questions - Standard</SelectItem>
                          <SelectItem value="10">10 Questions - Comprehensive</SelectItem>
                          <SelectItem value="15">15 Questions - Expert Level</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={generateQuiz}
                      disabled={!formData.topic.trim() || isLoading}
                      className="w-full md:w-auto px-8 h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Generating Your Quiz...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Generate Quiz
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Enhanced Quiz Display */
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Enhanced Quiz Header */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-8 border-2 border-border/50">
                <div className="relative z-10 text-center space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {quizData.title}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyQuizToClipboard}
                      className="rounded-full hover:bg-white/50 transition-colors"
                    >
                      {copiedQuizId ? 
                        <Check className="h-5 w-5 text-green-500" /> : 
                        <Copy className="h-5 w-5" />
                      }
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    {quizData.description}
                  </p>
                  
                  <div className="flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold">{quizData.totalQuestions} Questions</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span className="font-semibold">{quizData.estimatedTime}</span>
                    </div>
                  </div>

                  {quizData.learningObjectives && (
                    <div className="bg-white/60 dark:bg-black/30 rounded-xl p-6 text-left max-w-2xl mx-auto">
                      <h4 className="font-bold mb-3 flex items-center gap-2 text-lg">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Learning Objectives
                      </h4>
                      <ul className="space-y-2">
                        {quizData.learningObjectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Score Display (if results shown) */}
              {showResults && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 p-8 border-2 border-border/50">
                  <div className="text-center space-y-4">
                    <Award className="h-16 w-16 mx-auto text-yellow-500" />
                    <h3 className={`text-3xl font-bold ${scoreMessage.color}`}>
                      {scoreMessage.text}
                    </h3>
                    <div className="flex items-center justify-center gap-8">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-primary">{score.percentage}%</div>
                        <div className="text-sm text-muted-foreground mt-1">Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold">{score.correct}/{score.total}</div>
                        <div className="text-sm text-muted-foreground mt-1">Correct Answers</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Questions */}
              <div className="space-y-6">
                {quizData.questions.map((question, index) => {
                  const iconData = getQuestionIcon(question.type);
                  const difficultyData = getDifficultyConfig(question.difficulty);
                  const isCorrect = showResults && userAnswers[question.id] === question.correctAnswer;
                  const isAnswered = userAnswers[question.id] !== undefined;

                  return (
                    <Card key={question.id} className={`border-2 transition-all duration-300 hover:shadow-lg ${
                      showResults ? (isCorrect ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' : 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20') : 'hover:border-primary/50'
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
                                {showResults && (
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
                          <Badge className={`${difficultyData.color} px-3 py-1 font-semibold`}>
                            {difficultyData.icon} {question.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Multiple Choice Options */}
                        {question.type === 'multiple_choice' && question.options && (
                          <div className="space-y-3">
                            {question.options.map((option, optionIndex) => {
                              const optionLetter = String.fromCharCode(65 + optionIndex);
                              const isSelected = selectedAnswer[question.id] === option;
                              const isCorrectOption = showResults && option === question.correctAnswer;
                              const isWrongSelected = showResults && isSelected && !isCorrectOption;

                              return (
                                <label 
                                  key={optionIndex} 
                                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                    showResults 
                                      ? isCorrectOption 
                                        ? 'border-green-500 bg-green-50 dark:bg-green-950/30' 
                                        : isWrongSelected 
                                          ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                                          : 'border-border bg-muted/30'
                                      : isSelected
                                        ? 'border-primary bg-primary/10 shadow-md'
                                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    value={option}
                                    checked={isSelected}
                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    disabled={showResults}
                                    className="w-5 h-5 accent-primary"
                                  />
                                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                                    showResults && isCorrectOption
                                      ? 'bg-green-500 text-white'
                                      : isSelected
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground'
                                  }`}>
                                    {optionLetter}
                                  </div>
                                  <span className="flex-1 font-medium">{option}</span>
                                  {showResults && isCorrectOption && (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  )}
                                  {showResults && isWrongSelected && (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                  )}
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {/* True/False Options */}
                        {question.type === 'true_false' && (
                          <div className="space-y-3">
                            {['true', 'false'].map((value) => {
                              const isSelected = selectedAnswer[question.id] === value;
                              const isCorrectOption = showResults && value === question.correctAnswer;
                              const isWrongSelected = showResults && isSelected && !isCorrectOption;

                              return (
                                <label 
                                  key={value}
                                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                    showResults 
                                      ? isCorrectOption 
                                        ? 'border-green-500 bg-green-50 dark:bg-green-950/30' 
                                        : isWrongSelected 
                                          ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                                          : 'border-border bg-muted/30'
                                      : isSelected
                                        ? 'border-primary bg-primary/10 shadow-md'
                                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    value={value}
                                    checked={isSelected}
                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    disabled={showResults}
                                    className="w-5 h-5 accent-primary"
                                  />
                                  <span className="flex-1 font-semibold capitalize text-lg">
                                    {value === 'true' ? '✓ True' : '✗ False'}
                                  </span>
                                  {showResults && isCorrectOption && (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  )}
                                  {showResults && isWrongSelected && (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                  )}
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {/* Short Answer / Fill in Blank */}
                        {(question.type === 'short_answer' || question.type === 'fill_blank') && (
                          <div className="space-y-2">
                            <Input
                              placeholder="Type your answer here..."
                              value={userAnswers[question.id] || ''}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              disabled={showResults}
                              className="h-12 text-base border-2"
                            />
                          </div>
                        )}

                        {/* Code Example Display - Show for any question that has codeExample */}
                        {question.codeExample && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                              <Code2 className="h-4 w-4" />
                              Code Example:
                            </div>
                            <CodeBlock code={question.codeExample} />
                          </div>
                        )}

                        {/* Code Question Input - Only for code type questions */}
                        {question.type === 'code' && (
                          <div className="space-y-2">
                            <Input
                              placeholder="Write your code answer..."
                              value={userAnswers[question.id] || ''}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              disabled={showResults}
                              className="h-12 text-base border-2 font-mono"
                            />
                          </div>
                        )}

                        {/* Results Display */}
                        {showResults && (
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
                            
                            {!isCorrect && userAnswers[question.id] && (
                              <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                                <div className="text-sm font-semibold text-muted-foreground mb-1">Your Answer:</div>
                                <div className="font-medium">{userAnswers[question.id]}</div>
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

              {/* Enhanced Action Buttons */}
              <div className="flex justify-center gap-4 pb-8">
                {!showResults ? (
                  <Button
                    onClick={submitQuiz}
                    disabled={Object.keys(userAnswers).length === 0}
                    size="lg"
                    className="px-12 h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Submit Quiz
                  </Button>
                ) : (
                  <div className="flex gap-4 flex-wrap justify-center">
                    <Button 
                      onClick={resetQuiz} 
                      variant="outline"
                      size="lg"
                      className="px-8 h-14 text-lg font-semibold border-2 hover:bg-primary/10 transition-all duration-300"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate New Quiz
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowResults(false);
                        setUserAnswers({});
                        setSelectedAnswer({});
                      }}
                      size="lg"
                      className="px-8 h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                      <Target className="h-5 w-5 mr-2" />
                      Retake Quiz
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default QuizGenerateAI;