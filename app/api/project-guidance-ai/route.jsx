import { NextResponse } from "next/server";
import { ai } from "../../../@/lib/ai";

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
    const { projectDescription, skillLevel = "intermediate", technologies = [], timeline = "flexible", conversationHistory = [] } = await req.json();

    const config = {
      responseMimeType: 'text/plain',
    };
    const model = "gemini-2.5-flash";
    
    // Build conversation context
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `${PROJECT_GUIDANCE_PROMPT}

Project Description: ${projectDescription}
Skill Level: ${skillLevel}
Preferred Technologies: ${technologies.join(", ") || "Not specified"}
Timeline: ${timeline}

Please provide comprehensive project guidance following the format above.`,
          },
        ],
      },
    ];

    // Add conversation history for context
    if (conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });
    }

    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    const aiResponse = response?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate project guidance. Please try again.";

    return NextResponse.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Project Guidance AI Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate project guidance. Please try again.",
        details: error.message
      },
      { status: 500 }
    );
  }
}
