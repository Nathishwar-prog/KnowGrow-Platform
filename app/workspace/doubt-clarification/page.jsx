"use client";
import React from "react";
import DoubtClearAI from "../_components/DoubtClearAI";
import { useRouter } from "next/navigation";

export default function DoubtClarificationPage() {
  const router = useRouter();
  
  return (
    <div className="flex-1 h-full">
      <DoubtClearAI 
        isOpen={true} 
        onClose={() => router.push("/workspace")} 
      />
    </div>
  );
}
