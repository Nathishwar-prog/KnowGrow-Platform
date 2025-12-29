"use client";
import React, { useEffect, useRef } from "react";
import Prism from "prismjs";

// Import Prism themes and languages
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";

const CustomSyntaxHighlighter = ({ children, language = "text", theme = "dark" }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [children, language]);

  const langClass = `language-${language}`;

  return (
    <div className="relative group">
      <pre 
        className={`${langClass} !m-0 !p-4 !bg-transparent text-sm font-mono scrollbar-thin scrollbar-thumb-white/10`}
      >
        <code 
          ref={codeRef}
          className={langClass}
        >
          {children}
        </code>
      </pre>
      
      {/* Custom styles to override Prism defaults for better integration */}
      <style jsx global>{`
        pre[class*="language-"] {
          background: transparent !important;
          text-shadow: none !important;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
        }
        code[class*="language-"] {
          text-shadow: none !important;
        }
        .token.comment, .token.prolog, .token.doctype, .token.cdata { color: #6a9955 !important; }
        .token.punctuation { color: #d4d4d4 !important; }
        .token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol, .token.deleted { color: #b5cea8 !important; }
        .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted { color: #ce9178 !important; }
        .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string { color: #d4d4d4 !important; }
        .token.atrule, .token.attr-value, .token.keyword { color: #569cd6 !important; }
        .token.function, .token.class-name { color: #dcdcaa !important; }
        .token.regex, .token.important, .token.variable { color: #d16969 !important; }
      `}</style>
    </div>
  );
};

export default CustomSyntaxHighlighter;
