"use client";

import React from "react";
import ResourcePageLayout from "../_components/ResourcePageLayout";
import ResourceCard from "../_components/ResourceCard";
import { BookOpen, FileText, Sparkles, Zap } from "lucide-react";

const docsData = [
  {
    title: "Getting Started with KnowGrow",
    description: "Overview of platform features and workflow. Learn how to navigate your dashboard and manage your learning journey.",
    icon: Sparkles,
    href: "#",
  },
  {
    title: "AI Course Creation Guide",
    description: "How to generate, edit, and manage AI courses. Unlock the power of AI to build personalized curriculum in seconds.",
    icon: Zap,
    href: "#",
  },
  {
    title: "Mastering AI Quizzes",
    description: "Detailed guide on using the AI Quiz tool to test your knowledge and track your performance effectively.",
    icon: FileText,
    href: "#",
  },
  {
    title: "Collaboration Tools",
    description: "Learn how to share your progress and collaborate with other learners on the KnowGrow platform.",
    icon: BookOpen,
    href: "#",
  },
];

export default function DocsPage() {
  return (
    <ResourcePageLayout
      title="Documentation"
      description="Everything you need to know about using the KnowGrow platform effectively. From initial setup to advanced AI features."
    >
      {docsData.map((doc, index) => (
        <ResourceCard key={index} {...doc} />
      ))}
    </ResourcePageLayout>
  );
}
