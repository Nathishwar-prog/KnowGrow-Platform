import { NextResponse } from "next/server";
import { ai } from "../../../@/lib/ai";

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
    const { topic, difficulty = "medium", questionCount = 5, questionTypes = ["multiple_choice", "short_answer"] } = await req.json();

    const config = {
      responseMimeType: 'text/plain',
    };
    const model = "gemini-2.5-flash";
    
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

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    const rawResponse = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Clean and parse JSON response
    let quizData = null;
    try {
      const cleanJson = rawResponse.replace(/```json|```/g, "").trim();
      const safeJson = cleanJson
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]");
      
      quizData = JSON.parse(safeJson);
    } catch (err) {
      console.error("Quiz JSON parse error:", err.message);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate quiz format. Please try again.",
          raw: rawResponse,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      quiz: quizData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Quiz Generate AI Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate quiz. Please try again.",
        details: error.message
      },
      { status: 500 }
    );
  }
}
