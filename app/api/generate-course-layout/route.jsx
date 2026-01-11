import { coursesTable } from "../../../config/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ai } from "../../../@/lib/ai"
// ✅ fixed import
import { NextResponse } from "next/server";
import { db } from "../../../config/db"; // ✅ import db
import axios from "axios";
import { eq } from "drizzle-orm";
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


export async function POST(request) {
  try {
    const { courseId, ...formData } = await request.json();
    const user = await currentUser();
    const { has } = await auth();
    const hasPremiumAccess = has({ plan: 'starter' })



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

    // If user alredy created any courses

    if (!hasPremiumAccess) {
      const result = await db.select().from(coursesTable)
        .where(eq(coursesTable.userEmail, user?.primaryEmailAddress.emailAddress));


    }

    async function withRetry(fn, retries = 3, delay = 1000) {
      for (let i = 0; i < retries; i++) {
        try {
          return await fn();
        } catch (err) {
          if (i === retries - 1) throw err;
          await new Promise((res) => setTimeout(res, delay * (i + 1)));
        }
      }
    }

    const response = await withRetry(() =>
      ai.models.generateContent({ model, config, contents })
    );
    console.log(response.candidates[0].content.parts[0].text);
    const RawResp = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const RawJson = RawResp.replace(/```json|```/g, "").trim();

    const JSONResponse = JSON.parse(RawJson);
    const ImagePrompt = JSONResponse?.course?.bannerImagePrompt || "";
    //generate a course banner image
    const bannerImageUrl = await GenerateImage(ImagePrompt);
    // ✅ save to DB
    const result = await db.insert(coursesTable).values({
      ...formData,
      courseJson: JSONResponse,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      cid: courseId,
      bannerImageUrl: bannerImageUrl
    });

    return NextResponse.json({ courseId: courseId });
  } catch (error) {
    console.error("Route Error:", error);
    return NextResponse.json(
      { error: true, message: error.message || "Internal Server Error" },
      { status: error.status || 500 }
    );
  }
}


const GenerateImage = async (ImagePrompt) => {
  try {
    // Check if API key exists
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
    )
    console.log(result.data.image)
    return result.data.image;
  } catch (e) {
    console.error('Image generation failed:', e?.response?.data || e?.message || e)
    // Return placeholder on failure instead of empty string
    return `https://placehold.co/1024x576/png?text=${encodeURIComponent("Course Banner")}`;
  }
}
