import { NextResponse } from "next/server";
import { generateContent, parseJsonResponse } from "../../../@/lib/generateContent";
import axios from "axios";
import { db } from "../../../config/db";
import { coursesTable } from "../../../config/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

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

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

async function fetchYoutubeVideos(searchQuery, maxResults = 4) {
  try {
    if (!process.env.YOUTUBE_API_KEY) {
      console.warn("[YouTube] Missing YOUTUBE_API_KEY");
      return [];
    }
    
    const params = {
      part: 'snippet',
      q: searchQuery,
      maxResults: maxResults,
      type: 'video',
      videoEmbeddable: 'true',
      key: process.env.YOUTUBE_API_KEY
    };

    const resp = await axios.get(YOUTUBE_BASE_URL, { params, timeout: 10000 });
    const items = resp.data.items || [];
    
    return items.map(item => ({
      videoId: item.id?.videoId,
      title: item?.snippet?.title || '',
      thumbnail: item?.snippet?.thumbnails?.medium?.url || item?.snippet?.thumbnails?.default?.url || '',
      videoUrl: item.id?.videoId ? `https://www.youtube.com/watch?v=${item.id.videoId}` : '',
      channelTitle: item?.snippet?.channelTitle || '',
      publishedAt: item?.snippet?.publishedAt || ''
    }));
  } catch (e) {
    console.error('[YouTube] API error:', e?.response?.data || e?.message);
    return [];
  }
}

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

    const chaptersWithContent = [];

    for (let i = 0; i < courseJson.chapters.length; i++) {
      const chapter = courseJson.chapters[i];
      const chapterId = uuidv4();
      const chapterName = chapter?.chapterName || chapter?.name || `Chapter ${i + 1}`;
      const topics = chapter?.topics || [];

      console.log(`[Course Content] Processing chapter ${i + 1}: ${chapterName}`);

      const youtubeQuery = `${courseTitle} ${chapterName} ${topics.slice(0, 2).join(' ')} tutorial`;
      const youtubeVideos = await fetchYoutubeVideos(youtubeQuery, 4);
      
      console.log(`[YouTube] Found ${youtubeVideos.length} videos for chapter ${i + 1}`);

      const prompt = PROMPT + '\n\nInput Data:\n' +
        'Chapter Name: ' + chapterName + '\n' +
        'Course Name: ' + courseTitle + '\n' +
        JSON.stringify(chapter);

      const aiResult = await generateContent(prompt, {
        geminiModel: 'gemini-2.5-flash',
        maxGeminiRetries: 1,
        geminiBackoffMs: 2000,
      });

      let courseData = { topics: [], chapterName, error: false };

      if (aiResult.success) {
        console.log(`[Course Content] Chapter ${i + 1} generated via ${aiResult.provider}`);
        const parsed = parseJsonResponse(aiResult.content);
        
        if (parsed.success) {
          courseData = {
            ...parsed.data,
            chapterName
          };
        } else {
          console.error(`[Course Content] Failed to parse AI response for chapter ${i + 1}`);
          courseData.error = true;
        }
      } else {
        console.error(`[Course Content] AI failed for chapter ${i + 1}`);
        courseData.error = true;
      }

      chaptersWithContent.push({
        chapterId,
        orderIndex: i,
        chapterName,
        youtubeVideo: youtubeVideos,
        courseData
      });

      if (i < courseJson.chapters.length - 1) {
        await new Promise(res => setTimeout(res, 500));
      }
    }

    const hasAnyContent = chaptersWithContent.some(ch => 
      ch.courseData?.topics?.length > 0 && !ch.courseData.error
    );

    if (!hasAnyContent) {
      return NextResponse.json(
        { success: false, error: "Failed to generate any chapter content. Please try again." },
        { status: 500 }
      );
    }

    await db.update(coursesTable).set({
      courseContent: chaptersWithContent
    }).where(eq(coursesTable.cid, courseId));

    console.log(`[Course Content] Saved ${chaptersWithContent.length} chapters for course ${courseId}`);

    return NextResponse.json({
      success: true,
      courseName: courseTitle,
      CourseContent: chaptersWithContent,
      chaptersProcessed: chaptersWithContent.length,
      chaptersWithVideos: chaptersWithContent.filter(ch => ch.youtubeVideo?.length > 0).length
    });
  } catch (error) {
    console.error("[Course Content] Route Error:", error);
    
    return NextResponse.json(
      { success: false, error: "Failed to generate course content. Please try again." },
      { status: 500 }
    );
  }
}
