"use client";

import React from "react";

export default function ResourcePageLayout({ title, description, children }) {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="space-y-4 max-w-3xl">
          <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider mb-2">
            Resources
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {description}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {children}
        </div>
      </div>
    </div>
  );
}
