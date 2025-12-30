"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Lightbulb, Brain, Sparkles, Zap, BookOpen, Target } from "lucide-react";

const LEARNING_TIPS = [
  {
    icon: Brain,
    category: "Did you know?",
    text: "Testing yourself improves retention by 40%.",
  },
  {
    icon: Lightbulb,
    category: "Tip",
    text: "Short study sessions beat long, distracted ones.",
  },
  {
    icon: Sparkles,
    category: "AI Insight",
    text: "KnowGrow builds your course based on how humans learn.",
  },
  {
    icon: Zap,
    category: "Science",
    text: "AI is structuring chapters to reduce cognitive load.",
  },
  {
    icon: BookOpen,
    category: "Did you know?",
    text: "Spaced repetition can boost memory by up to 200%.",
  },
  {
    icon: Target,
    category: "Tip",
    text: "Setting clear goals increases learning speed by 25%.",
  },
  {
    icon: Brain,
    category: "Science",
    text: "Your brain creates new neural pathways as you learn.",
  },
  {
    icon: Sparkles,
    category: "AI Insight",
    text: "Content is being optimized for your skill level.",
  },
  {
    icon: Lightbulb,
    category: "Tip",
    text: "Taking notes by hand improves comprehension.",
  },
  {
    icon: Zap,
    category: "Did you know?",
    text: "Active recall is 3x more effective than re-reading.",
  },
];

const GENERATION_STAGES = [
  "Analyzing your learning goals",
  "Structuring course chapters",
  "Generating detailed content",
  "Adding interactive elements",
  "Finding relevant videos",
  "Finalizing your course",
];

function GenerationExperience({ progress = 0, progressMessage = "", isVisible = true }) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [fadeState, setFadeState] = useState("in");

  const rotateTip = useCallback(() => {
    setFadeState("out");
    setTimeout(() => {
      setCurrentTipIndex((prev) => (prev + 1) % LEARNING_TIPS.length);
      setFadeState("in");
    }, 300);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(rotateTip, 4000);
    return () => clearInterval(interval);
  }, [isVisible, rotateTip]);

  if (!isVisible) return null;

  const currentTip = LEARNING_TIPS[currentTipIndex];
  const IconComponent = currentTip.icon;

  const stageIndex = Math.min(
    Math.floor((progress / 100) * GENERATION_STAGES.length),
    GENERATION_STAGES.length - 1
  );
  const currentStage = GENERATION_STAGES[stageIndex];

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full shadow-md">
            Creating Your Course
          </div>
        </div>

        <div className="mt-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              {currentStage}
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-3 bg-emerald-200/50 dark:bg-emerald-900/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
          {progressMessage && (
            <p className="mt-2 text-xs text-emerald-600/80 dark:text-emerald-400/80 animate-pulse">
              {progressMessage}
            </p>
          )}
        </div>

        <div className="relative min-h-[100px] flex items-center justify-center">
          <div
            className={`flex flex-col items-center text-center transition-all duration-300 ${
              fadeState === "in"
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            <div className="mb-3 p-3 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full">
              <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider mb-1">
              {currentTip.category}
            </span>
            <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium max-w-xs">
              {currentTip.text}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-1.5 mt-4">
          {LEARNING_TIPS.slice(0, 5).map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentTipIndex % 5
                  ? "bg-emerald-500 scale-125"
                  : "bg-emerald-300/50 dark:bg-emerald-700/50"
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

export default GenerationExperience;
