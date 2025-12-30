"use client";
import React, { useState , useEffect } from "react";
import { Button } from "../../../@/components/ui/button";
import { Input } from "../../../@/components/ui/input";
import { ScrollArea } from "../../../@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { Loader2, Target, BookOpen, ArrowLeft, Sparkles, RefreshCw, Copy, Check } from "lucide-react";
import ProjectGuidanceRenderer from "./ProjectGuidanceRenderer";

  const ProjectGuidanceAI = ({ isOpen: propIsOpen, onClose }) => {
    const [isOpen, setIsOpen] = useState(propIsOpen);
    const [projectGuidance, setProjectGuidance] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState(null);
    const [projectForm, setProjectForm] = useState({
      description: "",
      skillLevel: "intermediate",
      technologies: [],
      timeline: "flexible"
    });
    const [showForm, setShowForm] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      setIsOpen(propIsOpen);
    }, [propIsOpen]);

    const handleClose = () => {
      setIsOpen(false);
      handleReset();
      if (onClose) onClose();
    };

    const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(text, null, 2));
      setCopiedMessageId("guidance");
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const submitProjectForm = async () => {
    if (!projectForm.description.trim() || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setShowForm(false);

    try {
      const response = await fetch('/api/project-guidance-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectDescription: projectForm.description,
          skillLevel: projectForm.skillLevel,
          technologies: projectForm.technologies,
          timeline: projectForm.timeline,
          conversationHistory: []
        }),
      });

      const data = await response.json();

      if (data.success && data.response) {
        setProjectGuidance(data.response);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      setError("Failed to generate project guidance. Please try again.");
      setShowForm(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setProjectGuidance(null);
    setShowForm(true);
    setError(null);
    setProjectForm({
      description: "",
      skillLevel: "intermediate",
      technologies: [],
      timeline: "flexible"
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col overflow-hidden border border-border/50">
        <div className="px-4 sm:px-6 py-4 border-b border-border/50 flex justify-between items-center bg-gradient-to-r from-background to-muted/30">
          <div className="flex items-center gap-3">
            {!showForm && projectGuidance && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReset}
                className="h-9 w-9 p-0 mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Project Guidance AI</h2>
              <p className="text-xs text-muted-foreground hidden sm:block">Your AI-powered project mentor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {projectGuidance && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(projectGuidance)}
                  className="hidden sm:flex gap-2"
                >
                  {copiedMessageId === "guidance" ? (
                    <><Check className="h-4 w-4 text-green-500" /> Copied</>
                  ) : (
                    <><Copy className="h-4 w-4" /> Export</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="hidden sm:flex gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  New Project
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClose}
              className="h-9 w-9 p-0 text-lg hover:bg-destructive/10 hover:text-destructive"
            >
              ×
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-6">
            {showForm ? (
              <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Target className="h-4 w-4" />
                    Get Started
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold">Tell Me About Your Project</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Share your project vision and I'll create a comprehensive, actionable guidance plan tailored to your needs.
                  </p>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <Card className="border-border/50 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Project Details
                    </CardTitle>
                    <CardDescription>
                      The more details you provide, the better guidance I can offer
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Project Description *</label>
                      <textarea
                        value={projectForm.description}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your project idea, goals, and what you want to achieve. Be as detailed as possible..."
                        className="w-full min-h-[140px] p-4 border border-border/50 rounded-xl resize-none bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Skill Level</label>
                        <Select
                          value={projectForm.skillLevel}
                          onValueChange={(value) => setProjectForm(prev => ({ ...prev, skillLevel: value }))}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Timeline</label>
                        <Select
                          value={projectForm.timeline}
                          onValueChange={(value) => setProjectForm(prev => ({ ...prev, timeline: value }))}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-week">1 Week</SelectItem>
                            <SelectItem value="1-month">1 Month</SelectItem>
                            <SelectItem value="3-months">3 Months</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Preferred Technologies (Optional)</label>
                      <Input
                        value={projectForm.technologies.join(", ")}
                        onChange={(e) => setProjectForm(prev => ({ 
                          ...prev, 
                          technologies: e.target.value.split(",").map(t => t.trim()).filter(t => t)
                        }))}
                        placeholder="e.g., React, Node.js, Python, MongoDB..."
                        className="h-11"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">Separate technologies with commas</p>
                    </div>

                    <Button
                      onClick={submitProjectForm}
                      disabled={!projectForm.description.trim() || isLoading}
                      className="w-full h-12 text-base font-medium"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Generating Guidance...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Generate Project Guidance
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                  <div className="absolute inset-0 w-20 h-20 animate-ping opacity-20 bg-primary rounded-full" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Crafting Your Project Plan</h3>
                  <p className="text-muted-foreground max-w-md">
                    Analyzing requirements, designing architecture, and creating step-by-step guidance...
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            ) : projectGuidance ? (
              <ProjectGuidanceRenderer guidance={projectGuidance} />
            ) : null}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ProjectGuidanceAI;