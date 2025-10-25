"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../../@/components/ui/button";
import { Input } from "../../../@/components/ui/input";
import { ScrollArea } from "../../../@/components/ui/scroll-area";
import { Send, Bot, User, Copy, Check, Loader2, BookOpen, Lightbulb, CheckCircle2, AlertCircle, Code2, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import CustomSyntaxHighlighter from "./CustomSyntaxHighlighter";

const DoubtClearAI = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm your Doubt Clear AI tutor. I'm here to help you understand any concept you're struggling with. Just ask me anything you'd like to learn about!",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
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
      const response = await fetch('/api/doubt-clear-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
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

  const formatMessage = (content) => {
    const elements = [];
    
    // Enhanced regex patterns
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    
    // Find all code blocks first
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

    // Remove code blocks from content for text processing
    let textContent = content;
    codeBlocks.forEach(block => {
      textContent = textContent.replace(
        content.substring(block.start, block.end),
        `__CODE_BLOCK_${block.id}__`
      );
    });

    // Process content line by line
    const lines = textContent.split('\n');
    let inList = false;
    let inNumberedList = false;
    let listItems = [];
    let numberedItems = [];
    let listStartIndex = 0;
    let numberedListStartIndex = 0;

    lines.forEach((line, lineIndex) => {
      const trimmedLine = line.trim();
      
      // Check for code block placeholder
      if (trimmedLine.startsWith('__CODE_BLOCK_')) {
        // Close any open lists
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

        // Find and render the code block
        const blockId = trimmedLine.replace('__CODE_BLOCK_', '').replace('__', '');
        const block = codeBlocks.find(b => b.id === blockId);
        if (block) {
          elements.push(
            <div key={block.id} className="my-4 rounded-xl overflow-hidden border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-4 py-3 flex items-center justify-between border-b-2 border-primary/20">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" />
                  <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                    {block.language}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(block.code, block.id)}
                  className="h-8 px-3 text-xs hover:bg-primary/10 transition-colors"
                >
                  {copiedMessageId === block.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                      <span className="text-green-500 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1.5" />
                      <span>Copy Code</span>
                    </>
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

      // Handle headings
      const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        // Close any open lists
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
          1: 'text-2xl font-bold mt-6 mb-4',
          2: 'text-xl font-bold mt-5 mb-3',
          3: 'text-lg font-semibold mt-4 mb-3',
          4: 'text-base font-semibold mt-4 mb-2',
          5: 'text-sm font-semibold mt-3 mb-2',
          6: 'text-sm font-semibold mt-3 mb-1'
        };

        elements.push(
          React.createElement(
            HeadingTag,
            {
              key: `heading-${lineIndex}`,
              className: `${sizes[level]} text-primary flex items-center gap-2 border-l-4 border-primary pl-3 py-1 bg-primary/5 rounded-r-lg`
            },
            <>
              <BookOpen className="h-5 w-5 flex-shrink-0" />
              <span>{processInlineFormatting(text, `heading-${lineIndex}`)}</span>
            </>
          )
        );
        return;
      }

      // Handle bullet lists
      const listMatch = trimmedLine.match(/^[-*•]\s+(.+)$/);
      if (listMatch) {
        if (!inList) {
          inList = true;
          listStartIndex = lineIndex;
        }
        listItems.push(
          <li key={`li-${lineIndex}`} className="text-sm leading-relaxed pl-2 hover:text-primary transition-colors">
            {processInlineFormatting(listMatch[1], `li-${lineIndex}`)}
          </li>
        );
        return;
      } else if (inList && trimmedLine) {
        elements.push(
          <ul key={`list-${listStartIndex}`} className="ml-6 my-4 space-y-2 list-disc marker:text-primary">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }

      // Handle numbered lists
      const numberedMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);
      if (numberedMatch) {
        if (!inNumberedList) {
          inNumberedList = true;
          numberedListStartIndex = lineIndex;
        }
        numberedItems.push(
          <li key={`nli-${lineIndex}`} className="text-sm leading-relaxed pl-2 hover:text-primary transition-colors">
            {processInlineFormatting(numberedMatch[1], `nli-${lineIndex}`)}
          </li>
        );
        return;
      } else if (inNumberedList && trimmedLine) {
        elements.push(
          <ol key={`nlist-${numberedListStartIndex}`} className="ml-6 my-4 space-y-2 list-decimal marker:text-primary">
            {numberedItems}
          </ol>
        );
        numberedItems = [];
        inNumberedList = false;
      }

      // Handle blockquotes
      const blockquoteMatch = trimmedLine.match(/^>\s+(.+)$/);
      if (blockquoteMatch) {
        elements.push(
          <div key={`quote-${lineIndex}`} className="border-l-4 border-primary/60 pl-4 py-3 my-4 bg-primary/5 rounded-r-xl hover:bg-primary/10 transition-colors">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 animate-pulse" />
              <p className="text-sm italic font-medium">{processInlineFormatting(blockquoteMatch[1], `quote-${lineIndex}`)}</p>
            </div>
          </div>
        );
        return;
      }

      // Handle special callouts
      if (trimmedLine.startsWith('⚠️') || trimmedLine.includes('**Note:**') || trimmedLine.includes('**Important:**')) {
        elements.push(
          <div key={`callout-${lineIndex}`} className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-xl p-4 my-4 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5 animate-pulse" />
              <p className="text-sm font-semibold leading-relaxed">{processInlineFormatting(trimmedLine, `callout-${lineIndex}`)}</p>
            </div>
          </div>
        );
        return;
      }

      if (trimmedLine.startsWith('✅') || trimmedLine.includes('**Key Point:**')) {
        elements.push(
          <div key={`keypoint-${lineIndex}`} className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-xl p-4 my-4 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-semibold leading-relaxed">{processInlineFormatting(trimmedLine, `keypoint-${lineIndex}`)}</p>
            </div>
          </div>
        );
        return;
      }

      // Handle special info boxes
      if (trimmedLine.startsWith('💡') || trimmedLine.includes('**Tip:**')) {
        elements.push(
          <div key={`tip-${lineIndex}`} className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-xl p-4 my-4 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-start gap-3">
              <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5 animate-pulse" />
              <p className="text-sm font-semibold leading-relaxed">{processInlineFormatting(trimmedLine, `tip-${lineIndex}`)}</p>
            </div>
          </div>
        );
        return;
      }

      // Regular paragraphs
      if (trimmedLine) {
        elements.push(
          <p key={`p-${lineIndex}`} className="text-sm leading-relaxed my-3 text-foreground/90">
            {processInlineFormatting(line, `p-${lineIndex}`)}
          </p>
        );
      } else {
        elements.push(<div key={`space-${lineIndex}`} className="h-3" />);
      }
    });

    // Add remaining list items
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-end-${listStartIndex}`} className="ml-6 my-4 space-y-2 list-disc marker:text-primary">
          {listItems}
        </ul>
      );
    }
    if (numberedItems.length > 0) {
      elements.push(
        <ol key={`nlist-end-${numberedListStartIndex}`} className="ml-6 my-4 space-y-2 list-decimal marker:text-primary">
          {numberedItems}
        </ol>
      );
    }

    return elements;
  };

  const processInlineFormatting = (text, baseKey) => {
    const parts = [];
    let inlineCodeCounter = 0;

    // Process inline code first and store them
    const inlineCodeRegex = /`([^`]+)`/g;
    const inlineCodes = [];
    
    text.replace(inlineCodeRegex, (match, code) => {
      inlineCodes.push(code);
      return '';
    });

    // Replace inline code with placeholders
    let processedText = text.replace(inlineCodeRegex, () => {
      return `__INLINE_CODE_${inlineCodeCounter++}__`;
    });

    // Process bold (must be before italic to avoid conflicts)
    processedText = processedText.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-primary">$1</strong>');

    // Process italic
    processedText = processedText.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em class="italic">$1</em>');

    // Process links
    processedText = processedText.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline decoration-2 underline-offset-2 font-medium transition-colors">$1</a>'
    );

    // Split by inline code placeholders
    const segments = processedText.split(/(__INLINE_CODE_\d+__)/);

    return segments.map((segment, index) => {
      const codeMatch = segment.match(/__INLINE_CODE_(\d+)__/);
      if (codeMatch) {
        const codeIndex = parseInt(codeMatch[1]);
        return (
          <code 
            key={`${baseKey}-code-${index}`} 
            className="px-2 py-1 bg-muted/80 rounded-md text-xs font-mono border border-primary/20 text-primary font-semibold hover:bg-muted transition-colors"
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col border-2 border-primary/20 animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="p-6 border-b-2 border-primary/20 flex justify-between items-center bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg animate-pulse">
              <Bot className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                Doubt Clear AI
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </h2>
              <p className="text-xs text-muted-foreground font-medium">Your personal AI tutor - Always ready to help</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="hover:bg-destructive/20 hover:text-destructive text-2xl w-10 h-10 rounded-full transition-all"
          >
            ×
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6 bg-gradient-to-b from-background to-muted/20">
          <div className="space-y-6 max-w-4xl mx-auto pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-300`}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-primary/20">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground ml-auto ring-2 ring-primary/30'
                      : 'bg-card/80 backdrop-blur-sm border-2 border-primary/10 hover:border-primary/20'
                  }`}
                >
                  <div className={`prose prose-sm max-w-none ${message.role === 'user' ? 'text-primary-foreground' : ''}`}>
                    {message.role === 'user' ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
                    ) : (
                      <div className="space-y-2">
                        {formatMessage(message.content)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-current/10">
                    <span className={`text-xs font-medium ${message.role === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className={`h-8 w-8 p-0 hover:bg-current/10 transition-all ${message.role === 'user' ? 'text-primary-foreground hover:scale-110' : 'hover:scale-110'}`}
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-blue-500/20">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 justify-start animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-primary/20">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="bg-card/80 backdrop-blur-sm border-2 border-primary/20 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <div className="space-y-1">
                      <span className="text-sm text-foreground font-semibold block">Thinking...</span>
                      <span className="text-xs text-muted-foreground">Analyzing your question</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-6 border-t-2 border-primary/20 bg-gradient-to-r from-muted/40 via-muted/30 to-muted/40">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything you want to understand..."
              disabled={isLoading}
              className="flex-1 h-14 px-5 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 text-base transition-all shadow-sm"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="lg"
              className="h-14 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3 font-medium">
            Press <kbd className="px-2 py-0.5 bg-muted rounded border border-border">Enter</kbd> to send • <kbd className="px-2 py-0.5 bg-muted rounded border border-border">Shift + Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoubtClearAI;