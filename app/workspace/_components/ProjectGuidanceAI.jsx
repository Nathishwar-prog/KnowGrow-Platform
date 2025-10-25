"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../../@/components/ui/button";
import { Input } from "../../../@/components/ui/input";
import { ScrollArea } from "../../../@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { Badge } from "../../../@/components/ui/badge";
import { Bot, User, Copy, Check, Loader2, Send, Target, Clock, Code, BookOpen, CheckCircle } from "lucide-react";
import { useTheme } from "next-themes";
import CustomSyntaxHighlighter from "./CustomSyntaxHighlighter";

const ProjectGuidanceAI = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm your Project Guidance AI mentor. I can help you plan, structure, and execute any project from start to finish. Tell me about your project idea and I'll provide comprehensive guidance!",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    description: "",
    skillLevel: "intermediate",
    technologies: [],
    timeline: "flexible"
  });
  const [showForm, setShowForm] = useState(true);
  const messagesEndRef = useRef(null);
  const { theme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/project-guidance-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          projectDescription: projectForm.description,
          skillLevel: projectForm.skillLevel,
          technologies: projectForm.technologies,
          timeline: projectForm.timeline,
          conversationHistory: messages.slice(-10)
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.response,
          timestamp: data.timestamp
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const submitProjectForm = () => {
    if (!projectForm.description.trim()) return;
    
    const projectMessage = `I want to work on a project with the following details:

**Project Description:** ${projectForm.description}
**Skill Level:** ${projectForm.skillLevel}
**Preferred Technologies:** ${projectForm.technologies.join(", ") || "Open to suggestions"}
**Timeline:** ${projectForm.timeline}

Please provide comprehensive project guidance including planning, implementation steps, and best practices.`;

    setInputMessage(projectMessage);
    setShowForm(false);
  };

  const formatMessage = (content) => {
    // Split content by code blocks
    const parts = content.split(/(```[\s\S]*?```)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeBlock = part.slice(3, -3);
        const lines = codeBlock.split('\n');
        const language = lines[0].match(/^[a-zA-Z]+$/) ? lines[0] : '';
        const code = language ? lines.slice(1).join('\n') : codeBlock;
        
        return (
          <div key={index} className="my-4 rounded-lg overflow-hidden border border-border/50 shadow-sm">
            <div className="bg-muted/50 px-4 py-2 flex items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase">{language || 'code'}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(code, `code-${index}`)}
                className="h-7 px-2"
              >
                {copiedMessageId === `code-${index}` ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <CustomSyntaxHighlighter
              language={language || 'text'}
              theme={theme}
            >
              {code}
            </CustomSyntaxHighlighter>
          </div>
        );
      }
      
      // Handle Mermaid diagrams
      if (part.includes('```mermaid')) {
        const mermaidMatch = part.match(/```mermaid\n([\s\S]*?)\n```/);
        if (mermaidMatch) {
          return (
            <div key={index} className="my-4 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden shadow-md">
              <div className="bg-primary/10 px-4 py-3 border-b border-primary/20">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Project Flowchart</span>
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs font-mono whitespace-pre-wrap bg-background/80 p-4 rounded-md border border-border/50 backdrop-blur-sm">
                  {mermaidMatch[1]}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3" />
                  <span>Visualize this diagram at{' '}
                    <a href="https://mermaid.live" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                      mermaid.live
                    </a>
                  </span>
                </div>
              </div>
            </div>
          );
        }
      }
      
      // Regular text with enhanced formatting
      return (
        <div key={index} className="space-y-2">
          {part.split('\n').map((line, lineIndex) => {
            // Numbered lists (1., 2., etc.)
            const numberedMatch = line.match(/^(\d+)\.\s+(.+)/);
            if (numberedMatch) {
              return (
                <div key={lineIndex} className="flex gap-3 items-start py-1">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{numberedMatch[1]}</span>
                  </div>
                  <span className="flex-1 pt-0.5">{numberedMatch[2]}</span>
                </div>
              );
            }
            
            // Headers
            if (line.startsWith('### ')) {
              return (
                <h3 key={lineIndex} className="text-lg font-bold mt-6 mb-3 text-foreground border-b border-border/30 pb-2">
                  {line.slice(4)}
                </h3>
              );
            }
            if (line.startsWith('## ')) {
              return (
                <div key={lineIndex} className="mt-6 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    <h2 className="text-xl font-bold text-foreground">{line.slice(3)}</h2>
                  </div>
                  <div className="h-0.5 w-12 bg-gradient-to-r from-primary to-transparent rounded-full" />
                </div>
              );
            }
            if (line.startsWith('# ')) {
              return (
                <div key={lineIndex} className="mt-6 mb-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary">
                  <h1 className="text-2xl font-bold text-foreground">{line.slice(2)}</h1>
                </div>
              );
            }
            
            // Bold text with **text**
            if (line.includes('**')) {
              const boldFormatted = line.split(/(\*\*.*?\*\*)/).map((segment, i) => {
                if (segment.startsWith('**') && segment.endsWith('**')) {
                  return <strong key={i} className="font-semibold text-foreground">{segment.slice(2, -2)}</strong>;
                }
                return segment;
              });
              return <div key={lineIndex} className="leading-relaxed">{boldFormatted}</div>;
            }
            
            // Bullet points with emojis or special markers
            if (line.startsWith('✓ ') || line.startsWith('✅ ')) {
              return (
                <div key={lineIndex} className="flex items-start gap-3 py-1.5 pl-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="flex-1 text-sm leading-relaxed">{line.slice(2)}</span>
                </div>
              );
            }
            
            if (line.startsWith('🎯 ') || line.startsWith('- 🎯 ')) {
              return (
                <div key={lineIndex} className="flex items-start gap-3 py-1.5 pl-2 bg-primary/5 rounded-md px-3">
                  <Target className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                  <span className="flex-1 text-sm font-medium">{line.replace(/^-?\s*🎯\s*/, '')}</span>
                </div>
              );
            }
            
            if (line.startsWith('⏰ ') || line.startsWith('- ⏰ ')) {
              return (
                <div key={lineIndex} className="flex items-start gap-3 py-1.5 pl-2">
                  <Clock className="h-4 w-4 text-orange-500 flex-shrink-0 mt-1" />
                  <span className="flex-1 text-sm">{line.replace(/^-?\s*⏰\s*/, '')}</span>
                </div>
              );
            }
            
            // Regular bullet points
            if (line.startsWith('- ')) {
              return (
                <div key={lineIndex} className="flex items-start gap-3 py-1 pl-2">
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span className="flex-1 text-sm leading-relaxed">{line.slice(2)}</span>
                </div>
              );
            }
            
            // Callout boxes (lines starting with > )
            if (line.startsWith('> ')) {
              return (
                <div key={lineIndex} className="my-3 p-4 rounded-lg bg-muted/50 border-l-4 border-primary italic">
                  <span className="text-sm">{line.slice(2)}</span>
                </div>
              );
            }
            
            // Phase/Stage indicators (e.g., "Phase 1:", "Stage 2:")
            if (line.match(/^(Phase|Stage|Step)\s+\d+:/i)) {
              return (
                <div key={lineIndex} className="my-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary">
                  <span className="font-semibold text-primary">{line}</span>
                </div>
              );
            }
            
            // Empty lines
            if (line.trim() === '') {
              return <div key={lineIndex} className="h-2" />;
            }
            
            // Regular text
            return <div key={lineIndex} className="text-sm leading-relaxed text-foreground/90">{line}</div>;
          })}
        </div>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Project Guidance AI</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          {showForm ? (
            /* Project Form */
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Tell Me About Your Project</h3>
                <p className="text-muted-foreground">
                  Provide details about your project and I'll create a comprehensive guidance plan
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                  <CardDescription>
                    The more details you provide, the better guidance I can offer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Project Description</label>
                    <textarea
                      value={projectForm.description}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your project idea, goals, and what you want to achieve..."
                      className="w-full min-h-[120px] p-3 border rounded-md resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Skill Level</label>
                      <Select
                        value={projectForm.skillLevel}
                        onValueChange={(value) => setProjectForm(prev => ({ ...prev, skillLevel: value }))}
                      >
                        <SelectTrigger>
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
                        <SelectTrigger>
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
                      className="w-full"
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button
                      onClick={submitProjectForm}
                      disabled={!projectForm.description.trim()}
                      className="w-full md:w-auto"
                    >
                      Get Project Guidance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Chat Interface */
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-lg flex items-center justify-center flex-shrink-0 ring-2 ring-primary/20">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[85%] rounded-xl p-4 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-auto'
                        : 'bg-gradient-to-br from-muted to-muted/50 border border-border/50'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {formatMessage(message.content)}
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/30">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="h-7 w-7 p-0 hover:bg-background/20"
                        title="Copy message"
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg flex items-center justify-center flex-shrink-0 ring-2 ring-primary/30">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-lg flex items-center justify-center flex-shrink-0 ring-2 ring-primary/20">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="bg-gradient-to-br from-muted to-muted/50 border border-border/50 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <div className="absolute inset-0 h-5 w-5 animate-ping opacity-20 bg-primary rounded-full" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-foreground">Analyzing your project...</span>
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        {!showForm && (
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your project..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectGuidanceAI;