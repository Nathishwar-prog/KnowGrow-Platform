"use client"
import React, { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-markup"; // html/xml

// Enhances rendered HTML content: styles code blocks and adds copy buttons
function CodeEnhancer({ containerId }) {
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const pres = container.querySelectorAll('pre');
    pres.forEach((pre) => {
      // Skip if already enhanced
      if (pre.dataset.enhanced === 'true') return;
      pre.dataset.enhanced = 'true';

      pre.classList.add('kg-code', 'p-4', 'rounded-md', 'relative', 'group');

      // Find code element
      const code = pre.querySelector('code');
      let lang = null;

      if (code) {
        // Detect language from class (e.g., language-javascript)
        const className = code.className || '';
        const match = className.match(/language-(\w+)/);
        lang = match ? match[1] : null;

        // If no language class, try to infer or just highlight as plain text/markup if it looks like code
        if (!lang) {
          // Fallback: check if it looks like HTML/XML
          if (code.innerText.trim().startsWith('<')) {
            lang = 'markup';
          } else {
            lang = 'javascript'; // Default fallback to JS/TS often works well for generic code
          }
        }

        if (lang && Prism.languages[lang]) {
          try {
            const html = Prism.highlight(code.innerText, Prism.languages[lang], lang);
            code.innerHTML = html;
            code.classList.add('language-' + lang);
          } catch (e) {
            console.warn("Highlighting failed", e);
          }
        }
      }

      // Wrap with a positioned container for copy button
      const wrap = document.createElement('div');
      wrap.className = 'kg-code-wrap relative my-4 rounded-lg border bg-card overflow-hidden';
      pre.parentNode?.insertBefore(wrap, pre);

      // Header for code block
      const header = document.createElement('div');
      header.className = 'px-4 py-2 text-xs text-muted-foreground border-b flex items-center justify-between bg-muted/30';
      header.innerHTML = `
        <div class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>${lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : 'Code'}</span>
        </div>
      `;
      wrap.appendChild(header);

      // Move pre into wrap
      wrap.appendChild(pre);

      // Create copy button in header
      const btn = document.createElement('button');
      btn.className = 'text-xs hover:text-primary transition-colors';
      btn.type = 'button';
      btn.textContent = 'Copy';
      btn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(pre.innerText);
          btn.textContent = 'Copied!';
          setTimeout(() => (btn.textContent = 'Copy'), 1200);
        } catch { }
      };
      header.appendChild(btn);
    });
  }, [containerId]);

  return null;
}

export default CodeEnhancer;
