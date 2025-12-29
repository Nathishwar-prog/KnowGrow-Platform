import { NextResponse } from "next/server";
import { generateContent, parseJsonResponse } from "../../../@/lib/generateContent";
import { currentUser } from "@clerk/nextjs/server";

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 30000;
const MAX_REQUESTS_PER_WINDOW = 2;

function checkRateLimit(userId) {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  
  if (!userLimit) {
    rateLimitMap.set(userId, { count: 1, windowStart: now });
    return { allowed: true };
  }
  
  if (now - userLimit.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(userId, { count: 1, windowStart: now });
    return { allowed: true };
  }
  
  if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
    const waitTime = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - userLimit.windowStart)) / 1000);
    return { allowed: false, waitTime };
  }
  
  userLimit.count++;
  return { allowed: true };
}

const QUIZ_GENERATE_PROMPT = `You are an expert educational AI that creates comprehensive quizzes and assessments. Your goal is to generate high-quality, educational quizzes that test understanding and reinforce learning.

When creating quizzes:

1. **Assess the topic** and create questions at appropriate difficulty levels
2. **Include multiple question types**: multiple choice, true/false, fill-in-the-blank, short answer
3. **Provide detailed explanations** for each answer
4. **Include code-based questions** when relevant (with syntax highlighting)
5. **For ANY question about code output, behavior, or analysis, ALWAYS include the codeExample field** with the actual code snippet
6. **Create visual diagrams** using Mermaid syntax for complex concepts
7. **Ensure questions are clear and unambiguous**
8. **Provide hints** for difficult questions
9. **Include learning objectives** for each question

Response Format (JSON):
{
  "title": "Quiz Title",
  "description": "Brief description of what this quiz covers",
  "learningObjectives": ["objective1", "objective2"],
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice|true_false|fill_blank|short_answer|code",
      "question": "Question text",
      "options": ["option1", "option2", "option3", "option4"], // for multiple choice
      "correctAnswer": "correct answer",
      "explanation": "Detailed explanation of why this is correct",
      "hint": "Optional hint for the student",
      "codeExample": "Code example if applicable",
      "difficulty": "easy|medium|hard"
    }
  ],
  "totalQuestions": 5,
  "estimatedTime": "10-15 minutes"
}

Remember: Create questions that promote deep understanding, not just memorization.`;

export async function POST(req) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const userId = user.id;
    const rateCheck = checkRateLimit(userId);
    
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Please wait ${rateCheck.waitTime} seconds before generating another quiz.` 
        },
        { status: 429 }
      );
    }

    const { topic, difficulty = "medium", questionCount = 5, questionTypes = ["multiple_choice", "short_answer"] } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { success: false, error: "Topic is required" },
        { status: 400 }
      );
    }
    
    const prompt = `${QUIZ_GENERATE_PROMPT}

Topic: ${topic}
Difficulty Level: ${difficulty}
Number of Questions: ${questionCount}
Question Types: ${questionTypes.join(", ")}

IMPORTANT: For programming topics, include code examples in questions about:
- Code output prediction
- Code behavior analysis  
- Debugging scenarios
- Algorithm understanding
- Syntax questions

Generate a comprehensive quiz following the JSON format above.`;

    const aiResult = await generateContent(prompt, {
      geminiModel: 'gemini-2.5-flash',
      maxGeminiRetries: 1,
      geminiBackoffMs: 2000,
    });

    if (!aiResult.success) {
      return NextResponse.json(
        { success: false, error: "AI service temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }

    console.log(`[Quiz Generate] Generated via ${aiResult.provider}`);

    const parsed = parseJsonResponse(aiResult.content);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Failed to generate quiz format. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      quiz: parsed.data,
      provider: aiResult.provider,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Quiz Generate AI Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate quiz. Please try again." },
      { status: 500 }
    );
  }
}
