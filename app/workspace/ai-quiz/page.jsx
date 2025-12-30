"use client";
import React from "react";
import QuizGenerateAI from "../_components/QuizGenerateAI";
import { useRouter } from "next/navigation";

export default function AIQuizPage() {
  const router = useRouter();
  
  return (
    <div className="flex-1 h-full">
      <QuizGenerateAI 
        isOpen={true} 
        onClose={() => router.push("/workspace")} 
      />
    </div>
  );
}
