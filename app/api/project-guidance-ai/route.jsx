import { NextResponse } from "next/server";

const PROJECT_GUIDANCE_PROMPT = `You are an expert project mentor and technical advisor. Your goal is to provide comprehensive, structured project guidance.

CRITICAL: You MUST respond with a valid JSON object following this EXACT structure. Do not include any text before or after the JSON.

{
  "projectTitle": "Clear, descriptive project title",
  "overview": "2-3 sentence summary of the project and its goals",
  "techStack": ["Technology 1", "Technology 2", "Technology 3"],
  "architecture": {
    "frontend": ["Component/feature 1", "Component/feature 2"],
    "backend": ["API/service 1", "API/service 2"],
    "database": ["Table/model 1", "Table/model 2"]
  },
  "stepByStepPlan": [
    {
      "step": 1,
      "title": "Phase title",
      "description": "Detailed description of what to do in this phase",
      "deliverables": ["Deliverable 1", "Deliverable 2"],
      "estimatedTime": "1-2 days",
      "codeSnippet": "Optional: key code example for this step"
    }
  ],
  "milestones": [
    {
      "name": "Milestone name",
      "description": "What should be completed",
      "checkpoints": ["Checkpoint 1", "Checkpoint 2"]
    }
  ],
  "commonMistakes": [
    {
      "mistake": "What developers often do wrong",
      "solution": "How to avoid or fix it"
    }
  ],
  "bestPractices": [
    {
      "practice": "Best practice title",
      "description": "Why it matters and how to implement"
    }
  ],
  "nextImprovements": [
    {
      "improvement": "Future enhancement",
      "difficulty": "easy|medium|hard",
      "description": "Brief explanation"
    }
  ],
  "resources": [
    {
      "title": "Resource name",
      "type": "documentation|tutorial|tool",
      "url": "Optional URL"
    }
  ]
}

Guidelines:
- Provide 5-8 step-by-step phases
- Include 3-5 milestones
- List 3-5 common mistakes
- Suggest 4-6 best practices
- Recommend 3-5 future improvements
- Include 3-5 helpful resources
- Adapt complexity based on skill level
- Include practical code snippets where helpful
- Be specific and actionable

IMPORTANT: Return ONLY the JSON object, no markdown formatting, no code blocks, just pure JSON.`;

export async function POST(req) {
  try {
    const {
      projectDescription,
      skillLevel = "intermediate",
      technologies = [],
      timeline = "flexible",
      conversationHistory = [],
    } = await req.json();

    // --- 🔐 Use your OpenRouter API Key (set this in your .env file) ---
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "<OPENROUTER_API_KEY>";
    const YOUR_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "<YOUR_SITE_URL>";
    const YOUR_SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "<YOUR_SITE_NAME>";

    // --- 🧠 Choose your OpenRouter model ---
    // You can change this to any available model, e.g. "gpt-4o-mini", "qwen/qwen3-vl-8b-instruct", etc.
    const model = "gpt-4o-mini";

    // --- 🗣️ Build messages for OpenRouter ---
    const messages = [
      { role: "system", content: PROJECT_GUIDANCE_PROMPT },
      ...conversationHistory.map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      {
        role: "user",
        content: `
Project Description: ${projectDescription}
Skill Level: ${skillLevel}
Preferred Technologies: ${technologies.join(", ") || "Not specified"}
Timeline: ${timeline}

Please provide comprehensive project guidance following the format above.`,
      },
    ];

    // --- 🌐 Call OpenRouter API ---
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": YOUR_SITE_URL,
        "X-Title": YOUR_SITE_NAME,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`OpenRouter API Error: ${result.error?.message || "Unknown error"}`);
    }

    const rawContent = result?.choices?.[0]?.message?.content || "";
    
    let structuredGuidance;
    try {
      let jsonString = rawContent.trim();
      if (jsonString.startsWith("```json")) {
        jsonString = jsonString.slice(7);
      }
      if (jsonString.startsWith("```")) {
        jsonString = jsonString.slice(3);
      }
      if (jsonString.endsWith("```")) {
        jsonString = jsonString.slice(0, -3);
      }
      jsonString = jsonString.trim();
      
      structuredGuidance = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      structuredGuidance = {
        projectTitle: projectDescription?.slice(0, 50) || "Your Project",
        overview: rawContent.slice(0, 300),
        techStack: technologies.length > 0 ? technologies : ["To be determined"],
        architecture: { frontend: [], backend: [], database: [] },
        stepByStepPlan: [{ step: 1, title: "Planning", description: rawContent, deliverables: [] }],
        milestones: [],
        commonMistakes: [],
        bestPractices: [],
        nextImprovements: [],
        resources: [],
        _rawFallback: true
      };
    }

    return NextResponse.json({
      success: true,
      response: structuredGuidance,
      isStructured: !structuredGuidance._rawFallback,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Project Guidance AI Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate project guidance.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
