"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { setDashboardInvalidator } from "../@/lib/dashboardEvents";

const DashboardContext = createContext(null);

const CACHE_DURATION_MS = 30000;

export function DashboardProvider({ children }) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(0);
  
  const abortControllerRef = useRef(null);
  const fetchInProgressRef = useRef(false);
  const mountedRef = useRef(true);

  const fetchDashboard = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setLoading(false);
      return;
    }

    const now = Date.now();
    if (!forceRefresh && data && (now - lastFetch) < CACHE_DURATION_MS) {
      return;
    }

    if (fetchInProgressRef.current) {
      return;
    }

    fetchInProgressRef.current = true;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/dashboard", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
        cache: "no-store"
      });

      if (!mountedRef.current) return;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      if (!mountedRef.current) return;

      if (result.success && result.data) {
        setData(result.data);
        setLastFetch(Date.now());
        setError(null);
      } else {
        throw new Error(result.error || "Invalid response");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }
      if (mountedRef.current) {
        setError(err.message || "Failed to load dashboard");
        console.error("[Dashboard] Fetch error:", err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      fetchInProgressRef.current = false;
    }
  }, [user, data, lastFetch]);

  const invalidate = useCallback(() => {
    setLastFetch(0);
    fetchDashboard(true);
  }, [fetchDashboard]);

  const refresh = useCallback(() => {
    fetchDashboard(true);
  }, [fetchDashboard]);

  useEffect(() => {
    mountedRef.current = true;

    if (isUserLoaded && user) {
      fetchDashboard();
    } else if (isUserLoaded && !user) {
      setLoading(false);
      setData(null);
    }

    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isUserLoaded, user, fetchDashboard]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && user) {
        const now = Date.now();
        if ((now - lastFetch) > CACHE_DURATION_MS) {
          fetchDashboard(true);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [user, lastFetch, fetchDashboard]);

  useEffect(() => {
    setDashboardInvalidator(invalidate);
    return () => setDashboardInvalidator(null);
  }, [invalidate]);

  const value = {
    data,
    loading,
    error,
    refresh,
    invalidate,
    isReady: !loading && !error && data !== null
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}

export function useDashboardProgress() {
  const { data, loading, error } = useDashboard();
  return {
    progress: data?.progress || null,
    loading,
    error
  };
}

export function useDashboardCourses() {
  const { data, loading, error } = useDashboard();
  return {
    enrolled: data?.courses?.enrolled || [],
    created: data?.courses?.created || [],
    totalEnrolled: data?.courses?.totalEnrolled || 0,
    totalCreated: data?.courses?.totalCreated || 0,
    loading,
    error
  };
}

export function useDashboardActivity() {
  const { data, loading, error } = useDashboard();
  return {
    activities: data?.recentActivity || [],
    loading,
    error
  };
}

export function useDashboardAchievements() {
  const { data, loading, error } = useDashboard();
  return {
    achievements: data?.achievements || [],
    loading,
    error
  };
}
