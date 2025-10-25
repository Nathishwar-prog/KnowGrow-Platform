"use client";
import React from "react";

// Custom syntax highlighter that doesn't require external dependencies
const CustomSyntaxHighlighter = ({ children, language = "text", theme = "light" }) => {
  const isDark = theme === 'dark';
  
  // Basic syntax highlighting for common languages
  const highlightCode = (code, lang) => {
    if (!lang || lang === 'text') return code;
    
    // Simple keyword highlighting
    const keywords = {
      javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'async', 'await'],
      python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'return', 'try', 'except', 'finally'],
      java: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static', 'final', 'if', 'else', 'for', 'while', 'return'],
      css: ['@media', '@keyframes', '@import', 'margin', 'padding', 'border', 'color', 'background', 'font', 'display', 'position'],
      sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'JOIN', 'GROUP BY', 'ORDER BY']
    };
    
    const langKeywords = keywords[lang] || [];
    let highlightedCode = code;
    
    // Highlight keywords
    langKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlightedCode = highlightedCode.replace(regex, `<span class="keyword">${keyword}</span>`);
    });
    
    // Highlight strings
    highlightedCode = highlightedCode.replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="string">$1$2$1</span>');
    
    // Highlight comments
    if (lang === 'javascript' || lang === 'java') {
      highlightedCode = highlightedCode.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
      highlightedCode = highlightedCode.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
    } else if (lang === 'python') {
      highlightedCode = highlightedCode.replace(/(#.*$)/gm, '<span class="comment">$1</span>');
    } else if (lang === 'css') {
      highlightedCode = highlightedCode.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
    }
    
    // Highlight numbers
    highlightedCode = highlightedCode.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');
    
    return highlightedCode;
  };
  
  const highlightedCode = highlightCode(children, language);
  
  return (
    <div className="relative">
      <pre 
        className={`p-4 rounded-lg overflow-x-auto text-sm font-mono ${
          isDark 
            ? 'bg-gray-900 text-gray-100 border border-gray-700' 
            : 'bg-gray-100 text-gray-900 border border-gray-300'
        }`}
      >
        <code 
          className={`${isDark ? 'text-gray-100' : 'text-gray-900'}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
      <style jsx>{`
        .keyword {
          color: ${isDark ? '#c678dd' : '#d73a49'};
          font-weight: 600;
        }
        .string {
          color: ${isDark ? '#98c379' : '#032f62'};
        }
        .comment {
          color: ${isDark ? '#5c6370' : '#6a737d'};
          font-style: italic;
        }
        .number {
          color: ${isDark ? '#d19a66' : '#005cc5'};
        }
      `}</style>
    </div>
  );
};

export default CustomSyntaxHighlighter;

