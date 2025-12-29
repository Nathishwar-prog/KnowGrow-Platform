"use client";
import React, { useMemo } from "react";
import { 
  Terminal, Check, Copy, Activity, 
  AlertCircle, Sparkles, Table as TableIcon 
} from "lucide-react";
import CustomSyntaxHighlighter from "./CustomSyntaxHighlighter";
import MermaidRenderer from "./MermaidRenderer";
import { Button } from "../../../@/components/ui/button";

const MarkdownRenderer = ({ content, copiedMessageId, onCopy }) => {
  const processInlineFormatting = (text, baseKey) => {
    if (typeof text !== 'string') return text;
    
    const parts = [];
    let inlineCodeCounter = 0;
    const inlineCodeRegex = /`([^`]+)`/g;
    const inlineCodes = [];
    
    text.replace(inlineCodeRegex, (match, code) => {
      inlineCodes.push(code);
      return '';
    });

    let processedText = text.replace(inlineCodeRegex, () => `__INLINE_CODE_${inlineCodeCounter++}__`);
    
    // Bold
    processedText = processedText.replace(/\*\*(.+?)\*\*/g, '<strong class="font-black text-foreground decoration-primary/30 decoration-2 underline-offset-4">$1</strong>');
    // Italic
    processedText = processedText.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em class="italic opacity-90">$1</em>');
    // Links
    processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline decoration-primary/30 underline-offset-4 font-black transition-colors">$1</a>');

    const segments = processedText.split(/(__INLINE_CODE_\d+__)/);

    return segments.map((segment, index) => {
      const codeMatch = segment.match(/__INLINE_CODE_(\d+)__/);
      if (codeMatch) {
        const codeIndex = parseInt(codeMatch[1]);
        return (
          <code key={`${baseKey}-c-${index}`} className="mx-1 px-2 py-0.5 bg-primary/10 rounded-lg text-[14px] font-mono border border-primary/20 text-primary font-bold shadow-sm">
            {inlineCodes[codeIndex]}
          </code>
        );
      } else if (segment) {
        return <span key={`${baseKey}-t-${index}`} dangerouslySetInnerHTML={{ __html: segment }} />;
      }
      return null;
    }).filter(Boolean);
  };

  const renderTable = (rows, key) => {
    if (rows.length < 2) return null;

    const headerRow = rows[0].split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
    const bodyRows = rows.slice(2).map(row => 
      row.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim())
    );

    return (
      <div key={key} className="my-8 overflow-hidden rounded-2xl border border-border/60 shadow-xl bg-card/50 backdrop-blur-sm animate-in zoom-in-95 duration-500">
        <div className="bg-muted/50 px-4 py-2 flex items-center gap-2 border-b border-border/50">
          <TableIcon className="h-4 w-4 text-primary/60" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Data Structure Analysis</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5">
                {headerRow.map((header, i) => (
                  <th key={i} className="px-6 py-4 text-sm font-black text-foreground border-b border-border/50 uppercase tracking-wider">
                    {processInlineFormatting(header, `th-${key}-${i}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {bodyRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-primary/5 transition-colors group">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 text-sm text-foreground/80 font-medium border-b border-border/10">
                      {processInlineFormatting(cell, `td-${key}-${rowIndex}-${cellIndex}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const elements = useMemo(() => {
    if (!content) return null;
    const result = [];
    
    // Pattern extraction (Mermaid, Code Blocks)
    const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const specialBlocks = [];
    let match;
    
    while ((match = mermaidRegex.exec(content)) !== null) {
      specialBlocks.push({
        start: match.index, end: match.index + match[0].length,
        type: 'mermaid', content: match[1].trim(), id: `mermaid-${match.index}`
      });
    }
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (!specialBlocks.some(b => b.start <= match.index && b.end >= (match.index + match[0].length))) {
        specialBlocks.push({
          start: match.index, end: match.index + match[0].length,
          type: 'code', language: match[1] || 'text', content: match[2].trim(), id: `code-${match.index}`
        });
      }
    }
    
    specialBlocks.sort((a, b) => a.start - b.start);

    let textContent = content;
    specialBlocks.forEach(block => {
      textContent = textContent.replace(content.substring(block.start, block.end), `__SPECIAL_BLOCK_${block.id}__`);
    });

    const lines = textContent.split('\n');
    let inList = false;
    let inNumberedList = false;
    let inTable = false;
    let listItems = [];
    let numberedItems = [];
    let tableRows = [];
    let listStartIndex = 0;
    let numberedListStartIndex = 0;
    let tableStartIndex = 0;

    const closeLists = (idx) => {
      if (inList) {
        result.push(<ul key={`list-${listStartIndex}-${idx}`} className="ml-8 my-6 space-y-4 list-disc marker:text-primary/60">{listItems}</ul>);
        listItems = []; inList = false;
      }
      if (inNumberedList) {
        result.push(<ol key={`nlist-${numberedListStartIndex}-${idx}`} className="ml-8 my-6 space-y-4 list-decimal marker:text-primary/60">{numberedItems}</ol>);
        numberedItems = []; inNumberedList = false;
      }
      if (inTable) {
        result.push(renderTable(tableRows, `table-${tableStartIndex}-${idx}`));
        tableRows = []; inTable = false;
      }
    };

    lines.forEach((line, lineIndex) => {
      const trimmedLine = line.trim();
      
      // Handle Special Blocks
      if (trimmedLine.startsWith('__SPECIAL_BLOCK_')) {
        closeLists(lineIndex);
        const blockId = trimmedLine.replace('__SPECIAL_BLOCK_', '').replace('__', '');
        const block = specialBlocks.find(b => b.id === blockId);
        
        if (block) {
          if (block.type === 'mermaid') {
            result.push(
              <div key={block.id} className="my-8 animate-in zoom-in-95 duration-500">
                <div className="flex items-center gap-2 mb-3 px-4 py-1.5 bg-primary/5 rounded-full w-fit border border-primary/20">
                  <Activity className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[10px] font-black tracking-widest text-primary uppercase">System Architecture Diagram</span>
                </div>
                <MermaidRenderer chart={block.content} />
              </div>
            );
          } else {
            const langColors = {
              python: { border: 'border-blue-500/30', icon: 'text-blue-400' },
              javascript: { border: 'border-yellow-500/30', icon: 'text-yellow-400' },
              typescript: { border: 'border-blue-600/30', icon: 'text-blue-500' },
              html: { border: 'border-orange-500/30', icon: 'text-orange-400' },
              css: { border: 'border-purple-500/30', icon: 'text-purple-400' },
              json: { border: 'border-neutral-500/30', icon: 'text-neutral-400' },
            };
            const branding = langColors[block.language.toLowerCase()] || { border: 'border-border', icon: 'text-primary' };

            result.push(
              <div key={block.id} className={`my-8 rounded-2xl overflow-hidden border ${branding.border} shadow-2xl animate-in slide-in-from-bottom-4 duration-500`}>
                <div className={`bg-muted/80 backdrop-blur-md px-5 py-3 flex items-center justify-between border-b ${branding.border}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5 mr-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                    </div>
                    <span className={`text-[10px] font-black font-mono ${branding.icon} uppercase tracking-[0.2em] flex items-center gap-2`}>
                      <Terminal className="h-3.5 w-3.5" />
                      {block.language}
                    </span>
                  </div>
                  {onCopy && (
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => onCopy(block.content, block.id)}
                      className="h-8 px-3 text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all"
                    >
                      {copiedMessageId === block.id ? (
                        <span className="flex items-center gap-1.5 text-emerald-500"><Check className="h-3 w-3" /> Copied</span>
                      ) : (
                        <span className="flex items-center gap-1.5"><Copy className="h-3 w-3" /> Copy</span>
                      )}
                    </Button>
                  )}
                </div>
                <div className="relative overflow-x-auto bg-[#1e1e1e]">
                  <CustomSyntaxHighlighter language={block.language} theme="dark">
                    {block.content}
                  </CustomSyntaxHighlighter>
                </div>
              </div>
            );
          }
        }
        return;
      }

      // Handle Tables
      if (trimmedLine.startsWith('|')) {
        if (!inTable) { 
          closeLists(lineIndex);
          inTable = true; 
          tableStartIndex = lineIndex; 
        }
        tableRows.push(trimmedLine);
        return;
      } else if (inTable) {
        result.push(renderTable(tableRows, `table-${tableStartIndex}`));
        tableRows = []; inTable = false;
      }

      // Handle Headers
      const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        closeLists(lineIndex);
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        const HeadingTag = `h${level}`;
        const sizes = {
          1: 'text-3xl font-black mt-12 mb-6 tracking-tight',
          2: 'text-2xl font-extrabold mt-10 mb-5 tracking-tight',
          3: 'text-xl font-bold mt-8 mb-4',
          4: 'text-lg font-bold mt-6 mb-3',
          5: 'text-base font-bold mt-5 mb-2',
          6: 'text-sm font-bold mt-4 mb-2'
        };

        result.push(
          <div key={`h-container-${lineIndex}`} className="relative group">
            {level <= 2 && <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />}
            {React.createElement(
              HeadingTag,
              { className: `${sizes[level]} text-foreground flex items-center gap-3` },
              <>{processInlineFormatting(text, `h-${lineIndex}`)}</>
            )}
            {level === 1 && <div className="h-1 w-20 bg-primary/20 rounded-full mb-8" />}
          </div>
        );
        return;
      }

      // Handle Lists
      const listMatch = trimmedLine.match(/^[-*•]\s+(.+)$/);
      if (listMatch) {
        if (!inList) { closeLists(lineIndex); inList = true; listStartIndex = lineIndex; }
        listItems.push(<li key={`li-${lineIndex}`} className="text-[16px] leading-relaxed pl-2 text-foreground/80 font-medium">{processInlineFormatting(listMatch[1], `li-${lineIndex}`)}</li>);
        return;
      }

      const numberedMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);
      if (numberedMatch) {
        if (!inNumberedList) { closeLists(lineIndex); inNumberedList = true; numberedListStartIndex = lineIndex; }
        numberedItems.push(<li key={`nli-${lineIndex}`} className="text-[16px] leading-relaxed pl-2 text-foreground/80 font-medium">{processInlineFormatting(numberedMatch[1], `nli-${lineIndex}`)}</li>);
        return;
      }

      // Handle Callouts
      const isWarning = trimmedLine.startsWith('⚠️') || trimmedLine.includes('**Warning:**');
      if (isWarning) {
        closeLists(lineIndex);
        result.push(
          <div key={`warn-${lineIndex}`} className="bg-destructive/5 border-l-4 border-destructive rounded-2xl p-6 my-8 shadow-sm group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-black text-destructive uppercase tracking-widest block mb-1">Attention Required</span>
                <p className="text-[15px] font-bold leading-relaxed text-destructive/90">{processInlineFormatting(trimmedLine.replace(/⚠️|\*\*Warning:\*\*/g, '').trim(), `warn-txt-${lineIndex}`)}</p>
              </div>
            </div>
          </div>
        );
        return;
      }

      if (trimmedLine.startsWith('💡') || trimmedLine.includes('**Tip:**')) {
        closeLists(lineIndex);
        result.push(
          <div key={`tip-${lineIndex}`} className="bg-primary/5 border-l-4 border-primary rounded-2xl p-6 my-8 shadow-sm group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-black text-primary uppercase tracking-widest block mb-1">Expert Insight</span>
                <p className="text-[15px] font-bold leading-relaxed text-primary/90">{processInlineFormatting(trimmedLine.replace(/💡|\*\*Tip:\*\*/g, '').trim(), `tip-txt-${lineIndex}`)}</p>
              </div>
            </div>
          </div>
        );
        return;
      }

      // Regular Paragraphs
      if (trimmedLine) {
        if (!inList && !inNumberedList && !inTable) {
          result.push(<p key={`p-${lineIndex}`} className="text-[17px] leading-relaxed my-5 text-foreground/80 font-normal">{processInlineFormatting(line, `p-${lineIndex}`)}</p>);
        }
      } else {
        closeLists(lineIndex);
        result.push(<div key={`space-${lineIndex}`} className="h-4" />);
      }
    });

    closeLists(lines.length);
    return result;
  }, [content, copiedMessageId, onCopy]);

  return <>{elements}</>;
};

export default MarkdownRenderer;
