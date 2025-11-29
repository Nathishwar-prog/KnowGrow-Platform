"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Coffee, Zap } from "lucide-react";
import { Card, CardContent } from "../../../@/components/ui/card";
import { Button } from "../../../@/components/ui/button";

const StudyTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("focus"); // focus, shortBreak, longBreak
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  // Timer modes
  const modes = {
    focus: { duration: 25 * 60, label: "Focus Time", color: "from-red-500 to-orange-500" },
    shortBreak: { duration: 5 * 60, label: "Short Break", color: "from-green-500 to-emerald-500" },
    longBreak: { duration: 15 * 60, label: "Long Break", color: "from-blue-500 to-indigo-500" }
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Start/pause timer
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].duration);
  };

  // Switch mode
  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
  };

  // Complete session
  const completeSession = () => {
    if (mode === "focus") {
      setSessions(sessions + 1);
      
      // After 4 focus sessions, take a long break
      if ((sessions + 1) % 4 === 0) {
        switchMode("longBreak");
      } else {
        switchMode("shortBreak");
      }
    } else {
      switchMode("focus");
    }
  };

  // Timer effect
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      // Timer completed
      completeSession();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  // Reset timer when mode changes
  useEffect(() => {
    setTimeLeft(modes[mode].duration);
  }, [mode]);

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Study Timer</h2>
          <p className="text-gray-600 mb-6">Stay focused with the Pomodoro Technique</p>
          
          <div className={`relative inline-flex items-center justify-center w-64 h-64 rounded-full bg-gradient-to-br ${modes[mode].color} mb-6`}>
            <div className="absolute inset-4 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {modes[mode].label}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Sessions: {sessions}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              onClick={toggleTimer}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isActive ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start
                </>
              )}
            </Button>
            
            <Button
              onClick={resetTimer}
              variant="outline"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
          
          <div className="flex justify-center space-x-2">
            <Button
              variant={mode === "focus" ? "default" : "outline"}
              size="sm"
              onClick={() => switchMode("focus")}
              className={mode === "focus" ? "bg-red-500 hover:bg-red-600" : ""}
            >
              <Zap className="mr-1 h-3 w-3" />
              Focus
            </Button>
            
            <Button
              variant={mode === "shortBreak" ? "default" : "outline"}
              size="sm"
              onClick={() => switchMode("shortBreak")}
              className={mode === "shortBreak" ? "bg-green-500 hover:bg-green-600" : ""}
            >
              <Coffee className="mr-1 h-3 w-3" />
              Short
            </Button>
            
            <Button
              variant={mode === "longBreak" ? "default" : "outline"}
              size="sm"
              onClick={() => switchMode("longBreak")}
              className={mode === "longBreak" ? "bg-blue-500 hover:bg-blue-600" : ""}
            >
              <Coffee className="mr-1 h-3 w-3" />
              Long
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyTimer;