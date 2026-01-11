"use client";

import React, { useEffect, useState } from "react";
import { cn } from "../../../@/lib/utils";

export function CircularProgress({
  value = 0,
  size = 120,
  strokeWidth = 10,
  className,
  showLabel = true,
  label = "Your Progress",
  gradientId = "progressGradient",
  animate = true,
}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedValue / 100) * circumference;
  
  useEffect(() => {
    if (!animate) {
      setAnimatedValue(value);
      return;
    }
    
    const duration = 1000;
    const startValue = animatedValue;
    const diff = value - startValue;
    const startTime = performance.now();
    
    const animateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + diff * easeOutQuart;
      
      setAnimatedValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animateProgress);
      }
    };
    
    requestAnimationFrame(animateProgress);
  }, [value, animate]);

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/20"
          />
          
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            filter="url(#glow)"
            className="transition-all duration-300"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold bg-gradient-to-br from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
            {Math.round(animatedValue)}%
          </span>
        </div>
      </div>
      
      {showLabel && (
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      )}
    </div>
  );
}

export function CircularProgressCard({
  value = 0,
  title = "Course Progress",
  subtitle,
  completedCount = 0,
  totalCount = 0,
  className,
}) {
  return (
    <div className={cn(
      "bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-6 shadow-lg",
      className
    )}>
      <div className="flex items-center gap-6">
        <CircularProgress 
          value={value} 
          size={100} 
          strokeWidth={8}
          showLabel={false}
        />
        
        <div className="flex-1">
          <h3 className="font-bold text-lg">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">
                {completedCount} of {totalCount} chapters
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
