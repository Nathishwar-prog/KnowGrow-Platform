import { coursesTable } from "../../../config/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ai } from "../../../@/lib/ai";
import { NextResponse } from "next/server";
import { db } from "../../../config/db";
import axios from "axios";
import { eq } from "drizzle-orm";

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 30000;
const MAX_REQUESTS_PER_WINDOW = 1;

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

const PROMPT = `You are an AI tutor designing an engaging technical course for a young audience (18-35). Generate a COMPLETE JSON-ONLY response for a personalized course based on the user's input.

STRICT RULES:
- Output MUST be valid JSON. Do not include markdown fences.
- Keep content concise and bite-sized.
- Include installation/setup/notes definitions for clarity.
- Topics MUST be specific technical concepts (e.g., "Variables & Data Types", "Async/Await", "Flexbox Layout"), NOT generic motivational titles like "Why learn this?".
- Include specific syntax examples or code concepts in the topics list where applicable.
- Include YouTube search keywords (not URLs) for 2–3 suggested videos per chapter if includeVideo=true.

JSON Schema:
{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string", // beginner | moderate | advanced
    "includeVideo": "boolean",
    "noOfChapters": "number",
    "bannerImagePrompt": "string", // a vivid but succinct prompt
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string", // e.g., "25 min"
        "installation": ["string"],
        "setup": ["string"],
        "notes": ["string"],
        "definitions": ["string"],
        "topics": ["string"]
      }
    ]
  }
}

Banner image prompt guidance:
- Create a modern, flat-style 2D illustration representing the user topic in an educational workspace.
- Include UI/UX elements: mock screens, icons, sticky notes, components.
- Use a vibrant palette and clean composition.
- Output a single short prompt string.

User Input:`;

async function callAIWithRetry(model, config, contents, maxRetries = 3) {
  let lastError = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({ model, config, contents });
      return response;
    } catch (err) {
      lastError = err;
      const status = err?.status || err?.response?.status;
      
      if (status === 429 || err?.message?.includes("429") || err?.message?.toLowerCase().includes("rate limit")) {
        const backoffMs = Math.min(2000 * Math.pow(2, attempt), 16000);
        console.log(`AI rate limit hit, retrying in ${backoffMs}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(res => setTimeout(res, backoffMs));
        continue;
      }
      
      throw err;
    }
  }
  
  throw lastError;
}

export async function POST(request) {
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
          error: `Please wait ${rateCheck.waitTime} seconds before generating another course.` 
        },
        { status: 429 }
      );
    }
    
    const { courseId, ...formData } = await request.json();
    
    if (!courseId || !formData.name) {
      return NextResponse.json(
        { success: false, error: "Course ID and name are required" },
        { status: 400 }
      );
    }
    
    const { has } = await auth();
    const hasPremiumAccess = has({ plan: 'starter' });

    if (!hasPremiumAccess) {
      const existingCourses = await db.select().from(coursesTable)
        .where(eq(coursesTable.userEmail, user?.primaryEmailAddress?.emailAddress));
      
      if (existingCourses.length >= 3) {
        return NextResponse.json(
          { success: false, error: "Free tier limit reached. Upgrade to create more courses." },
          { status: 403 }
        );
      }
    }

    const tools = [{ googleSearch: {} }];
    const config = {
      responseMimeType: "text/plain",
      tools,
    };
    const model = "gemini-2.0-flash";
    const contents = [
      {
        role: "user",
        parts: [{ text: PROMPT + JSON.stringify(formData) }],
      },
    ];

    let response;
    try {
      response = await callAIWithRetry(model, config, contents, 3);
    } catch (aiError) {
      console.error("AI API Error after retries:", aiError);
      const isRateLimit = aiError?.status === 429 || 
                          aiError?.message?.includes("429") || 
                          aiError?.message?.toLowerCase().includes("rate limit");
      
      if (isRateLimit) {
        return NextResponse.json(
          { success: false, error: "AI service is busy. Please try again in a minute." },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: "Failed to generate course content. Please try again." },
        { status: 500 }
      );
    }
    
    const RawResp = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    if (!RawResp) {
      return NextResponse.json(
        { success: false, error: "AI returned empty response. Please try again." },
        { status: 500 }
      );
    }
    
    let JSONResponse;
    try {
      const RawJson = RawResp.replace(/```json|```/g, "").trim();
      JSONResponse = JSON.parse(RawJson);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { success: false, error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    const ImagePrompt = JSONResponse?.course?.bannerImagePrompt || "";
    const bannerImageUrl = await GenerateImage(ImagePrompt);

    await db.insert(coursesTable).values({
      ...formData,
      courseJson: JSONResponse,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      cid: courseId,
      bannerImageUrl: bannerImageUrl
    });

    return NextResponse.json({ success: true, courseId: courseId });
  } catch (error) {
    console.error("Route Error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

const GenerateImage = async (ImagePrompt) => {
  try {
    if (!process?.env?.AI_GURU_LAB_API_KEY) {
      console.warn("Missing AI_GURU_LAB_API_KEY, using placeholder image.");
      return `https://placehold.co/1024x576/png?text=${encodeURIComponent("Course Banner")}`;
    }

    const BASE_URL = 'https://aigurulab.tech';
    const result = await axios.post(
      BASE_URL + '/api/generate-image',
      {
        width: 1024,
        height: 1024,
        input: ImagePrompt,
        model: 'flux',
        aspectRatio: '16:9'
      },
      {
        headers: {
          'x-api-key': process?.env?.AI_GURU_LAB_API_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 20000
      }
    );
    return result.data.image;
  } catch (e) {
    console.error('Image generation failed:', e?.response?.data || e?.message || e);
    return `https://placehold.co/1024x576/png?text=${encodeURIComponent("Course Banner")}`;
  }
};
