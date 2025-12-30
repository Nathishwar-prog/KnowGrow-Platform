"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, ArrowRight, Sparkles, BookOpen, HelpCircle, BrainCircuit } from "lucide-react";
import { Button } from "./button";
import { cn } from "../../lib/utils";

const tourSteps = [
  {
    id: "welcome",
    type: "modal",
    title: "Welcome to KnowGrow!",
    description: "Your AI-powered learning companion. Let's take a quick tour to help you get started.",
    icon: Sparkles,
  },
  {
    id: "create-course",
    type: "highlight",
    selector: '[data-onboarding="create-course"]',
    title: "Create Your Course",
    description: "Click here to generate personalized courses on any topic using AI.",
    icon: BookOpen,
    position: "bottom",
  },
  {
    id: "doubt-ai",
    type: "highlight", 
    selector: '[data-onboarding="doubt-ai"]',
    title: "Doubt Clarification AI",
    description: "Stuck on something? Ask questions anytime and get instant explanations.",
    icon: HelpCircle,
    position: "bottom",
  },
  {
    id: "quiz-ai",
    type: "highlight",
    selector: '[data-onboarding="quiz-ai"]',
    title: "AI Quiz",
    description: "Test your knowledge with AI-generated quizzes tailored to your learning.",
    icon: BrainCircuit,
    position: "bottom",
  },
];

function Spotlight({ targetRect, padding = 8 }) {
  if (!targetRect) return null;

  const { top, left, width, height } = targetRect;

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none">
      <svg className="w-full h-full">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={left - padding}
              y={top - padding}
              width={width + padding * 2}
              height={height + padding * 2}
              rx="12"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#spotlight-mask)"
        />
      </svg>
      <div
        className="absolute border-2 border-emerald-500 rounded-xl animate-pulse"
        style={{
          top: top - padding,
          left: left - padding,
          width: width + padding * 2,
          height: height + padding * 2,
          boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.2), 0 0 20px rgba(16, 185, 129, 0.4)",
        }}
      />
    </div>
  );
}

function TooltipCard({ step, currentStep, totalSteps, onNext, onSkip, targetRect }) {
  const Icon = step.icon;
  
  const getPosition = () => {
    if (!targetRect || step.type === "modal") {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const { top, left, width, height } = targetRect;
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const gap = 16;

    let style = { position: "fixed" };

    if (step.position === "bottom") {
      style.top = top + height + gap;
      style.left = Math.max(16, Math.min(left + width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 16));
    } else if (step.position === "top") {
      style.top = top - tooltipHeight - gap;
      style.left = Math.max(16, Math.min(left + width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 16));
    } else if (step.position === "left") {
      style.top = top + height / 2 - tooltipHeight / 2;
      style.left = left - tooltipWidth - gap;
    } else {
      style.top = top + height / 2 - tooltipHeight / 2;
      style.left = left + width + gap;
    }

    return style;
  };

  return (
    <div
      className={cn(
        "z-[9999] w-80 bg-card border border-border rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-300",
        step.type === "modal" && "w-96"
      )}
      style={getPosition()}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-foreground">{step.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i === currentStep
                  ? "w-6 bg-emerald-500"
                  : i < currentStep
                  ? "bg-emerald-500/50"
                  : "bg-muted"
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip
          </Button>
          <Button
            size="sm"
            onClick={onNext}
            className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1"
          >
            {currentStep === totalSteps - 1 ? "Finish" : "Next"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function OnboardingTour({ isOpen, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  const step = tourSteps[currentStep];

  const updateTargetRect = useCallback(() => {
    if (step.type === "highlight" && step.selector) {
      const element = document.querySelector(step.selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  }, [step]);

  useEffect(() => {
    if (!isOpen) return;

    updateTargetRect();

    const handleResize = () => updateTargetRect();
    const handleScroll = () => updateTargetRect();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, updateTargetRect]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <>
      {step.type === "highlight" ? (
        <Spotlight targetRect={targetRect} />
      ) : (
        <div className="fixed inset-0 z-[9998] bg-black/75" />
      )}
      
      <TooltipCard
        step={step}
        currentStep={currentStep}
        totalSteps={tourSteps.length}
        onNext={handleNext}
        onSkip={handleSkip}
        targetRect={targetRect}
      />
    </>
  );
}
