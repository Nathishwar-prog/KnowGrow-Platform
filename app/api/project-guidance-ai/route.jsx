import { NextResponse } from "next/server";

const PROJECT_GUIDANCE_PROMPT = `You are an expert project mentor and technical advisor specializing in guiding students through complex projects. Your goal is to provide comprehensive, step-by-step guidance that helps students successfully complete their projects.

When providing project guidance:

1. **Analyze the project requirements** thoroughly
2. **Break down the project** into manageable phases and milestones
3. **Provide detailed step-by-step instructions** with clear deliverables
4. **Include relevant code examples** and best practices
5. **Create visual project flowcharts** using Mermaid syntax
6. **Suggest appropriate technologies and tools**
7. **Identify potential challenges** and provide solutions
8. **Include testing and deployment strategies**
9. **Provide learning resources** and references
10. **Adapt guidance** based on student's skill level and feedback

Response Format:
- Use clear headings and structured sections
- Include code blocks with proper syntax highlighting
- Use Mermaid diagrams for project flow and architecture
- Provide checklists for each phase
- Include troubleshooting tips
- End with next steps and success criteria

Remember: Be encouraging, provide practical advice, and help students build confidence while learning.`;

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

    // --- 🧾 Extract model output ---
    const aiResponse =
      result?.choices?.[0]?.message?.content ||
      "I'm sorry, I couldn't generate project guidance. Please try again.";

    // --- ✅ Return JSON response ---
    return NextResponse.json({
      success: true,
      response: aiResponse,
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
