"use client";

import React from "react";
import ResourcePageLayout from "../_components/ResourcePageLayout";
import ResourceCard from "../_components/ResourceCard";
import { Code, ExternalLink, Globe, Layout, Library, Terminal } from "lucide-react";

const referencesData = [
  {
    title: "JavaScript Official Documentation",
    description: "MDN Web Docs for JavaScript. The definitive source for learning JavaScript and stay up-to-date with latest specifications.",
    icon: Code,
    href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  {
    title: "Next.js App Router Documentation",
    description: "Official Next.js documentation for building applications using the App Router, Server Components, and more.",
    icon: Layout,
    href: "https://nextjs.org/docs",
  },
  {
    title: "React Official Docs",
    description: "Learn how to build user interfaces with React, including hooks, components, and best practices.",
    icon: Globe,
    href: "https://react.dev",
  },
  {
    title: "Tailwind CSS Documentation",
    description: "Rapidly build modern websites without ever leaving your HTML with utility-first CSS framework.",
    icon: Terminal,
    href: "https://tailwindcss.com/docs",
  },
  {
    title: "Shadcn/UI Library",
    description: "Beautifully designed components that you can copy and paste into your apps. Accessible, customizable, and open source.",
    icon: Library,
    href: "https://ui.shadcn.com",
  },
  {
    title: "Clerk Authentication",
    description: "The complete suite of embeddable UIs, flexible APIs, and admin dashboards to authenticate and manage your users.",
    icon: ExternalLink,
    href: "https://clerk.com/docs",
  },
];

export default function ReferencesPage() {
  return (
    <ResourcePageLayout
      title="References"
      description="Quick access to official documentation, libraries, and tools that we use and recommend for your learning journey."
    >
      {referencesData.map((ref, index) => (
        <ResourceCard key={index} {...ref} />
      ))}
    </ResourcePageLayout>
  );
}
