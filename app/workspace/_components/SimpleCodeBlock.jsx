"use client";
import React from "react";

// Simple fallback syntax highlighter component
const SimpleCodeBlock = ({ children, language = "text", theme = "light" }) => {
  const isDark = theme === 'dark';
  
  return (
    <pre 
      className={`p-4 rounded-lg overflow-x-auto text-sm font-mono ${
        isDark 
          ? 'bg-gray-900 text-gray-100 border border-gray-700' 
          : 'bg-gray-100 text-gray-900 border border-gray-300'
      }`}
    >
      <code className={isDark ? 'text-gray-100' : 'text-gray-900'}>
        {children}
      </code>
    </pre>
  );
};

export default SimpleCodeBlock;

