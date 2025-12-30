"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function ResourceCard({ title, description, icon: Icon, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col p-6 bg-background border rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      
      <div className="absolute inset-0 border-2 border-primary/0 rounded-2xl group-hover:border-primary/5 transition-all duration-300" />
    </a>
  );
}
