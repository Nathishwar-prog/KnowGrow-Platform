"use client";

import React from "react";
import { Play, Pause, RotateCcw, Coffee, Zap, Square, Sparkles } from "lucide-react";
import { Card, CardContent } from "../../../@/components/ui/card";
import { Button } from "../../../@/components/ui/button";
import { cn } from "../../../@/lib/utils";
import { useFocusTimer } from "../../../context/FocusTimerContext";

const StudyTimer = () => {
  const {
    isFocusActive,
    isOnBreak,
    remainingTime,
    sessionType,
    sessionsCompleted,
    startFocus,
    pauseFocus,
    resumeFocus,
    startBreak,
    stopFocusMode,
    FOCUS_DURATION,
    BREAK_DURATION
  } = useFocusTimer();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isRunning = isFocusActive || isOnBreak;
  const initialTime = sessionType === "focus" ? FOCUS_DURATION : BREAK_DURATION;

  const handleToggle = () => {
    if (isRunning) {
      if (sessionType === "focus") {
        pauseFocus();
      }
    } else {
      if (sessionType === "focus" && remainingTime < FOCUS_DURATION && remainingTime > 0) {
        resumeFocus();
      } else {
        startFocus();
      }
    }
  };

  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - ((initialTime - remainingTime) / initialTime) * circumference;

  return (
    <div className="relative">
      <Card className="mb-8 border-none shadow-2xl bg-card/60 backdrop-blur-xl overflow-hidden ring-1 ring-border/50">
        <CardContent className="p-8">
          <div className="flex flex-col items-center">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase tracking-widest mb-3">
                {sessionType === "focus" ? (
                  <>
                    <Zap className="w-3 h-3 fill-current" />
                    Focus Session
                  </>
                ) : (
                  <>
                    <Coffee className="w-3 h-3" />
                    Rest & Recharge
                  </>
                )}
              </div>
              <h2 className="text-3xl font-black text-foreground tracking-tight">
                {sessionType === "focus" ? "Deep Work" : "Break Time"}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {sessionType === "focus" ? "Stay focused, your AI coach is watching." : "Stretch, hydrate, and relax your mind."}
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full">
              <div className="relative w-72 h-72 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%" cy="50%" r={radius}
                    className="stroke-muted/30 fill-none"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50%" cy="50%" r={radius}
                    className={cn(
                      "fill-none transition-all duration-1000 ease-linear opacity-20 blur-[4px]",
                      sessionType === "focus" ? "stroke-indigo-500" : "stroke-emerald-500"
                    )}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="50%" cy="50%" r={radius}
                    className={cn(
                      "fill-none transition-all duration-1000 ease-linear",
                      sessionType === "focus" ? "stroke-indigo-500" : "stroke-emerald-500"
                    )}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={cn(
                    "text-7xl font-bold font-mono tracking-tighter tabular-nums transition-colors duration-500",
                    isRunning ? "text-foreground" : "text-muted-foreground/60"
                  )}>
                    {formatTime(remainingTime)}
                  </div>
                  <div className="flex gap-1.5 mt-4">
                    {[1, 2, 3, 4].map((s) => (
                      <div 
                        key={s} 
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all duration-300",
                          sessionsCompleted >= s ? "bg-indigo-500 scale-125" : "bg-muted"
                        )} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full md:w-64">
                <Button
                  onClick={handleToggle}
                  size="lg"
                  className={cn(
                    "h-16 text-lg font-bold rounded-2xl transition-all duration-300 shadow-xl",
                    isRunning 
                      ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20" 
                      : sessionType === "focus"
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                  )}
                >
                  {isRunning ? (
                    <><Pause className="mr-2 h-6 w-6" /> PAUSE</>
                  ) : (
                    <><Play className="mr-2 h-6 w-6" /> START {sessionType === "focus" ? "FOCUS" : "BREAK"}</>
                  )}
                </Button>

                <div className="flex gap-3">
                  <Button
                    onClick={stopFocusMode}
                    variant="outline"
                    className="flex-1 h-14 rounded-2xl border-border/50 hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive group"
                    title="Stop Focus Mode"
                  >
                    <Square className="h-5 w-5 text-muted-foreground group-hover:text-destructive transition-colors" />
                  </Button>
                  
                  {sessionType === "focus" && (
                    <Button
                      onClick={startBreak}
                      variant="secondary"
                      className="flex-1 h-14 rounded-2xl bg-muted/50 hover:bg-muted"
                      title="Take a Break"
                    >
                      <Coffee className="h-5 w-5 text-indigo-500" />
                    </Button>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs font-medium text-muted-foreground px-1">
                    <span>DAILY TARGET</span>
                    <span>{sessionsCompleted}/4 SESSIONS</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-1000" 
                      style={{ width: `${Math.min((sessionsCompleted / 4) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-24 h-24 text-indigo-500" />
        </div>
      </Card>
    </div>
  );
};

export default StudyTimer;
