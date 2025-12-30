"use client";

import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "../../@/components/ui/dialog";
import { Button } from "../../@/components/ui/button";
import { Coffee, Brain, Sparkles, Play } from "lucide-react";
import { useFocusTimer } from "../../context/FocusTimerContext";

export function GlobalFocusAlert() {
  const { 
    showAlert, 
    alertType, 
    dismissAlert, 
    startBreak, 
    endBreakAndContinue, 
    stopFocusMode 
  } = useFocusTimer();

  const getAlertContent = () => {
    switch (alertType) {
      case "suggestion":
        return {
          icon: <Coffee className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
          title: "Time for a Brain Break",
          description: "You've reached the 25-minute mark. A short 5-minute break helps maintain peak mental performance.",
          primaryAction: { label: "Take Break (5 min)", action: startBreak },
          secondaryAction: { label: "Continue Studying", action: dismissAlert }
        };
      case "warning":
        return {
          icon: <Brain className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
          title: "Deep Focus Warning",
          description: "You've been focused for over 50 minutes. Continuous learning without rest reduces long-term retention.",
          primaryAction: { label: "Take Break (5 min)", action: startBreak },
          secondaryAction: { label: "Continue Anyway", action: dismissAlert }
        };
      case "focus_complete":
        return {
          icon: <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />,
          title: "Focus Session Complete!",
          description: "Great work! You've completed a focus session. It's time to take a short break to recharge.",
          primaryAction: { label: "Take Break (5 min)", action: startBreak },
          secondaryAction: { label: "Continue Studying", action: dismissAlert }
        };
      case "break_complete":
        return {
          icon: <Play className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
          title: "Break Complete",
          description: "Break complete. Ready to focus again?",
          primaryAction: { label: "Continue Course", action: endBreakAndContinue },
          secondaryAction: { label: "Stop Focus Mode", action: stopFocusMode }
        };
      default:
        return null;
    }
  };

  const content = getAlertContent();
  if (!content) return null;

  return (
    <Dialog open={showAlert} onOpenChange={dismissAlert}>
      <DialogContent className="sm:max-w-md bg-card border-border/50">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
            {content.icon}
          </div>
          <DialogTitle className="text-center text-xl font-bold">
            {content.title}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground pt-2">
            {content.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={content.secondaryAction.action}
            className="flex-1 border-border/50"
          >
            {content.secondaryAction.label}
          </Button>
          <Button 
            onClick={content.primaryAction.action}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
          >
            {content.primaryAction.label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
