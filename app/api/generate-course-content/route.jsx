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

function createSSEMessage(type, message, data = null) {
  const payload = { type, message, timestamp: Date.now() };
  if (data) payload.data = data;
  return `data: ${JSON.stringify(payload)}\n\n`;
}

export async function POST(req) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      const sendProgress = (type, message, data = null) => {
        try {
          controller.enqueue(encoder.encode(createSSEMessage(type, message, data)));
        } catch (e) {
          console.error('[SSE] Failed to send:', e);
        }
      };

      try {
        const user = await currentUser();
        
        if (!user) {
          sendProgress('error', 'Authentication required');
          controller.close();
          return;
        }
        
        const userId = user.id;
        const rateCheck = checkRateLimit(userId);
        
        if (!rateCheck.allowed) {
          sendProgress('error', `Please wait ${rateCheck.waitTime} seconds before generating more content.`);
          controller.close();
          return;
        }
        
        const body = await req.json();
        const { courseJson, courseTitle, courseId } = body;
        
        if (!courseJson?.chapters || !courseId) {
          sendProgress('error', 'Course data and ID are required');
          controller.close();
          return;
        }

        sendProgress('progress', 'Starting course generation...');
        
        const totalChapters = courseJson.chapters.length;
        sendProgress('progress', `Preparing to generate ${totalChapters} chapters`);

        const chaptersWithContent = [];

        for (let i = 0; i < totalChapters; i++) {
          const chapter = courseJson.chapters[i];
          const chapterId = uuidv4();
          const chapterName = chapter?.chapterName || chapter?.name || `Chapter ${i + 1}`;
          const topics = chapter?.topics || [];
          const chapterNum = i + 1;

          sendProgress('progress', `Chapter ${chapterNum}/${totalChapters}: Generating content for "${chapterName}"...`);

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
            sendProgress('progress', `Chapter ${chapterNum}: Content generated via ${aiResult.provider}`);
            const parsed = parseJsonResponse(aiResult.content);
            
            if (parsed.success) {
              courseData = {
                ...parsed.data,
                chapterName
              };
              sendProgress('progress', `Chapter ${chapterNum}: Content parsed successfully`);
            } else {
              console.error(`[Course Content] Failed to parse AI response for chapter ${chapterNum}`);
              sendProgress('warning', `Chapter ${chapterNum}: Content parsing issue, using fallback`);
              courseData.error = true;
            }
          } else {
            console.error(`[Course Content] AI failed for chapter ${chapterNum}`);
            sendProgress('warning', `Chapter ${chapterNum}: AI generation issue`);
            courseData.error = true;
          }

          sendProgress('progress', `Chapter ${chapterNum}: Fetching YouTube videos...`);
          
          const youtubeQuery = `${courseTitle} ${chapterName} ${topics.slice(0, 2).join(' ')} tutorial`;
          const youtubeVideos = await fetchYoutubeVideos(youtubeQuery, 4);
          
          if (youtubeVideos.length > 0) {
            sendProgress('progress', `Chapter ${chapterNum}: Found ${youtubeVideos.length} relevant videos`);
          } else {
            sendProgress('progress', `Chapter ${chapterNum}: No videos found, continuing...`);
          }

          chaptersWithContent.push({
            chapterId,
            orderIndex: i,
            chapterName,
            youtubeVideo: youtubeVideos,
            courseData
          });

          sendProgress('progress', `Chapter ${chapterNum}/${totalChapters} completed ✓`, {
            completedChapters: chapterNum,
            totalChapters,
            progress: Math.round((chapterNum / totalChapters) * 100)
          });

          if (i < totalChapters - 1) {
            await new Promise(res => setTimeout(res, 300));
          }
        }

        const hasAnyContent = chaptersWithContent.some(ch => 
          ch.courseData?.topics?.length > 0 && !ch.courseData.error
        );

        if (!hasAnyContent) {
          sendProgress('error', 'Failed to generate any chapter content. Please try again.');
          controller.close();
          return;
        }

        sendProgress('progress', 'Saving course to database...');

        await db.update(coursesTable).set({
          courseContent: chaptersWithContent
        }).where(eq(coursesTable.cid, courseId));

        sendProgress('progress', 'Course saved successfully!');

        sendProgress('done', 'Course generation completed!', {
          courseName: courseTitle,
          chaptersProcessed: chaptersWithContent.length,
          chaptersWithVideos: chaptersWithContent.filter(ch => ch.youtubeVideo?.length > 0).length,
          success: true
        });

        controller.close();
      } catch (error) {
        console.error("[Course Content] Route Error:", error);
        const sendProgress = (type, message) => {
          try {
            controller.enqueue(encoder.encode(createSSEMessage(type, message)));
          } catch (e) {}
        };
        sendProgress('error', 'Failed to generate course content. Please try again.');
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    }
  });
}
