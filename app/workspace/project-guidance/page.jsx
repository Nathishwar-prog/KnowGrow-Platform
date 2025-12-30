"use client";
import React from "react";
import ProjectGuidanceAI from "../_components/ProjectGuidanceAI";
import { useRouter } from "next/navigation";

export default function ProjectGuidancePage() {
  const router = useRouter();
  
  return (
    <div className="flex-1 h-full">
      <ProjectGuidanceAI 
        isOpen={true} 
        onClose={() => router.push("/workspace")} 
      />
    </div>
  );
}
