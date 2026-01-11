"use client";

import React from "react";
import { Sparkles, Coffee } from "lucide-react";
import { useFocusTimer } from "../../context/FocusTimerContext";

export function GlobalFocusBadge() {
  const { isFocusActive, isOnBreak, sessionType } = useFocusTimer();

  const isVisible = isFocusActive || isOnBreak;

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`flex items-center gap-2 px-4 py-2 backdrop-blur-sm text-white rounded-full shadow-lg border ${
        sessionType === "focus" 
          ? "bg-indigo-600/90 dark:bg-indigo-500/90 border-indigo-400/30" 
          : "bg-emerald-600/90 dark:bg-emerald-500/90 border-emerald-400/30"
      }`}>
        {sessionType === "focus" ? (
          <Sparkles className="w-4 h-4 animate-pulse" />
        ) : (
          <Coffee className="w-4 h-4 animate-pulse" />
        )}
        <span className="text-sm font-medium tracking-wide">
          {sessionType === "focus" ? "AI Focus Mode Active" : "Break Mode Active"}
        </span>
        <div className="flex gap-1 ml-1">
          <span className="w-1 h-1 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1 h-1 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1 h-1 bg-white/40 rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  );
}
