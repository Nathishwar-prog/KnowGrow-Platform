import { NextResponse } from "next/server";
import { ai } from "../../../@/lib/ai";
import axios from "axios";
import { db } from "../../../config/db";
import { coursesTable } from "../../../config/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60000;
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

const PROMPT = 'Generate a detailed course content for the following chapter in JSON format. The output MUST be a valid JSON object with a "topics" array. Each topic object in the array must have "topic" (string) and "content" (string) fields. The "content" field MUST be a string containing structured HTML. \n\n' +
  'HTML Requirements:\n' +
  '- Use <h3> for subheadings.\n' +
  '- Use <p> for paragraphs.\n' +
  '- Use <ul> and <li> for lists.\n' +
  '- Use <pre><code class="language-[language_name]">...</code></pre> for code blocks. ALWAYS specify the language class (e.g., language-javascript, language-python).\n' +
  '- Use <span class="kg-highlight">term</span> for important terms.\n' +
  '- Use <div class="kg-callout kg-tip">💡 <strong>Pro Tip:</strong> ...</div> for helpful tips.\n' +
  '- Use <div class="kg-callout kg-warning">⚠️ <strong>Warning:</strong> ...</div> for common pitfalls.\n' +
  '- Use <div class="kg-callout kg-example">🎯 <strong>Real-World Example:</strong> ...</div> for practical scenarios.\n' +
  '- Use <div class="kg-objectives"><strong>🎯 In this section, you will learn:</strong><ul><li>...</li></ul></div> at the beginning of complex topics.\n' +
  '- Include ASCII diagrams or request visual descriptions where helpful.\n' +
  '- Ensure content is detailed, technical, and includes best practices.\n\n' +
  'Strictly return ONLY the JSON object.';

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
          error: `Please wait ${rateCheck.waitTime} seconds before generating more content.` 
        },
        { status: 429 }
      );
    }
    
    const { courseJson, courseTitle, courseId } = await req.json();
    
    if (!courseJson?.chapters || !courseId) {
      return NextResponse.json(
        { success: false, error: "Course data and ID are required" },
        { status: 400 }
      );
    }

    const processChapter = async (chapter, index) => {
      const config = {
        responseMimeType: 'text/plain',
      };
      const model = "gemini-2.5-flash";
      const contents = [
        {
          role: "user",
          parts: [
            {
              text: PROMPT + '\n\nInput Data:\n' +
                'Chapter Name: ' + chapter?.name + '\n' +
                'Course Name: ' + courseTitle + '\n' +
                JSON.stringify(chapter),
            },
          ],
        },
      ];

      let response;
      try {
        response = await callAIWithRetry(model, config, contents, 3);
      } catch (aiError) {
        console.error(`AI error for chapter ${index}:`, aiError);
        throw new Error(`Failed to generate content for chapter: ${chapter?.name || index}`);
      }

      const RawResp = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      let JSONResponse = null;

      try {
        const RawJson = RawResp.replace(/```json|```/g, "").trim();
        const safeJson = RawJson
          .replace(/,\s*}/g, "}")
          .replace(/,\s*]/g, "]");
        JSONResponse = JSON.parse(safeJson);
      } catch (err) {
        console.error("JSON parse error:", err.message, "\nRaw response:", RawResp);
        throw new Error("Invalid JSON returned by model");
      }

      const youtubeData = await GetYoutubeVideo(chapter?.name);

      return {
        youtubeVideo: youtubeData,
        courseData: {
          ...JSONResponse,
          chapterName: chapter?.name
        }
      };
    };

    const results = [];
    for (let i = 0; i < courseJson.chapters.length; i++) {
      const chapter = courseJson.chapters[i];
      try {
        const result = await processChapter(chapter, i);
        results.push(result);
        if (i < courseJson.chapters.length - 1) {
          await new Promise(res => setTimeout(res, 500));
        }
      } catch (chapterError) {
        console.error(`Error processing chapter ${i}:`, chapterError);
        results.push({
          youtubeVideo: [],
          courseData: {
            topics: [],
            chapterName: chapter?.name,
            error: true
          }
        });
      }
    }

    await db.update(coursesTable).set({
      courseContent: results
    }).where(eq(coursesTable.cid, courseId));

    return NextResponse.json({
      success: true,
      courseName: courseTitle,
      CourseContent: results
    });
  } catch (error) {
    console.error("Route Error:", error);
    
    const isRateLimit = error?.status === 429 || 
                        error?.message?.includes("429") || 
                        error?.message?.toLowerCase().includes("rate limit");
    
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
}

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

const GetYoutubeVideo = async (topic) => {
  try {
    if (!process.env.YOUTUBE_API_KEY) {
      console.warn("Missing YOUTUBE_API_KEY");
      return [];
    }
    
    const params = {
      part: 'snippet',
      q: topic,
      maxResults: 4,
      type: 'video',
      key: process.env.YOUTUBE_API_KEY
    };

    const resp = await axios.get(YOUTUBE_BASE_URL, { params, timeout: 10000 });
    const youtubeVideoListResp = resp.data.items || [];
    const youtubeVideoList = [];
    
    youtubeVideoListResp.forEach(item => {
      const data = {
        videoId: item.id?.videoId,
        title: item?.snippet?.title
      };
      youtubeVideoList.push(data);
    });
    
    return youtubeVideoList;
  } catch (e) {
    console.error('YouTube API error:', e?.response?.data || e?.message);
    return [];
  }
};
