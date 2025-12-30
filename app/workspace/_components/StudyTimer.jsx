"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Coffee, Zap, Timer, Clock, Brain, Sparkles, AlertCircle } from "lucide-react";
import { Card, CardContent } from "../../../@/components/ui/card";
import { Button } from "../../../@/components/ui/button";
import { cn } from "../../../@/lib/utils";
import { FocusBadge } from "./FocusBadge";
import { FocusAlert } from "./FocusAlert";

const StudyTimer = () => {
  // AI Focus States
  const [isActive, setIsActive] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [mode, setMode] = useState("focus"); // focus, break
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [initialTime, setInitialTime] = useState(25 * 60);
  
  // Algorithm tracking
  const [continuousStudyTime, setContinuousStudyTime] = useState(0); // in seconds
  const [showBreakAlert, setShowBreakAlert] = useState(false);
  const [alertType, setAlertType] = useState("suggestion"); // suggestion or warning
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const intervalRef = useRef(null);

  // Load persistence
  useEffect(() => {
    const saved = localStorage.getItem("study_session_summary");
    if (saved) {
      const { sessions } = JSON.parse(saved);
      setSessionsCompleted(sessions || 0);
    }
  }, []);

  // Save persistence
  useEffect(() => {
    localStorage.setItem("study_session_summary", JSON.stringify({
      sessions: sessionsCompleted,
      lastUpdated: new Date().toISOString()
    }));
  }, [sessionsCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    if (!isActive) {
      // Starting
      if (mode === "focus") {
        setFocusModeActive(true);
      }
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setFocusModeActive(false);
    const duration = mode === "focus" ? 25 * 60 : 5 * 60;
    setTimeLeft(duration);
    setInitialTime(duration);
    setContinuousStudyTime(0);
  };

  const startBreak = () => {
    setShowBreakAlert(false);
    setIsActive(true);
    setIsOnBreak(true);
    setFocusModeActive(false);
    setMode("break");
    const breakDuration = 5 * 60;
    setTimeLeft(breakDuration);
    setInitialTime(breakDuration);
    setContinuousStudyTime(0);
  };

  const endBreak = () => {
    setIsOnBreak(false);
    setMode("focus");
    const focusDuration = 25 * 60;
    setTimeLeft(focusDuration);
    setInitialTime(focusDuration);
    setIsActive(false);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        
        // Track continuous study time for the AI algorithm
        if (mode === "focus") {
          setContinuousStudyTime(prev => prev + 1);
        }
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      if (mode === "focus") {
        setSessionsCompleted(s => s + 1);
        startBreak();
      } else {
        endBreak();
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, mode]);

  // AI Focus Algorithm Logic
  useEffect(() => {
    if (mode === "focus" && isActive) {
      const minutesStudied = continuousStudyTime / 60;
      
      // 25 minutes suggestion
      if (minutesStudied >= 25 && minutesStudied < 25.1) {
        setAlertType("suggestion");
        setShowBreakAlert(true);
      }
      
      // 50 minutes warning
      if (minutesStudied >= 50 && minutesStudied < 50.1) {
        setAlertType("warning");
        setShowBreakAlert(true);
      }
    }
  }, [continuousStudyTime, mode, isActive]);

  // SVG parameters for progress ring
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - ((initialTime - timeLeft) / initialTime) * circumference;

  return (
    <div className="relative">
      <Card className="mb-8 border-none shadow-2xl bg-card/60 backdrop-blur-xl overflow-hidden ring-1 ring-border/50">
        <CardContent className="p-8">
          <div className="flex flex-col items-center">
            {/* Header Area */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase tracking-widest mb-3">
                {mode === "focus" ? (
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
                {mode === "focus" ? "Deep Work" : "Break Time"}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {mode === "focus" ? "Stay focused, your AI coach is watching." : "Stretch, hydrate, and relax your mind."}
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full">
              {/* Minimal Circular Timer */}
              <div className="relative w-72 h-72 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="50%" cy="50%" r={radius}
                    className="stroke-muted/30 fill-none"
                    strokeWidth="8"
                  />
                  {/* Progress Glow */}
                  <circle
                    cx="50%" cy="50%" r={radius}
                    className={cn(
                      "fill-none transition-all duration-1000 ease-linear opacity-20 blur-[4px]",
                      mode === "focus" ? "stroke-indigo-500" : "stroke-emerald-500"
                    )}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    strokeLinecap="round"
                  />
                  {/* Main Progress Ring */}
                  <circle
                    cx="50%" cy="50%" r={radius}
                    className={cn(
                      "fill-none transition-all duration-1000 ease-linear",
                      mode === "focus" ? "stroke-indigo-500" : "stroke-emerald-500"
                    )}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    strokeLinecap="round"
                  />
                </svg>

                {/* Center Time Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={cn(
                    "text-7xl font-bold font-mono tracking-tighter tabular-nums transition-colors duration-500",
                    isActive ? "text-foreground" : "text-muted-foreground/60"
                  )}>
                    {formatTime(timeLeft)}
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

              {/* Enhanced Controls */}
              <div className="flex flex-col gap-4 w-full md:w-64">
                <Button
                  onClick={toggleTimer}
                  size="lg"
                  className={cn(
                    "h-16 text-lg font-bold rounded-2xl transition-all duration-300 shadow-xl",
                    isActive 
                      ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20" 
                      : mode === "focus"
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                  )}
                >
                  {isActive ? (
                    <><Pause className="mr-2 h-6 w-6" /> PAUSE</>
                  ) : (
                    <><Play className="mr-2 h-6 w-6" /> START {mode === "focus" ? "FOCUS" : "BREAK"}</>
                  )}
                </Button>

                <div className="flex gap-3">
                  <Button
                    onClick={resetTimer}
                    variant="outline"
                    className="flex-1 h-14 rounded-2xl border-border/50 hover:bg-accent group"
                  >
                    <RotateCcw className="h-5 w-5 text-muted-foreground group-hover:rotate-[-45deg] transition-transform" />
                  </Button>
                  
                  {mode === "focus" && (
                    <Button
                      onClick={startBreak}
                      variant="secondary"
                      className="flex-1 h-14 rounded-2xl bg-muted/50 hover:bg-muted"
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

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-24 h-24 text-indigo-500" />
        </div>
      </Card>

      {/* AI Focus Components */}
      <FocusBadge active={focusModeActive && mode === "focus"} />
      {isOnBreak && (
        <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-600/90 dark:bg-emerald-500/90 backdrop-blur-sm text-white rounded-full shadow-lg border border-emerald-400/30">
            <Coffee className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium tracking-wide">Break Mode Active</span>
          </div>
        </div>
      )}

      <FocusAlert 
        isOpen={showBreakAlert}
        onClose={() => setShowBreakAlert(false)}
        onTakeBreak={startBreak}
        type={alertType}
      />
    </div>
  );
};

export default StudyTimer;
