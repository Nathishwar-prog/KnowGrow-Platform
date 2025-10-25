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
          <CustomSyntaxHighlighter
            key={index}
            language={language || 'text'}
            theme={theme}
          >
            {code}
          </CustomSyntaxHighlighter>
        );
      }
      
      // Handle Mermaid diagrams
      if (part.includes('```mermaid')) {
        const mermaidMatch = part.match(/```mermaid\n([\s\S]*?)\n```/);
        if (mermaidMatch) {
          return (
            <div key={index} className="my-4 p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Project Flowchart:</div>
              <div className="text-xs font-mono whitespace-pre-wrap bg-background p-3 rounded border">
                {mermaidMatch[1]}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Copy this Mermaid code to <a href="https://mermaid.live" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mermaid.live</a> to visualize
              </div>
            </div>
          );
        }
      }
      
      // Regular text with enhanced formatting
      return (
        <div key={index} className="whitespace-pre-wrap">
          {part.split('\n').map((line, lineIndex) => {
            if (line.startsWith('**') && line.endsWith('**')) {
              return <strong key={lineIndex}>{line.slice(2, -2)}</strong>;
            }
            if (line.startsWith('*') && line.endsWith('*')) {
              return <em key={lineIndex}>{line.slice(1, -1)}</em>;
            }
            if (line.startsWith('### ')) {
              return <h3 key={lineIndex} className="text-lg font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={lineIndex} className="text-xl font-semibold mt-4 mb-2">{line.slice(3)}</h2>;
            }
            if (line.startsWith('# ')) {
              return <h1 key={lineIndex} className="text-2xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
            }
            if (line.startsWith('- ')) {
              return <li key={lineIndex} className="ml-4">{line.slice(2)}</li>;
            }
            if (line.startsWith('✓ ') || line.startsWith('✅ ')) {
              return (
                <div key={lineIndex} className="flex items-center gap-2 ml-4">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{line.slice(2)}</span>
                </div>
              );
            }
            return <div key={lineIndex}>{line}</div>;
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
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      {formatMessage(message.content)}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="h-6 w-6 p-0"
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Analyzing your project...</span>
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
