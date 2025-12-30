"use client";
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

const FocusTimerContext = createContext();

const STORAGE_KEY = "focus_timer_state";
const FOCUS_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

export function FocusTimerProvider({ children }) {
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [remainingTime, setRemainingTime] = useState(FOCUS_DURATION);
  const [sessionType, setSessionType] = useState("focus");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("focus_complete");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [continuousStudyTime, setContinuousStudyTime] = useState(0);
  
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Load persisted state on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        const now = Date.now();
        
        if (state.isRunning && state.startTime) {
          const elapsed = Math.floor((now - state.startTime) / 1000);
          const newRemaining = Math.max(0, state.remainingTime - elapsed);
          
          if (newRemaining > 0) {
            setIsFocusActive(state.isFocusActive);
            setIsOnBreak(state.isOnBreak);
            setRemainingTime(newRemaining);
            setSessionType(state.sessionType);
            setSessionsCompleted(state.sessionsCompleted || 0);
            setContinuousStudyTime((state.continuousStudyTime || 0) + elapsed);
            startTimeRef.current = now;
          } else {
            // Timer completed while away
            if (state.sessionType === "focus") {
              setShowAlert(true);
              setAlertType("focus_complete");
              setIsFocusActive(true);
              setSessionType("focus");
              setRemainingTime(0);
            } else {
              setShowAlert(true);
              setAlertType("break_complete");
              setIsOnBreak(false);
              setSessionType("focus");
              setRemainingTime(FOCUS_DURATION);
            }
            setSessionsCompleted(state.sessionsCompleted || 0);
          }
        } else {
          setSessionsCompleted(state.sessionsCompleted || 0);
        }
      } catch (e) {
        console.error("Failed to restore timer state:", e);
      }
    }
  }, []);

  // Persist state changes
  const persistState = useCallback(() => {
    const state = {
      isFocusActive,
      isOnBreak,
      remainingTime,
      sessionType,
      sessionsCompleted,
      continuousStudyTime,
      isRunning: isFocusActive || isOnBreak,
      startTime: startTimeRef.current,
      savedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [isFocusActive, isOnBreak, remainingTime, sessionType, sessionsCompleted, continuousStudyTime]);

  useEffect(() => {
    persistState();
  }, [persistState]);

  // Timer interval
  useEffect(() => {
    if ((isFocusActive && sessionType === "focus") || (isOnBreak && sessionType === "break")) {
      startTimeRef.current = Date.now();
      
      intervalRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            
            if (sessionType === "focus") {
              setSessionsCompleted(s => s + 1);
              setShowAlert(true);
              setAlertType("focus_complete");
              setIsFocusActive(false);
            } else {
              setShowAlert(true);
              setAlertType("break_complete");
              setIsOnBreak(false);
            }
            return 0;
          }
          return prev - 1;
        });

        if (sessionType === "focus") {
          setContinuousStudyTime(prev => {
            const newTime = prev + 1;
            // 25 min suggestion
            if (newTime === 25 * 60) {
              setShowAlert(true);
              setAlertType("suggestion");
            }
            // 50 min warning
            if (newTime === 50 * 60) {
              setShowAlert(true);
              setAlertType("warning");
            }
            return newTime;
          });
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isFocusActive, isOnBreak, sessionType]);

  const startFocus = useCallback(() => {
    setIsFocusActive(true);
    setIsOnBreak(false);
    setSessionType("focus");
    setRemainingTime(FOCUS_DURATION);
    setContinuousStudyTime(0);
    startTimeRef.current = Date.now();
  }, []);

  const pauseFocus = useCallback(() => {
    setIsFocusActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const resumeFocus = useCallback(() => {
    setIsFocusActive(true);
    startTimeRef.current = Date.now();
  }, []);

  const startBreak = useCallback(() => {
    setIsFocusActive(false);
    setIsOnBreak(true);
    setSessionType("break");
    setRemainingTime(BREAK_DURATION);
    startTimeRef.current = Date.now();
  }, []);

  const endBreakAndContinue = useCallback(() => {
    setIsOnBreak(false);
    setIsFocusActive(true);
    setSessionType("focus");
    setRemainingTime(FOCUS_DURATION);
    setContinuousStudyTime(0);
    startTimeRef.current = Date.now();
    setShowAlert(false);
  }, []);

  const stopFocusMode = useCallback(() => {
    setIsFocusActive(false);
    setIsOnBreak(false);
    setSessionType("focus");
    setRemainingTime(FOCUS_DURATION);
    setContinuousStudyTime(0);
    startTimeRef.current = null;
    setShowAlert(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const dismissAlert = useCallback(() => {
    setShowAlert(false);
  }, []);

  const value = {
    isFocusActive,
    isOnBreak,
    remainingTime,
    sessionType,
    sessionsCompleted,
    continuousStudyTime,
    showAlert,
    alertType,
    startFocus,
    pauseFocus,
    resumeFocus,
    startBreak,
    endBreakAndContinue,
    stopFocusMode,
    dismissAlert,
    FOCUS_DURATION,
    BREAK_DURATION
  };

  return (
    <FocusTimerContext.Provider value={value}>
      {children}
    </FocusTimerContext.Provider>
  );
}

export function useFocusTimer() {
  const context = useContext(FocusTimerContext);
  if (!context) {
    throw new Error("useFocusTimer must be used within a FocusTimerProvider");
  }
  return context;
}
