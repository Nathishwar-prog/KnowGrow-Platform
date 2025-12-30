"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Coffee, Zap, Timer, Clock } from "lucide-react";
import { Card, CardContent } from "../../../@/components/ui/card";
import { Button } from "../../../@/components/ui/button";
import { cn } from "../../../@/lib/utils"; // Utils located in @/lib

const StudyTimer = () => {
  // Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("focus"); // focus, shortBreak, longBreak
  const [sessions, setSessions] = useState(0);

  // Real Clock State
  const [currentTime, setCurrentTime] = useState(new Date());

  const intervalRef = useRef(null);
  const clockIntervalRef = useRef(null);

  const modes = {
    focus: { duration: 25 * 60, label: "Focus", color: "text-rose-500", ringColor: "stroke-rose-500" },
    shortBreak: { duration: 5 * 60, label: "Short Break", color: "text-emerald-500", ringColor: "stroke-emerald-500" },
    longBreak: { duration: 15 * 60, label: "Long Break", color: "text-blue-500", ringColor: "stroke-blue-500" }
  };

  useEffect(() => {
    // Clock ticker
    clockIntervalRef.current = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockIntervalRef.current);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].duration);
    setInitialTime(modes[mode].duration);
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
    setInitialTime(modes[newMode].duration);
  };

  const completeSession = () => {
    if (mode === "focus") {
      setSessions(s => s + 1);
      const nextSession = (sessions + 1) % 4 === 0 ? "longBreak" : "shortBreak";
      switchMode(nextSession);
      // Play sound here if possible
    } else {
      switchMode("focus");
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      completeSession();
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft]);

  // SVG parameters for progress ring
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - ((initialTime - timeLeft) / initialTime) * circumference;

    return (
      <Card className="mb-8 border border-border/50 shadow-xl bg-card overflow-hidden relative">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Timer className="w-6 h-6 text-primary" /> Study Timer
              </h2>
              <p className="text-muted-foreground text-sm">Target: Focus & Consistency</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono font-bold text-foreground">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
  
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Circular Timer Display */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Background Ring */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%" cy="50%" r={radius}
                  className="stroke-muted fill-none"
                  strokeWidth="12"
                />
                {/* Progress Ring */}
                <circle
                  cx="50%" cy="50%" r={radius}
                  className={`fill-none transition-all duration-1000 ease-linear ${modes[mode].ringColor}`}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={progressOffset}
                  strokeLinecap="round"
                />
              </svg>
  
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-6xl font-bold font-mono tracking-tighter ${modes[mode].color} drop-shadow-sm`}>
                  {formatTime(timeLeft)}
                </span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-2 bg-muted px-3 py-1 rounded-full">
                  {modes[mode].label}
                </span>
              </div>
            </div>
  
            {/* Controls */}
            <div className="flex-1 w-full space-y-6">
              <div className="grid grid-cols-3 gap-3 bg-muted p-2 rounded-xl">
                <button
                  onClick={() => switchMode("focus")}
                  className={`flex flex-col items-center justify-center py-3 rounded-lg transition-all ${mode === 'focus' ? 'bg-background shadow-md text-rose-500' : 'text-muted-foreground hover:bg-background/50'}`}
                >
                  <Zap className="w-5 h-5 mb-1" />
                  <span className="text-xs font-semibold">Focus</span>
                </button>
                <button
                  onClick={() => switchMode("shortBreak")}
                  className={`flex flex-col items-center justify-center py-3 rounded-lg transition-all ${mode === 'shortBreak' ? 'bg-background shadow-md text-emerald-500' : 'text-muted-foreground hover:bg-background/50'}`}
                >
                  <Coffee className="w-5 h-5 mb-1" />
                  <span className="text-xs font-semibold">Short</span>
                </button>
                <button
                  onClick={() => switchMode("longBreak")}
                  className={`flex flex-col items-center justify-center py-3 rounded-lg transition-all ${mode === 'longBreak' ? 'bg-background shadow-md text-blue-500' : 'text-muted-foreground hover:bg-background/50'}`}
                >
                  <Clock className="w-5 h-5 mb-1" />
                  <span className="text-xs font-semibold">Long</span>
                </button>
              </div>
  
              <div className="flex items-center gap-4">
                <Button
                  onClick={toggleTimer}
                  className={`flex-1 h-14 text-lg font-bold shadow-lg transition-all hover:scale-105 active:scale-95 ${isActive
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                >
                  {isActive ? (
                    <> <Pause className="mr-2 h-6 w-6" /> PAUSE </>
                  ) : (
                    <> <Play className="mr-2 h-6 w-6" /> START </>
                  )}
                </Button>
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  className="h-14 w-14 rounded-xl border-2 hover:bg-accent"
                >
                  <RotateCcw className="h-6 w-6 text-muted-foreground" />
                </Button>
              </div>
  
              <div className="text-center text-sm text-muted-foreground">
                Sessions completed today: <span className="text-foreground font-bold ml-1">{sessions}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
};

export default StudyTimer;