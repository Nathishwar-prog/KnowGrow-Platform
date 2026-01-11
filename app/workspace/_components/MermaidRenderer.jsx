"use client";
import React, { useEffect, useRef, useState } from "react";

const MermaidRenderer = ({ chart }) => {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const renderMermaid = async () => {
      try {
        // Dynamically load mermaid from CDN if not already present
        if (!window.mermaid) {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
          script.async = true;
          script.onload = () => {
            if (isMounted) initializeAndRender();
          };
          document.head.appendChild(script);
        } else {
          initializeAndRender();
        }
      } catch (err) {
        console.error("Mermaid error:", err);
        setError(true);
      }
    };

    const initializeAndRender = () => {
      if (!window.mermaid) return;

      window.mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
        fontFamily: "inherit",
        flowchart: { useMaxWidth: true, htmlLabels: true, curve: "basis" },
      });

      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      window.mermaid.render(id, chart).then(({ svg }) => {
        if (isMounted) {
          setSvg(svg);
        }
      }).catch((err) => {
        console.error("Mermaid render error:", err);
        if (isMounted) setError(true);
      });
    };

    renderMermaid();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs font-mono">
        Failed to render Mermaid diagram.
        <pre className="mt-2 whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="mermaid-container flex justify-center overflow-x-auto p-4 bg-background/50 backdrop-blur-sm rounded-2xl border border-primary/20 shadow-inner"
      dangerouslySetInnerHTML={{ __html: svg || '<div class="animate-pulse flex space-x-4"><div class="flex-1 space-y-4 py-1"><div class="h-4 bg-primary/20 rounded w-3/4"></div><div class="space-y-2"><div class="h-4 bg-primary/20 rounded"></div><div class="h-4 bg-primary/20 rounded w-5/6"></div></div></div></div>' }}
    />
  );
};

export default MermaidRenderer;
