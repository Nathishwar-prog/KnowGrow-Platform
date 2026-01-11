"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../../@/components/ui/button";
import { Input } from "../../../@/components/ui/input";
import { ScrollArea } from "../../../@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { QuizRenderer } from "../../../@/components/quiz/QuizRenderer";
import { 
  Bot, Clock, Target, Loader2, Copy, Check, 
  Sparkles, TrendingUp, BookOpen, CheckCircle, 
  X, HelpCircle, BrainCircuit, Rocket,
  Activity, ChevronRight, Layout, Zap,
  Settings2, Palette, Trophy
} from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

// --- Typewriter Wrapper for Quiz Headers ---
const TypewriterHeader = ({ content, onComplete, speed = 20 }) => {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < content.length) {
      const timer = setTimeout(() => {
        setDisplayed(prev => prev + content[index]);
        setIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, content, speed, onComplete]);

  return <>{displayed}</>;
};

  const QuizGenerateAI = ({ isOpen: propIsOpen, onClose }) => {
    const [isOpen, setIsOpen] = useState(propIsOpen);
    const [quizData, setQuizData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [copiedQuizId, setCopiedQuizId] = useState(null);
    const [activeStep, setActiveStep] = useState(1);
    
    const [formData, setFormData] = useState({
      topic: "",
      difficulty: "medium",
      questionCount: 5,
      questionTypes: ["multiple_choice", "short_answer"]
    });

    useEffect(() => {
      setIsOpen(propIsOpen);
    }, [propIsOpen]);

    const handleClose = () => {
      setIsOpen(false);
      resetQuiz();
      setFormData({
        topic: "",
        difficulty: "medium",
        questionCount: 5,
        questionTypes: ["multiple_choice", "short_answer"]
      });
      if (onClose) onClose();
    };

    const generateQuiz = async () => {
    if (!formData.topic.trim()) return;

    setIsLoading(true);
    setQuizData(null);
    setActiveStep(2);

    try {
      const response = await fetch('/api/quiz-generate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setQuizData(data.quiz);
        setIsTyping(true);
        await saveQuizToDatabase(data.quiz);
      } else {
        throw new Error(data.error || 'Failed to generate quiz');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
      setActiveStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const saveQuizToDatabase = async (quiz) => {
    try {
      const quizId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  const resetQuiz = () => {
    setQuizData(null);
    setActiveStep(1);
    setIsTyping(false);
  };

    const copyQuizToClipboard = async () => {
      if (!quizData) return;
      const quizText = `Quiz: ${quizData.title}\n\n${quizData.description}\n\n` +
        quizData.questions.map((q, i) => 
          `${i + 1}. ${q.question}\n` +
          (q.code || q.codeExample ? `\nCode Context:\n${q.code || q.codeExample}\n` : '') +
          (q.options ? (Array.isArray(q.options) ? q.options.map((opt, j) => `   ${String.fromCharCode(65 + j)}. ${opt}`).join('\n') : Object.entries(q.options).map(([k, v]) => `   ${k}. ${v}`).join('\n')) : '') + 
          `\nCorrect Answer: ${q.correctAnswer}\nExplanation: ${q.explanation}\n`
        ).join('\n---\n\n');
    
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
    <div className="fixed inset-0 bg-background/40 backdrop-blur-2xl z-[100] flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-500">
      <div className="bg-background/90 border border-white/10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.4)] w-full max-w-6xl h-full sm:h-[94vh] flex flex-col overflow-hidden sm:rounded-[40px] transition-all duration-700">
        
        {/* Elite Header */}
        <div className="px-8 py-6 border-b border-border/50 flex justify-between items-center bg-background/20 backdrop-blur-3xl relative z-20">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/30 rounded-[20px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center shadow-2xl relative z-10 transform group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                <BrainCircuit className="h-9 w-9 text-primary-foreground drop-shadow-lg" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent uppercase">Knowledge Challenge AI</h2>
                <div className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.25em] border border-primary/20">Module Generator</div>
              </div>
              <div className="flex items-center gap-2.5 mt-1.5">
                <span className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-widest">
                  <Activity className="h-4 w-4 text-primary animate-pulse" />
                  Logic Engine Activated
                </span>
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClose} 
            className="h-11 w-11 rounded-2xl bg-destructive/5 text-destructive hover:bg-destructive hover:text-white transition-all duration-300 shadow-sm"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <ScrollArea className="flex-1 bg-gradient-to-b from-muted/30 via-background to-background relative">
          <div className="max-w-5xl mx-auto px-8 py-16 flex flex-col min-h-full">
            
            {!quizData && !isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center animate-in slide-in-from-bottom-12 duration-1000">
                <div className="text-center space-y-8 mb-16">
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] animate-pulse" />
                    <div className="w-24 h-24 rounded-[32px] bg-card flex items-center justify-center relative z-10 border border-white/10 shadow-2xl transform hover:rotate-6 transition-transform">
                      <Sparkles className="h-12 w-12 text-primary opacity-60" />
                    </div>
                  </div>
                  <h3 className="text-6xl font-black tracking-tighter bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent leading-tight">
                    Engineer Your Mastery Quiz
                  </h3>
                  <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto opacity-80">
                    Input a topic, and our AI logic engine will construct a rigorous assessment to validate your conceptual depth.
                  </p>
                </div>

                <div className="w-full max-w-3xl grid grid-cols-1 gap-12">
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/10 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Card className="relative border-2 border-border/60 rounded-[40px] bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                      <CardHeader className="p-10 pb-6 border-b border-border/40">
                        <CardTitle className="flex items-center gap-4 text-2xl font-black uppercase tracking-tight">
                          <Settings2 className="h-6 w-6 text-primary" />
                          Challenge Parameters
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-10 space-y-10">
                        <div className="space-y-4">
                          <label className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                            <Target className="h-4 w-4" />
                            Target Topic / Domain
                          </label>
                          <Input
                            value={formData.topic}
                            onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                            placeholder="e.g., Quantum Computing Architecture, Advanced Neural Networks..."
                            className="h-20 px-8 text-2xl border-2 rounded-[24px] bg-background/50 backdrop-blur-sm focus:border-primary/50 transition-all font-bold tracking-tight"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                              <TrendingUp className="h-4 w-4" />
                              Complexity Level
                            </label>
                            <Select
                              value={formData.difficulty}
                              onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                            >
                              <SelectTrigger className="h-16 border-2 rounded-[20px] px-6 text-lg font-bold bg-background/50">
                                <SelectValue />
                              </SelectTrigger>
                                <SelectContent className="rounded-2xl border-2 z-[110]">
                                <SelectItem value="easy">🌱 Beginner Foundation</SelectItem>
                                <SelectItem value="medium">⚡ Intermediate Professional</SelectItem>
                                <SelectItem value="hard">🔥 Expert Specialist</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                              <Layout className="h-4 w-4" />
                              Module Count
                            </label>
                            <Select
                              value={formData.questionCount.toString()}
                              onValueChange={(value) => setFormData(prev => ({ ...prev, questionCount: parseInt(value) }))}
                            >
                              <SelectTrigger className="h-16 border-2 rounded-[20px] px-6 text-lg font-bold bg-background/50">
                                <SelectValue />
                              </SelectTrigger>
                                <SelectContent className="rounded-2xl border-2 z-[110]">
                                <SelectItem value="3">3 Modules - Rapid Check</SelectItem>
                                <SelectItem value="5">5 Modules - Balanced Analysis</SelectItem>
                                <SelectItem value="10">10 Modules - Comprehensive Audit</SelectItem>
                                <SelectItem value="15">15 Modules - Elite Validation</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Button
                          onClick={generateQuiz}
                          disabled={!formData.topic.trim() || isLoading}
                          className="w-full h-20 text-xl font-black uppercase tracking-[0.2em] rounded-[28px] bg-primary shadow-[0_32px_64px_-16px_rgba(var(--primary),0.4)] transition-all hover:scale-[1.02] active:scale-95 hover:shadow-[0_48px_80px_-16px_rgba(var(--primary),0.5)] group"
                        >
                          <Rocket className="h-7 w-7 mr-4 group-hover:translate-y-[-4px] group-hover:translate-x-[4px] transition-transform" />
                          Initialize Generation
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ) : isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-500">
                <div className="relative mb-12">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                  <div className="w-40 h-40 rounded-[48px] bg-card flex items-center justify-center relative z-10 border border-white/10 shadow-2xl">
                    <Loader2 className="h-20 w-20 text-primary animate-spin" />
                  </div>
                </div>
                <h3 className="text-4xl font-black tracking-tighter mb-4 uppercase">Constructing Logic Gates...</h3>
                <p className="text-muted-foreground text-lg font-black uppercase tracking-[0.3em] animate-pulse">Analyzing Domain Specifics</p>
                
                <div className="mt-16 w-full max-w-md space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary/40 animate-progress" style={{ width: `${30 * i}%`, animationDelay: `${i * 0.2}s` }} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-in slide-in-from-bottom-12 duration-1000 space-y-16">
                <div className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-primary/10 via-background to-background p-16 border-2 border-border/60 shadow-2xl group">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-1000" />
                  
                  <div className="relative z-10 text-center space-y-8">
                    <div className="flex items-center justify-center gap-6">
                      <h3 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent uppercase leading-tight">
                        <TypewriterHeader content={quizData.title || formData.topic} onComplete={() => setIsTyping(false)} />
                      </h3>
                      {!isTyping && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={copyQuizToClipboard}
                          className="h-12 w-12 rounded-2xl hover:bg-white/50 transition-all shadow-sm group/copy"
                        >
                          {copiedQuizId ? 
                            <Check className="h-6 w-6 text-emerald-500" /> : 
                            <Copy className="h-6 w-6 group-hover:scale-110 transition-transform" />
                          }
                        </Button>
                      )}
                    </div>
                    
                    <div className="text-muted-foreground text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                      <MarkdownRenderer content={quizData.description} />
                    </div>
                    
                    <div className="flex items-center justify-center gap-8">
                      <div className="flex items-center gap-3 bg-card/60 backdrop-blur-md px-6 py-3 rounded-[20px] border border-border/50 shadow-sm">
                        <Target className="h-5 w-5 text-primary" />
                        <span className="font-black text-sm uppercase tracking-widest">{quizData.totalQuestions || quizData.questions?.length} Modules</span>
                      </div>
                      <div className="flex items-center gap-3 bg-card/60 backdrop-blur-md px-6 py-3 rounded-[20px] border border-border/50 shadow-sm">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <span className="font-black text-sm uppercase tracking-widest">{formData.difficulty} complexity</span>
                      </div>
                    </div>
  
                    {quizData.learningObjectives && quizData.learningObjectives.length > 0 && (
                      <div className="bg-card/40 backdrop-blur-xl rounded-[32px] p-10 text-left max-w-3xl mx-auto border border-border/40 shadow-inner">
                        <h4 className="font-black text-lg mb-6 flex items-center gap-4 uppercase tracking-widest">
                          <Zap className="h-6 w-6 text-primary" />
                          Knowledge Objectives
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {quizData.learningObjectives.map((objective, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 bg-background/40 rounded-2xl border border-border/30 hover:border-primary/30 transition-colors">
                              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="h-4 w-4 text-primary" />
                              </div>
                              <span className="text-sm font-bold leading-relaxed">{objective}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
  
                <div className="relative px-4">
                  <div className="absolute top-0 bottom-0 left-[23px] w-0.5 bg-gradient-to-b from-primary/40 via-border to-transparent hidden lg:block" />
                  <QuizRenderer 
                    questions={quizData.questions || []}
                    mode="preview"
                    showAnswers={false}
                    onRetake={() => {}}
                  />
                </div>
  
                <div className="flex justify-center items-center gap-8 py-12">
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-border/40" />
                  <Button 
                    onClick={resetQuiz} 
                    variant="outline"
                    size="lg"
                    className="px-12 h-20 text-xl font-black uppercase tracking-[0.2em] border-2 rounded-[28px] hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-500 shadow-2xl group"
                  >
                    <Sparkles className="h-6 w-6 mr-4 group-hover:rotate-12 transition-transform" />
                    Archive & Re-Engineer
                  </Button>
                  <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-border/40" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <style jsx global>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-progress {
          animation: progress 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default QuizGenerateAI;
