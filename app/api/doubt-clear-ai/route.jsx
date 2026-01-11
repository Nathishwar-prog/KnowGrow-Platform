import { NextResponse } from "next/server";
// The proprietary 'ai' import is removed as we are now using standard fetch
// import { ai } from "../../../@/lib/ai"; 

const DOUBT_CLEAR_PROMPT = `You are an expert educational AI tutor specializing in explaining complex concepts in simple, clear terms. Your goal is to help students understand any topic they're struggling with.

When a student asks about a concept they don't understand:

1. **Break down the concept** into fundamental parts
2. **Use analogies and real-world examples** to make it relatable
3. **Provide step-by-step explanations** with clear reasoning
4. **Include relevant code examples** when applicable (with syntax highlighting)
5. **Create visual flowcharts** using Mermaid syntax when helpful
6. **Ask clarifying questions** to ensure understanding
7. **Provide practice examples** to reinforce learning
8. **Adapt your explanation** based on the student's level and feedback

Response Format:
- Use clear headings and bullet points
- Include code blocks with proper syntax highlighting
- Use Mermaid diagrams for visual explanations
- End with a summary and next steps
- Ask if the student needs clarification on any part

Remember: Be patient, encouraging, and adjust your explanation based on the student's responses.`;

export async function POST(req) {
try {
const { message, conversationHistory = [] } = await req.json();
    
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "<OPENROUTER_API_KEY>"; 
    // Replace with your actual site details or environment variables
    const YOUR_SITE_URL = process.env.YOUR_SITE_URL; 
    const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME;
    const model = "qwen/qwen3-vl-8b-instruct"; 

    // 1. Set the system instruction/persona first
    const messages = [
      { role: "system", content: DOUBT_CLEAR_PROMPT }
    ];

    // 2. Add conversation history
    // Note: OpenRouter (using OpenAI format) uses 'assistant' for the model's role.
    conversationHistory.forEach(msg => {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content // Assuming msg.content is already a string
      });
    });

    // 3. Add the student's current question
    messages.push({
      role: "user",
      // We send the current message as pure text content, which is appropriate 
      // for a text-based tutor, even if the model is multimodal.
      content: message 
    });


    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": YOUR_SITE_URL, 
        "X-Title": YOUR_SITE_NAME, 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": model,
        "messages": messages,
        // Optional parameters for generation (e.g., temperature) can be added here
      })
    });

    const result = await response.json();

    if (!response.ok) {
      // Handle API errors (e.g., 401 Unauthorized, 429 Rate Limit)
      throw new Error(`OpenRouter API Error: ${result.error?.message || 'Unknown error'}`);
    }

    // Extract the response content from the OpenRouter/OpenAI format
    const aiResponse = result?.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Doubt Clear AI Error:", error);
    return NextResponse.json(
      {
         success: false,
        error: "Failed to process your question.",
        details: error.message
      },
      { status: 500 }
    );
  }
}
