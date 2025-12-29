"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "../../../@/components/ui/button";
import { ScrollArea } from "../../../@/components/ui/scroll-area";
import { 
  Send, Bot, User, Sparkles, 
  X, Eraser, HelpCircle, 
  Terminal, Lightbulb, Zap, ArrowRight,
  Activity, CheckCircle2,
  ChevronDown, Share2, 
  Maximize2, Minimize2 , BookOpen
} from "lucide-react";
import { useTheme } from "next-themes";
import MarkdownRenderer from "./MarkdownRenderer";

// --- Typewriter Effect Component ---
const TypewriterText = ({ content, onComplete, speed = 10, isLatest = false }) => {
  const [displayedContent, setDisplayedContent] = useState(isLatest ? "" : content);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isLatest) {
      setDisplayedContent(content);
      return;
    }

    if (currentIndex < content.length) {
      const char = content[currentIndex];
      const isTechnical = ['`', '{', '}', '[', ']', '(', ')', ';', '#', '|'].includes(char);
      const delay = isTechnical ? speed / 2 : (char === ' ' ? speed : Math.random() * (speed * 1.5));
      
      timerRef.current = setTimeout(() => {
        setDisplayedContent((prev) => prev + content[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
    } else if (onComplete) {
      onComplete();
    }

    return () => clearTimeout(timerRef.current);
  }, [currentIndex, content, isLatest, speed, onComplete]);

  return <MarkdownRenderer content={displayedContent} />;
};

const DoubtClearAI = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [showJumpButton, setShowJumpButton] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { theme } = useTheme();

  const isAtBottom = useCallback(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollContainer) return true;
    const threshold = 100;
    return scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight <= threshold;
  }, []);

  const scrollToBottom = useCallback((force = false) => {
    if (force || isAtBottom()) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isAtBottom]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(true);
    }
  }, [messages, isOpen, isTyping, scrollToBottom]);

  const handleScroll = (e) => {
    const scrollContainer = e.currentTarget;
    const isBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight <= 100;
    setShowJumpButton(!isBottom);
  };

  const handleSendMessage = async (customMessage) => {
    const messageToSend = customMessage || inputMessage;
    if (!messageToSend.trim() || isLoading || isTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/doubt-clear-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          conversationHistory: messages.slice(-10)
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsTyping(true);
        const aiMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: data.timestamp || new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      const errorMessage = {
        id: `err-${Date.now()}`,
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

  const clearChat = () => {
    setMessages([]);
    setIsTyping(false);
  };

  const suggestedPrompts = [
    { text: "Explain this concept simply", icon: <Lightbulb className="h-4 w-4" />, color: "text-amber-500", bg: "bg-amber-500/10" },
    { text: "Give a real-world example", icon: <Zap className="h-4 w-4" />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { text: "How do I fix this error?", icon: <Terminal className="h-4 w-4" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { text: "Summarize key points", icon: <BookOpen className="h-4 w-4" />, color: "text-purple-500", bg: "bg-purple-500/10" }
  ];

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-background/40 backdrop-blur-2xl z-[100] flex items-center justify-center p-0 sm:p-4 transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-background/90 border border-white/10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isFullScreen ? 'w-full h-full rounded-0' : 'w-full max-w-6xl h-full sm:h-[94vh] sm:rounded-[40px]'}`}>
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-border/50 flex justify-between items-center bg-background/20 backdrop-blur-3xl relative z-20">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/30 rounded-[20px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center shadow-2xl relative z-10 transform group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                <Bot className="h-9 w-9 text-primary-foreground drop-shadow-lg" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-background z-20 shadow-lg animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">Doubt Clear AI</h2>
                <div className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.25em] border border-primary/20">ELITE TUTOR</div>
              </div>
              <div className="flex items-center gap-2.5 mt-1.5">
                <span className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  Real-time Concept Visualizer
                </span>
                <span className="w-1.5 h-1.5 bg-border rounded-full" />
                <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">System Ready</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="h-11 w-11 rounded-2xl text-muted-foreground hover:bg-muted transition-all shadow-sm"
            >
              {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>

            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearChat}
                className="h-11 w-11 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shadow-sm"
                title="Wipe Memory"
              >
                <Eraser className="h-5 w-5" />
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="h-11 w-11 rounded-2xl bg-destructive/5 text-destructive hover:bg-destructive hover:text-white transition-all duration-300 shadow-sm"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Dynamic Chat Area */}
        <ScrollArea 
          ref={scrollAreaRef}
          onScroll={handleScroll}
          className="flex-1 bg-gradient-to-b from-muted/30 via-background to-background relative"
        >
          <div className="max-w-4xl mx-auto px-8 py-16 flex flex-col gap-12 min-h-full">
            
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                <div className="relative mb-12">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] animate-pulse" />
                  <div className="w-32 h-32 rounded-[48px] bg-card flex items-center justify-center relative z-10 border border-white/10 shadow-2xl transform hover:rotate-6 transition-transform duration-500">
                    <HelpCircle className="h-14 w-14 text-primary opacity-60" />
                  </div>
                </div>
                
                <h3 className="text-5xl font-black tracking-tighter mb-6 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent leading-tight">
                  What's on your mind?<br /><span className="text-primary/60">I'm here to clarify.</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-3xl">
                  {suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(prompt.text)}
                      className="group flex flex-col gap-4 p-8 rounded-[32px] border border-border/60 bg-card/40 hover:bg-card hover:border-primary/40 transition-all duration-500 text-left relative overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2"
                    >
                      <div className={`w-14 h-14 rounded-2xl ${prompt.bg} flex items-center justify-center ${prompt.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        {prompt.icon}
                      </div>
                      <div>
                        <span className="text-lg font-black text-foreground block mb-1.5">{prompt.text}</span>
                        <p className="text-sm text-muted-foreground font-medium">Get a comprehensive expert breakdown</p>
                      </div>
                      <div className="absolute bottom-8 right-8 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-20 flex flex-wrap justify-center items-center gap-8 px-10 py-5 bg-background/50 backdrop-blur-md rounded-full border border-border/50 shadow-inner">
                  <div className="flex items-center gap-3 text-[12px] font-black text-primary uppercase tracking-[0.2em]">
                    <CheckCircle2 className="h-4 w-4" />
                    Accuracy Guaranteed
                  </div>
                  <div className="flex items-center gap-3 text-[12px] font-black text-primary uppercase tracking-[0.2em]">
                    <Activity className="h-4 w-4" />
                    Visual Diagrams
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-14">
                {messages.map((message, index) => {
                  const isAssistant = message.role === 'assistant';
                  const isLatest = index === messages.length - 1;

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-6 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-8 fade-in duration-700`}
                    >
                      {isAssistant && (
                        <div className="w-12 h-12 rounded-[18px] bg-primary/10 flex items-center justify-center flex-shrink-0 mt-3 shadow-inner border border-primary/20 transform hover:rotate-12 transition-transform">
                          <Bot className="h-7 w-7 text-primary" />
                        </div>
                      )}
                      
                      <div className={`group relative flex flex-col gap-4 max-w-[88%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`rounded-[36px] px-8 py-7 shadow-2xl transition-all duration-700 ${
                            message.role === 'user'
                              ? 'bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground backdrop-blur-md rounded-tr-[6px] border border-white/20'
                              : 'bg-card border border-border/60 rounded-tl-[6px] hover:shadow-primary/5 hover:border-primary/20'
                          }`}
                        >
                          {message.role === 'user' ? (
                            <p className="text-[18px] leading-relaxed whitespace-pre-wrap font-bold tracking-tight">{message.content}</p>
                          ) : (
                            <div className="relative min-h-[24px]">
                              <TypewriterText 
                                content={message.content} 
                                isLatest={isLatest && isTyping} 
                                onComplete={() => setIsTyping(false)}
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black text-muted-foreground/50 uppercase tracking-[0.25em]">
                              SENT {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          {isAssistant && !isTyping && (
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <button className="p-2 rounded-xl hover:bg-primary/10 text-muted-foreground/60 hover:text-primary transition-all border border-transparent hover:border-primary/20" title="Share with Team">
                                <Share2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {message.role === 'user' && (
                        <div className="w-12 h-12 rounded-[18px] bg-muted/90 backdrop-blur-md flex items-center justify-center flex-shrink-0 mt-3 border border-border/60 shadow-inner overflow-hidden">
                          <User className="h-7 w-7 text-muted-foreground/60" />
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {isLoading && (
                  <div className="flex gap-6 justify-start animate-in slide-in-from-bottom-6 fade-in duration-500">
                    <div className="w-12 h-12 rounded-[18px] bg-primary/10 flex items-center justify-center flex-shrink-0 mt-3">
                      <Bot className="h-7 w-7 text-primary animate-bounce" />
                    </div>
                    <div className="bg-card border border-border/60 rounded-[36px] rounded-tl-[6px] px-8 py-7 shadow-xl flex items-center gap-6">
                      <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" />
                      </div>
                      <span className="text-[13px] font-black text-primary tracking-[0.3em] uppercase animate-pulse">Analyzing Concept</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-10" />
          </div>

          {/* Jump Button */}
          {showJumpButton && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-in slide-in-from-bottom-6 fade-in">
              <Button
                size="lg"
                onClick={() => scrollToBottom(true)}
                className="rounded-full px-8 bg-background/90 backdrop-blur-xl border-2 border-primary/20 shadow-[0_16px_48px_-8px_rgba(var(--primary),0.3)] text-[11px] font-black uppercase tracking-[0.2em] text-foreground hover:bg-primary hover:text-primary-foreground group"
              >
                <ChevronDown className="h-4 w-4 mr-3 animate-bounce group-hover:scale-125 transition-transform" />
                Latest Message
              </Button>
            </div>
          )}
        </ScrollArea>

        {/* Input System */}
        <div className="p-8 sm:p-12 bg-background/50 backdrop-blur-3xl border-t border-border/50 relative z-20">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 via-transparent to-primary/30 rounded-[40px] blur-3xl opacity-0 group-focus-within:opacity-100 transition-all duration-1000" />
            
            <div className={`relative flex items-end gap-4 bg-card/90 backdrop-blur-xl border-2 rounded-[34px] p-4 pl-8 shadow-2xl transition-all duration-500 ${isLoading || isTyping ? 'opacity-80 border-border' : 'border-border/60 focus-within:border-primary/40 focus-within:shadow-[0_0_64px_-12px_rgba(var(--primary),0.2)]'}`}>
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isLoading ? "Expert logic in progress..." : "Describe your doubt or paste code snippet..."}
                disabled={isLoading || isTyping}
                rows={1}
                className="flex-1 min-h-[56px] max-h-[250px] py-4 bg-transparent border-0 focus:ring-0 text-[18px] placeholder:text-muted-foreground/40 resize-none font-bold tracking-tight scrollbar-none selection:bg-primary/30"
                style={{ height: 'auto' }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              />
              
              <div className="flex items-center gap-3 pr-2 pb-2">
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading || isTyping}
                  className="h-14 w-14 rounded-3xl bg-primary shadow-2xl shadow-primary/40 transition-all duration-500 hover:scale-105 active:scale-90 hover:rotate-6 disabled:opacity-50 disabled:grayscale disabled:scale-100 disabled:rotate-0"
                >
                  <Send className={`h-6 w-6 ${isLoading ? 'animate-pulse' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubtClearAI;
