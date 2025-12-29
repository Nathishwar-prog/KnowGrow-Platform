"use client";
import React, { useState } from "react";
import { Button } from "../../../@/components/ui/button";
import { Input } from "../../../@/components/ui/input";
import { ScrollArea } from "../../../@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { QuizRenderer } from "../../../@/components/quiz/QuizRenderer";
import { Bot, Clock, Target, Loader2, Copy, Check, Sparkles, TrendingUp, BookOpen, CheckCircle } from "lucide-react";

const QuizGenerateAI = ({ isOpen, onClose }) => {
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedQuizId, setCopiedQuizId] = useState(null);

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
        console.error('Quiz save error:', data.error || 'Failed to save quiz to database');
      }
    } catch (error) {
      console.error('Network or Server Error saving quiz:', error);
    }
  };

  const resetQuiz = () => {
    setQuizData(null);
  };

  const copyQuizToClipboard = async () => {
    if (!quizData) return;
    
    const quizText = `Quiz: ${quizData.title}\n\n${quizData.description}\n\n` +
      quizData.questions.map((q, i) => 
        `${i + 1}. ${q.question}\n${q.options ? (Array.isArray(q.options) ? q.options.map((opt, j) => `   ${String.fromCharCode(65 + j)}. ${opt}`).join('\n') : Object.entries(q.options).map(([k, v]) => `   ${k}. ${v}`).join('\n')) : ''}\n`
      ).join('\n');
    
    try {
      await navigator.clipboard.writeText(quizText);
      setCopiedQuizId(true);
      setTimeout(() => setCopiedQuizId(null), 2000);
    } catch (err) {
      console.error('Failed to copy quiz: ', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-border/50">
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
                        <Sparkles className="h-4 w-4 text-primary" />
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
            <div className="max-w-5xl mx-auto space-y-6">
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
                      <span className="font-semibold">{quizData.totalQuestions || quizData.questions?.length} Questions</span>
                    </div>
                    {quizData.estimatedTime && (
                      <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <span className="font-semibold">{quizData.estimatedTime}</span>
                      </div>
                    )}
                  </div>

                  {quizData.learningObjectives && quizData.learningObjectives.length > 0 && (
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

              <QuizRenderer 
                questions={quizData.questions || []}
                mode="preview"
                showAnswers={false}
                onRetake={() => {}}
              />

              <div className="flex justify-center gap-4 pb-8">
                <Button 
                  onClick={resetQuiz} 
                  variant="outline"
                  size="lg"
                  className="px-8 h-14 text-lg font-semibold border-2 hover:bg-primary/10 transition-all duration-300"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate New Quiz
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default QuizGenerateAI;
