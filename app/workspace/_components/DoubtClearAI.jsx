"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../../@/components/ui/button";
import { ScrollArea } from "../../../@/components/ui/scroll-area";
import { 
  Send, Bot, User, Copy, Check, Sparkles, 
  X, Eraser, MessageCircle, HelpCircle, 
  Terminal, Lightbulb, Zap, ArrowRight,
  Code2, BookOpen, AlertCircle, CheckCircle2
} from "lucide-react";
import { useTheme } from "next-themes";
import CustomSyntaxHighlighter from "./CustomSyntaxHighlighter";

const DoubtClearAI = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const { theme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (customMessage) => {
    const messageToSend = customMessage || inputMessage;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
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

  const clearChat = () => {
    setMessages([]);
  };

  const suggestedPrompts = [
    { text: "Explain this concept in simple terms", icon: <Lightbulb className="h-4 w-4" /> },
    { text: "Give me a practical example", icon: <Zap className="h-4 w-4" /> },
    { text: "Help me debug this code block", icon: <Terminal className="h-4 w-4" /> },
    { text: "Summarize the key takeaways", icon: <BookOpen className="h-4 w-4" /> }
  ];

  // Logic from original formatMessage preserved
  const formatMessage = (content) => {
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
        if (inList) {
          elements.push(
            <ul key={`list-${listStartIndex}`} className="ml-6 my-4 space-y-2 list-disc marker:text-primary">
              {listItems}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        if (inNumberedList) {
          elements.push(
            <ol key={`nlist-${numberedListStartIndex}`} className="ml-6 my-4 space-y-2 list-decimal marker:text-primary">
              {numberedItems}
            </ol>
          );
          numberedItems = [];
          inNumberedList = false;
        }

        const blockId = trimmedLine.replace('__CODE_BLOCK_', '').replace('__', '');
        const block = codeBlocks.find(b => b.id === blockId);
        if (block) {
          elements.push(
            <div key={block.id} className="my-4 rounded-xl overflow-hidden border border-border bg-muted/30 shadow-sm hover:shadow-md transition-all">
              <div className="bg-muted/50 px-4 py-2.5 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-primary/10">
                    <Code2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                    {block.language}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(block.code, block.id)}
                  className="h-8 px-2.5 text-xs hover:bg-background transition-colors"
                >
                  {copiedMessageId === block.id ? (
                    <div className="flex items-center gap-1.5 text-green-600 font-medium">
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </div>
                  )}
                </Button>
              </div>
              <div className="relative">
                <CustomSyntaxHighlighter language={block.language} theme={theme}>
                  {block.code}
                </CustomSyntaxHighlighter>
              </div>
            </div>
          );
        }
        return;
      }

      const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        if (inList) {
          elements.push(
            <ul key={`list-${listStartIndex}`} className="ml-6 my-4 space-y-2 list-disc marker:text-primary">
              {listItems}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        if (inNumberedList) {
          elements.push(
            <ol key={`nlist-${numberedListStartIndex}`} className="ml-6 my-4 space-y-2 list-decimal marker:text-primary">
              {numberedItems}
            </ol>
          );
          numberedItems = [];
          inNumberedList = false;
        }

        const level = headingMatch[1].length;
        const text = headingMatch[2];
        const HeadingTag = `h${level}`;
        const sizes = {
          1: 'text-2xl font-bold mt-8 mb-4 tracking-tight',
          2: 'text-xl font-bold mt-7 mb-3 tracking-tight',
          3: 'text-lg font-semibold mt-6 mb-3',
          4: 'text-base font-semibold mt-5 mb-2',
          5: 'text-sm font-semibold mt-4 mb-2',
          6: 'text-sm font-semibold mt-4 mb-1'
        };

        elements.push(
          React.createElement(
            HeadingTag,
            {
              key: `heading-${lineIndex}`,
              className: `${sizes[level]} text-foreground flex items-center gap-2 group`
            },
            <>
              <div className="w-1.5 h-6 bg-primary rounded-full hidden group-hover:block transition-all" />
              <span>{processInlineFormatting(text, `heading-${lineIndex}`)}</span>
            </>
          )
        );
        return;
      }

      const listMatch = trimmedLine.match(/^[-*•]\s+(.+)$/);
      if (listMatch) {
        if (!inList) {
          inList = true;
          listStartIndex = lineIndex;
        }
        listItems.push(
          <li key={`li-${lineIndex}`} className="text-sm leading-relaxed pl-1 transition-colors hover:text-foreground">
            {processInlineFormatting(listMatch[1], `li-${lineIndex}`)}
          </li>
        );
        return;
      } else if (inList && trimmedLine) {
        elements.push(
          <ul key={`list-${listStartIndex}`} className="ml-6 my-4 space-y-2.5 list-disc marker:text-primary/60">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }

      const numberedMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);
      if (numberedMatch) {
        if (!inNumberedList) {
          inNumberedList = true;
          numberedListStartIndex = lineIndex;
        }
        numberedItems.push(
          <li key={`nli-${lineIndex}`} className="text-sm leading-relaxed pl-1 transition-colors hover:text-foreground">
            {processInlineFormatting(numberedMatch[1], `nli-${lineIndex}`)}
          </li>
        );
        return;
      } else if (inNumberedList && trimmedLine) {
        elements.push(
          <ol key={`nlist-${numberedListStartIndex}`} className="ml-6 my-4 space-y-2.5 list-decimal marker:text-primary/60">
            {numberedItems}
          </ol>
        );
        numberedItems = [];
        inNumberedList = false;
      }

      const blockquoteMatch = trimmedLine.match(/^>\s+(.+)$/);
      if (blockquoteMatch) {
        elements.push(
          <div key={`quote-${lineIndex}`} className="border-l-4 border-primary/40 pl-5 py-3 my-5 bg-muted/40 rounded-r-xl group transition-all hover:bg-muted/60">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-4 w-4 text-primary/60 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <p className="text-[14px] italic text-muted-foreground leading-relaxed">{processInlineFormatting(blockquoteMatch[1], `quote-${lineIndex}`)}</p>
            </div>
          </div>
        );
        return;
      }

      if (trimmedLine.startsWith('⚠️') || trimmedLine.includes('**Note:**') || trimmedLine.includes('**Important:**')) {
        elements.push(
          <div key={`callout-${lineIndex}`} className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 my-5 group hover:border-amber-500/40 transition-all">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed text-amber-700 dark:text-amber-400">{processInlineFormatting(trimmedLine, `callout-${lineIndex}`)}</p>
            </div>
          </div>
        );
        return;
      }

      if (trimmedLine.startsWith('✅') || trimmedLine.includes('**Key Point:**')) {
        elements.push(
          <div key={`keypoint-${lineIndex}`} className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 my-5 group hover:border-emerald-500/40 transition-all">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed text-emerald-700 dark:text-emerald-400">{processInlineFormatting(trimmedLine, `keypoint-${lineIndex}`)}</p>
            </div>
          </div>
        );
        return;
      }

      if (trimmedLine.startsWith('💡') || trimmedLine.includes('**Tip:**')) {
        elements.push(
          <div key={`tip-${lineIndex}`} className="bg-primary/5 border border-primary/20 rounded-xl p-4 my-5 group hover:border-primary/40 transition-all">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed text-primary/80">{processInlineFormatting(trimmedLine, `tip-${lineIndex}`)}</p>
            </div>
          </div>
        );
        return;
      }

      if (trimmedLine) {
        elements.push(
          <p key={`p-${lineIndex}`} className="text-[15px] leading-relaxed my-3.5 text-foreground/80 font-normal">
            {processInlineFormatting(line, `p-${lineIndex}`)}
          </p>
        );
      } else {
        elements.push(<div key={`space-${lineIndex}`} className="h-2" />);
      }
    });

    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-end-${listStartIndex}`} className="ml-6 my-4 space-y-2.5 list-disc marker:text-primary/60">
          {listItems}
        </ul>
      );
    }
    if (numberedItems.length > 0) {
      elements.push(
        <ol key={`nlist-end-${numberedListStartIndex}`} className="ml-6 my-4 space-y-2.5 list-decimal marker:text-primary/60">
          {numberedItems}
        </ol>
      );
    }

    return elements;
  };

  const processInlineFormatting = (text, baseKey) => {
    const parts = [];
    let inlineCodeCounter = 0;
    const inlineCodeRegex = /`([^`]+)`/g;
    const inlineCodes = [];
    
    text.replace(inlineCodeRegex, (match, code) => {
      inlineCodes.push(code);
      return '';
    });

    let processedText = text.replace(inlineCodeRegex, () => {
      return `__INLINE_CODE_${inlineCodeCounter++}__`;
    });

    processedText = processedText.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>');
    processedText = processedText.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em class="italic">$1</em>');
    processedText = processedText.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-medium">$1</a>'
    );

    const segments = processedText.split(/(__INLINE_CODE_\d+__)/);

    return segments.map((segment, index) => {
      const codeMatch = segment.match(/__INLINE_CODE_(\d+)__/);
      if (codeMatch) {
        const codeIndex = parseInt(codeMatch[1]);
        return (
          <code 
            key={`${baseKey}-code-${index}`} 
            className="px-1.5 py-0.5 bg-muted rounded text-[13px] font-mono border border-border text-primary font-medium"
          >
            {inlineCodes[codeIndex]}
          </code>
        );
      } else if (segment) {
        return (
          <span 
            key={`${baseKey}-text-${index}`} 
            dangerouslySetInnerHTML={{ __html: segment }} 
          />
        );
      }
      return null;
    }).filter(Boolean);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-background sm:rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)] w-full max-w-5xl h-full sm:h-[90vh] flex flex-col border-0 sm:border border-border overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform hover:rotate-12 duration-300">
                <Bot className="h-5.5 w-5.5 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-background" title="Online" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">Doubt Clear AI</h2>
                <div className="px-1.5 py-0.5 bg-primary/10 rounded text-[10px] font-bold text-primary uppercase tracking-wider">Tutor</div>
              </div>
              <p className="text-[12px] text-muted-foreground font-medium flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary" />
                Adaptive Learning Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearChat}
                className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Clear conversation"
              >
                <Eraser className="h-4.5 w-4.5" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="h-9 w-9 text-muted-foreground hover:bg-muted transition-all"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chat Body */}
        <ScrollArea className="flex-1 bg-gradient-to-b from-muted/5 to-transparent">
          <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-8 min-h-full">
            
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-6 ring-1 ring-primary/20">
                  <MessageCircle className="h-10 w-10 text-primary opacity-40" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-2">How can I help you today?</h3>
                <p className="text-muted-foreground max-w-md mb-10 text-sm leading-relaxed">
                  I'm your AI tutor, ready to clarify complex concepts, help you debug code, or guide you through your learning journey.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-4">
                  {suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(prompt.text)}
                      className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted hover:border-primary/30 transition-all text-left group"
                    >
                      <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        {prompt.icon}
                      </div>
                      <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">{prompt.text}</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 ring-1 ring-primary/20">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    
                    <div className={`group relative flex flex-col gap-1.5 max-w-[85%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`rounded-2xl px-5 py-4 shadow-sm transition-all duration-300 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'bg-card border border-border hover:shadow-md'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        ) : (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            {formatMessage(message.content)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 px-1">
                        <span className="text-[10px] font-semibold text-muted-foreground/60 tracking-wider">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.role === 'assistant' && (
                          <button
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground/60 hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                            title="Copy message"
                          >
                            {copiedMessageId === message.id ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {message.role === 'user' && (
                      <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 mt-1 border border-border">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-4 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 ring-1 ring-primary/20">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div className="bg-card border border-border rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground tracking-wide uppercase">AI is thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-background/50 backdrop-blur-md border-t border-border">
          <div className="max-w-4xl mx-auto">
            <div className="relative group transition-all">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-focus-within:bg-primary/10 transition-all opacity-0 group-focus-within:opacity-100" />
              
              <div className="relative flex items-end gap-2.5 bg-card border-2 border-border rounded-2xl p-2 pl-4 shadow-sm group-focus-within:border-primary/50 group-focus-within:shadow-md transition-all">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask a question or request an explanation..."
                  disabled={isLoading}
                  rows={1}
                  className="flex-1 min-h-[44px] max-h-[160px] py-3 bg-transparent border-0 focus:ring-0 text-[15px] placeholder:text-muted-foreground/60 resize-none transition-all scrollbar-none"
                  style={{ height: 'auto' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                />
                
                <div className="flex items-center gap-1.5 pr-1 pb-1">
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isLoading}
                    size="icon"
                    className="h-9 w-9 rounded-xl shadow-lg shadow-primary/20 disabled:shadow-none transition-all hover:scale-105 active:scale-95"
                  >
                    <Send className="h-4.5 w-4.5" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3.5 px-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70 font-medium">
                  <HelpCircle className="h-3 w-3" />
                  <span>Ask anything</span>
                </div>
                <div className="w-1 h-1 bg-border rounded-full" />
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70 font-medium">
                  <Zap className="h-3 w-3" />
                  <span>Instant response</span>
                </div>
              </div>
              <p className="hidden sm:block text-[11px] text-muted-foreground/50 font-medium tracking-tight">
                <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border/50 text-[9px]">Enter</kbd> to send • <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border/50 text-[9px]">Shift+Enter</kbd> for newline
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubtClearAI;
