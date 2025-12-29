"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "../../../@/components/ui/button";
import { ScrollArea } from "../../../@/components/ui/scroll-area";
import { 
  Send, Bot, User, Copy, Check, Sparkles, 
  X, Eraser, MessageCircle, HelpCircle, 
  Terminal, Lightbulb, Zap, ArrowRight,
  Code2, BookOpen, AlertCircle, CheckCircle2,
  ChevronDown, MessageSquarePlus, Share2, 
  Maximize2, Minimize2, Info
} from "lucide-react";
import { useTheme } from "next-themes";
import CustomSyntaxHighlighter from "./CustomSyntaxHighlighter";

// --- Typewriter Effect Component ---
const TypewriterText = ({ content, onComplete, speed = 15, isLatest = false, formatFn }) => {
  const [displayedContent, setDisplayedContent] = useState(isLatest ? "" : content);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isLatest) {
      setDisplayedContent(content);
      return;
    }

    if (currentIndex < content.length) {
      const delay = content[currentIndex] === ' ' ? speed : Math.random() * (speed * 2);
      timerRef.current = setTimeout(() => {
        setDisplayedContent((prev) => prev + content[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
    } else if (onComplete) {
      onComplete();
    }

    return () => clearTimeout(timerRef.current);
  }, [currentIndex, content, isLatest, speed, onComplete]);

  return <>{formatFn(displayedContent)}</>;
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

  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
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

  // Logic from original formatMessage preserved but enhanced for rendering
  const formatMessage = useCallback((content) => {
    if (!content) return null;
    const elements = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const codeBlocks = [];
    let match;
    while ((match = codeBlockRegex.exec(content)) !== null) {
      codeBlocks.push({
        start: match.index,
        end: match.index + match[0].length,
        language: match[1] || 'text',
        code: match[2].trim(),
        id: `code-block-${match.index}`
      });
    }

    let textContent = content;
    codeBlocks.forEach(block => {
      textContent = textContent.replace(
        content.substring(block.start, block.end),
        `__CODE_BLOCK_${block.id}__`
      );
    });

    const lines = textContent.split('\n');
    let inList = false;
    let inNumberedList = false;
    let listItems = [];
    let numberedItems = [];
    let listStartIndex = 0;
    let numberedListStartIndex = 0;

    lines.forEach((line, lineIndex) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('__CODE_BLOCK_')) {
        // Close lists if any
        if (inList) {
          elements.push(
            <ul key={`list-${listStartIndex}`} className="ml-6 my-4 space-y-2 list-disc marker:text-primary">
              {listItems}
            </ul>
          );
          listItems = []; inList = false;
        }
        if (inNumberedList) {
          elements.push(
            <ol key={`nlist-${numberedListStartIndex}`} className="ml-6 my-4 space-y-2 list-decimal marker:text-primary">
              {numberedItems}
            </ol>
          );
          numberedItems = []; inNumberedList = false;
        }

        const blockId = trimmedLine.replace('__CODE_BLOCK_', '').replace('__', '');
        const block = codeBlocks.find(b => b.id === blockId);
        if (block) {
          elements.push(
            <div key={block.id} className="my-5 rounded-2xl overflow-hidden border border-border bg-[#1e1e1e] dark:bg-[#0d0d0d] shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="bg-[#252526] dark:bg-[#1e1e1e] px-4 py-2 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 mr-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Code2 className="h-3 w-3" />
                    {block.language}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(block.code, block.id)}
                  className="h-7 px-2 text-[10px] text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {copiedMessageId === block.id ? (
                    <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Copied</span>
                  ) : (
                    <span className="flex items-center gap-1"><Copy className="h-3 w-3" /> Copy Code</span>
                  )}
                </Button>
              </div>
              <div className="relative overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <CustomSyntaxHighlighter language={block.language} theme="dark">
                  {block.code}
                </CustomSyntaxHighlighter>
              </div>
            </div>
          );
        }
        return;
      }

      // Format headers
      const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        const HeadingTag = `h${level}`;
        const sizes = {
          1: 'text-2xl font-black mt-10 mb-5 tracking-tight',
          2: 'text-xl font-bold mt-8 mb-4 tracking-tight',
          3: 'text-lg font-bold mt-6 mb-3',
          4: 'text-base font-bold mt-5 mb-2',
          5: 'text-sm font-bold mt-4 mb-2',
          6: 'text-xs font-bold mt-4 mb-1'
        };

        elements.push(
          React.createElement(
            HeadingTag,
            { key: `heading-${lineIndex}`, className: `${sizes[level]} text-foreground/90 flex items-center gap-3` },
            <><div className="w-1 h-6 bg-primary rounded-full" />{processInlineFormatting(text, `h-${lineIndex}`)}</>
          )
        );
        return;
      }

      // Format Lists
      const listMatch = trimmedLine.match(/^[-*•]\s+(.+)$/);
      if (listMatch) {
        if (!inList) { inList = true; listStartIndex = lineIndex; }
        listItems.push(<li key={`li-${lineIndex}`} className="text-[15px] leading-relaxed pl-1 text-foreground/80">{processInlineFormatting(listMatch[1], `li-${lineIndex}`)}</li>);
        return;
      } else if (inList && trimmedLine) {
        elements.push(<ul key={`list-${listStartIndex}`} className="ml-6 my-5 space-y-3 list-disc marker:text-primary/70">{listItems}</ul>);
        listItems = []; inList = false;
      }

      const numberedMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);
      if (numberedMatch) {
        if (!inNumberedList) { inNumberedList = true; numberedListStartIndex = lineIndex; }
        numberedItems.push(<li key={`nli-${lineIndex}`} className="text-[15px] leading-relaxed pl-1 text-foreground/80">{processInlineFormatting(numberedMatch[1], `nli-${lineIndex}`)}</li>);
        return;
      } else if (inNumberedList && trimmedLine) {
        elements.push(<ol key={`nlist-${numberedListStartIndex}`} className="ml-6 my-5 space-y-3 list-decimal marker:text-primary/70">{numberedItems}</ol>);
        numberedItems = []; inNumberedList = false;
      }

      // Callouts/Notes
      const isCallout = trimmedLine.startsWith('⚠️') || trimmedLine.includes('**Note:**') || trimmedLine.includes('**Important:**');
      if (isCallout) {
        elements.push(
          <div key={`callout-${lineIndex}`} className="bg-amber-500/5 border-l-4 border-amber-500 rounded-r-2xl p-4 my-6 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[14px] font-medium leading-relaxed text-amber-900/80 dark:text-amber-200/80">{processInlineFormatting(trimmedLine, `callout-${lineIndex}`)}</p>
            </div>
          </div>
        );
        return;
      }

      if (trimmedLine.startsWith('💡') || trimmedLine.includes('**Tip:**')) {
        elements.push(
          <div key={`tip-${lineIndex}`} className="bg-primary/5 border-l-4 border-primary rounded-r-2xl p-4 my-6 shadow-sm">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-[14px] font-medium leading-relaxed text-primary/80">{processInlineFormatting(trimmedLine, `tip-${lineIndex}`)}</p>
            </div>
          </div>
        );
        return;
      }

      if (trimmedLine) {
        elements.push(<p key={`p-${lineIndex}`} className="text-[16px] leading-relaxed my-4 text-foreground/80 font-normal">{processInlineFormatting(line, `p-${lineIndex}`)}</p>);
      } else {
        elements.push(<div key={`space-${lineIndex}`} className="h-3" />);
      }
    });

    if (listItems.length > 0) elements.push(<ul key={`list-end-${listStartIndex}`} className="ml-6 my-5 space-y-3 list-disc marker:text-primary/70">{listItems}</ul>);
    if (numberedItems.length > 0) elements.push(<ol key={`nlist-end-${numberedListStartIndex}`} className="ml-6 my-5 space-y-3 list-decimal marker:text-primary/70">{numberedItems}</ol>);

    return elements;
  }, [copiedMessageId, theme]);

  const processInlineFormatting = (text, baseKey) => {
    const parts = [];
    let inlineCodeCounter = 0;
    const inlineCodeRegex = /`([^`]+)`/g;
    const inlineCodes = [];
    
    text.replace(inlineCodeRegex, (match, code) => {
      inlineCodes.push(code);
      return '';
    });

    let processedText = text.replace(inlineCodeRegex, () => `__INLINE_CODE_${inlineCodeCounter++}__`);
    processedText = processedText.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>');
    processedText = processedText.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em class="italic">$1</em>');
    processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-bold">$1</a>');

    const segments = processedText.split(/(__INLINE_CODE_\d+__)/);

    return segments.map((segment, index) => {
      const codeMatch = segment.match(/__INLINE_CODE_(\d+)__/);
      if (codeMatch) {
        const codeIndex = parseInt(codeMatch[1]);
        return <code key={`${baseKey}-c-${index}`} className="px-1.5 py-0.5 bg-primary/10 rounded text-[13px] font-mono border border-primary/20 text-primary font-bold">{inlineCodes[codeIndex]}</code>;
      } else if (segment) {
        return <span key={`${baseKey}-t-${index}`} dangerouslySetInnerHTML={{ __html: segment }} />;
      }
      return null;
    }).filter(Boolean);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-background/40 backdrop-blur-xl z-[100] flex items-center justify-center p-0 transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-background/80 border border-white/10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isFullScreen ? 'w-full h-full rounded-0' : 'w-full max-w-6xl h-full sm:h-[92vh] sm:rounded-[32px]'}`}>
        
        {/* Header Upgrade */}
        <div className="px-8 py-6 border-b border-border/50 flex justify-between items-center bg-background/20 backdrop-blur-3xl relative z-20">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/40 rounded-[18px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-2xl relative z-10 transform group-hover:rotate-[10deg] transition-transform duration-500">
                <Bot className="h-8 w-8 text-primary-foreground drop-shadow-lg" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-background z-20 shadow-lg" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Doubt Clear AI</h2>
                <div className="px-2.5 py-0.5 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.2em] border border-primary/20">PRO TUTOR</div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                  <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                  Your Intelligent Learning Companion
                </span>
                <span className="w-1 h-1 bg-border rounded-full" />
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active Now</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 mr-4 px-4 py-2 bg-muted/30 rounded-full border border-border/50">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">12k+ Helped</span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="h-10 w-10 rounded-full text-muted-foreground hover:bg-muted transition-all"
            >
              {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>

            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearChat}
                className="h-10 w-10 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Reset Chat"
              >
                <Eraser className="h-5 w-5" />
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="h-10 w-10 rounded-full bg-muted/50 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Chat Body with Smart Scroll */}
        <ScrollArea 
          ref={scrollAreaRef}
          onScroll={handleScroll}
          className="flex-1 bg-gradient-to-b from-muted/20 to-transparent relative"
        >
          <div className="max-w-4xl mx-auto px-8 py-12 flex flex-col gap-10 min-h-full">
            
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                <div className="relative mb-10">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-[60px] animate-pulse" />
                  <div className="w-28 h-28 rounded-[40px] bg-card flex items-center justify-center relative z-10 border border-white/10 shadow-inner">
                    <MessageSquarePlus className="h-12 w-12 text-primary opacity-50" />
                  </div>
                </div>
                
                <h3 className="text-4xl font-black tracking-tighter mb-4 bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
                  Let's Solve Your Doubts
                </h3>
                <p className="text-muted-foreground max-w-lg mb-12 text-lg leading-relaxed font-medium">
                  Stuck on a concept? Need code explanation? Just type it below. I'm trained to help you master any subject with ease.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
                  {suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(prompt.text)}
                      className="group flex flex-col gap-3 p-6 rounded-[24px] border border-border/50 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-500 text-left relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className={`w-12 h-12 rounded-2xl ${prompt.bg} flex items-center justify-center ${prompt.color} group-hover:scale-110 transition-transform duration-500`}>
                        {prompt.icon}
                      </div>
                      <div>
                        <span className="text-sm font-black text-foreground/90 block">{prompt.text}</span>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">Click to ask this question instantly</p>
                      </div>
                      <ArrowRight className="absolute bottom-6 right-6 h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all" />
                    </button>
                  ))}
                </div>

                <div className="mt-16 flex items-center gap-6 px-8 py-4 bg-primary/5 rounded-full border border-primary/10">
                  <div className="flex items-center gap-2 text-[11px] font-black text-primary uppercase tracking-widest">
                    <Info className="h-4 w-4" />
                    Powered by Advanced AI
                  </div>
                  <div className="h-4 w-px bg-primary/20" />
                  <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Privacy Protected & Secure</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-10">
                {messages.map((message, index) => {
                  const isAssistant = message.role === 'assistant';
                  const isLatest = index === messages.length - 1;

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-5 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-6 fade-in duration-700`}
                    >
                      {isAssistant && (
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-2 shadow-inner border border-primary/20">
                          <Bot className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      
                      <div className={`group relative flex flex-col gap-3 max-w-[85%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`rounded-[28px] px-7 py-6 shadow-xl transition-all duration-500 ${
                            message.role === 'user'
                              ? 'bg-primary/90 text-primary-foreground backdrop-blur-md rounded-tr-[4px] border border-white/20'
                              : 'bg-card border border-border/50 rounded-tl-[4px] hover:shadow-2xl hover:border-primary/20'
                          }`}
                        >
                          {message.role === 'user' ? (
                            <p className="text-[17px] leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
                          ) : (
                            <div className="relative min-h-[20px]">
                              <TypewriterText 
                                content={message.content} 
                                isLatest={isLatest && isTyping} 
                                onComplete={() => setIsTyping(false)}
                                formatFn={formatMessage}
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 px-2">
                          <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isAssistant && !isTyping && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button
                                onClick={() => copyToClipboard(message.content, message.id)}
                                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground/50 hover:text-primary transition-all"
                                title="Copy Text"
                              >
                                {copiedMessageId === message.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                              <button className="p-1.5 rounded-full hover:bg-muted text-muted-foreground/50 hover:text-primary transition-all" title="Share Response">
                                <Share2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {message.role === 'user' && (
                        <div className="w-10 h-10 rounded-2xl bg-muted/80 backdrop-blur-md flex items-center justify-center flex-shrink-0 mt-2 border border-border/50 shadow-inner">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {isLoading && (
                  <div className="flex gap-5 justify-start animate-in slide-in-from-bottom-4 fade-in duration-500">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-2">
                      <Bot className="h-6 w-6 text-primary animate-bounce" />
                    </div>
                    <div className="bg-card border border-border/50 rounded-[28px] rounded-tl-[4px] px-7 py-6 shadow-sm flex items-center gap-5">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      </div>
                      <span className="text-xs font-black text-muted-foreground tracking-[0.2em] uppercase">Processing</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-10" />
          </div>

          {/* Jump Button */}
          {showJumpButton && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 animate-in slide-in-from-bottom-4 fade-in">
              <Button
                size="sm"
                onClick={() => scrollToBottom(true)}
                className="rounded-full px-6 bg-background/80 backdrop-blur-md border border-border shadow-2xl text-xs font-black uppercase tracking-widest text-foreground hover:bg-primary hover:text-primary-foreground"
              >
                <ChevronDown className="h-4 w-4 mr-2 animate-bounce" />
                Jump to Latest
              </Button>
            </div>
          )}
        </ScrollArea>

        {/* Premium Input Area */}
        <div className="p-6 sm:p-10 bg-background/40 backdrop-blur-3xl border-t border-border/50 relative z-20">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-[32px] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
            
            <div className={`relative group flex items-end gap-3 bg-card/80 backdrop-blur-md border-2 rounded-[30px] p-3 pl-6 shadow-2xl transition-all duration-500 ${isLoading || isTyping ? 'opacity-70 border-border/50' : 'border-border/50 focus-within:border-primary/50 focus-within:shadow-primary/10'}`}>
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isLoading ? "AI is formulating a response..." : "What would you like to learn today?"}
                disabled={isLoading || isTyping}
                rows={1}
                className="flex-1 min-h-[48px] max-h-[200px] py-3 bg-transparent border-0 focus:ring-0 text-[16px] placeholder:text-muted-foreground/50 resize-none font-medium scrollbar-none selection:bg-primary/30"
                style={{ height: 'auto' }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              />
              
              <div className="flex items-center gap-2 pr-1 pb-1">
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading || isTyping}
                  size="icon"
                  className="h-12 w-12 rounded-[22px] bg-primary shadow-[0_8px_24px_-8px_rgba(var(--primary),0.5)] transition-all duration-500 hover:scale-110 active:scale-95 hover:shadow-primary/40 disabled:opacity-50 disabled:grayscale"
                >
                  <Send className={`h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`} />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-5 px-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em]">
                  <HelpCircle className="h-3.5 w-3.5 text-primary" />
                  Ask Anything
                </div>
                <div className="w-1.5 h-1.5 bg-border rounded-full opacity-30" />
                <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em]">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  Instant Feedback
                </div>
              </div>
              <p className="hidden sm:flex items-center gap-2 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
                <kbd className="px-2 py-1 bg-muted/50 rounded-lg border border-border/50 font-mono shadow-inner">Enter</kbd>
                <span>to send</span>
                <span className="mx-1">•</span>
                <kbd className="px-2 py-1 bg-muted/50 rounded-lg border border-border/50 font-mono shadow-inner">Shift + Enter</kbd>
                <span>new line</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubtClearAI;
