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

function extractCourseLanguage(courseTitle) {
  const languageKeywords = [
    'TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Golang',
    'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Dart', 'Flutter', 'React',
    'Angular', 'Vue', 'Node.js', 'Next.js', 'Django', 'Flask', 'Spring',
    'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'GCP', 'Machine Learning', 'Deep Learning', 'AI',
    'Data Science', 'DevOps', 'Blockchain', 'Solidity', 'Web3'
  ];
  
  const titleLower = courseTitle.toLowerCase();
  for (const lang of languageKeywords) {
    if (titleLower.includes(lang.toLowerCase())) {
      return lang;
    }
  }
  return null;
}

function filterVideosByRelevance(videos, courseLanguage, chapterTitle) {
  if (!courseLanguage || videos.length === 0) return videos.slice(0, 2);
  
  const langLower = courseLanguage.toLowerCase();
  const chapterLower = chapterTitle.toLowerCase();
  
  const excludeTerms = {
    'typescript': ['java tutorial', 'java programming', 'javascript basics'],
    'javascript': [],
    'python': ['java', 'c++', 'c#'],
    'java': ['javascript', 'typescript'],
    'react': [],
    'angular': ['react', 'vue'],
    'vue': ['react', 'angular']
  };
  
  const exclusions = excludeTerms[langLower] || [];
  
  const scored = videos.map(video => {
    const titleLower = video.title?.toLowerCase() || '';
    let score = 0;
    
    if (titleLower.includes(langLower)) {
      score += 10;
    }
    
    const chapterWords = chapterLower.split(/\s+/).filter(w => w.length > 3);
    for (const word of chapterWords) {
      if (titleLower.includes(word)) {
        score += 2;
      }
    }
    
    if (titleLower.includes('tutorial')) score += 3;
    if (titleLower.includes('course')) score += 2;
    if (titleLower.includes('beginner')) score += 1;
    if (titleLower.includes('learn')) score += 1;
    
    for (const exclude of exclusions) {
      if (titleLower.includes(exclude) && !titleLower.includes(langLower)) {
        score -= 20;
      }
    }
    
    if (langLower === 'typescript') {
      if (titleLower.includes('java') && !titleLower.includes('javascript') && !titleLower.includes('typescript')) {
        score -= 30;
      }
    }
    
    return { ...video, relevanceScore: score };
  });
  
  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  const filtered = scored.filter(v => v.relevanceScore > 0);
  
  if (filtered.length >= 2) {
    return filtered.slice(0, 2);
  }
  
  return scored.slice(0, 2);
}

async function fetchYoutubeVideos(courseLanguage, chapterTitle, topics, maxResults = 6) {
  try {
    if (!process.env.YOUTUBE_API_KEY) {
      console.warn("[YouTube] Missing YOUTUBE_API_KEY");
      return [];
    }
    
    const topicStr = topics.slice(0, 2).join(' ');
    let searchQuery;
    
    if (courseLanguage) {
      searchQuery = `${courseLanguage} ${chapterTitle} tutorial ${topicStr}`;
    } else {
      searchQuery = `${chapterTitle} programming tutorial ${topicStr}`;
    }
    
    const params = {
      part: 'snippet',
      q: searchQuery,
      maxResults: maxResults,
      type: 'video',
      videoEmbeddable: 'true',
      relevanceLanguage: 'en',
      key: process.env.YOUTUBE_API_KEY
    };

    const resp = await axios.get(YOUTUBE_BASE_URL, { params, timeout: 10000 });
    const items = resp.data.items || [];
    
    const videos = items.map(item => ({
      videoId: item.id?.videoId,
      title: item?.snippet?.title || '',
      thumbnail: item?.snippet?.thumbnails?.medium?.url || item?.snippet?.thumbnails?.default?.url || '',
      videoUrl: item.id?.videoId ? `https://www.youtube.com/watch?v=${item.id.videoId}` : '',
      channelTitle: item?.snippet?.channelTitle || '',
      publishedAt: item?.snippet?.publishedAt || ''
    }));
    
    return filterVideosByRelevance(videos, courseLanguage, chapterTitle);
  } catch (e) {
    console.error('[YouTube] API error:', e?.response?.data || e?.message);
    return [];
  }
}

function normalizeChapterTitle(chapter) {
  const rawTitle = chapter?.chapterName || chapter?.name || '';
  
  const cleaned = rawTitle
    .replace(/^chapter\s*\d+\s*[:\-–]\s*/i, '')
    .replace(/^\d+\.\s*/, '')
    .trim();
  
  if (cleaned.length > 60) {
    const shortened = cleaned.substring(0, 57) + '...';
    return shortened;
  }
  
  return cleaned || 'Untitled Chapter';
}

function normalizeSubTopics(chapter) {
  const topics = chapter?.topics || [];
  return topics.map(t => {
    if (typeof t === 'string') return t;
    return t?.name || t?.topic || String(t);
  }).filter(Boolean);
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
        
        const courseLanguage = extractCourseLanguage(courseTitle);
        if (courseLanguage) {
          sendProgress('progress', `Detected course language: ${courseLanguage}`);
        }
        
        const totalChapters = courseJson.chapters.length;
        sendProgress('progress', `Preparing to generate ${totalChapters} chapters`);

        const chaptersWithContent = [];

        for (let i = 0; i < totalChapters; i++) {
          const chapter = courseJson.chapters[i];
          const chapterId = uuidv4();
          const rawChapterName = chapter?.chapterName || chapter?.name || `Chapter ${i + 1}`;
          const normalizedTitle = normalizeChapterTitle(chapter);
          const subTopics = normalizeSubTopics(chapter);
          const chapterNum = i + 1;

          sendProgress('progress', `Chapter ${chapterNum}/${totalChapters}: Generating content for "${normalizedTitle}"...`);

          const prompt = PROMPT + '\n\nInput Data:\n' +
            'Chapter Name: ' + normalizedTitle + '\n' +
            'Course Name: ' + courseTitle + '\n' +
            (courseLanguage ? `Programming Language: ${courseLanguage}\n` : '') +
            JSON.stringify(chapter);

          const aiResult = await generateContent(prompt, {
            geminiModel: 'gemini-2.5-flash',
            maxGeminiRetries: 1,
            geminiBackoffMs: 2000,
          });

          let courseData = { topics: [], chapterName: normalizedTitle, error: false };

          if (aiResult.success) {
            sendProgress('progress', `Chapter ${chapterNum}: Content generated via ${aiResult.provider}`);
            const parsed = parseJsonResponse(aiResult.content);
            
            if (parsed.success) {
              courseData = {
                ...parsed.data,
                chapterName: normalizedTitle
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

          sendProgress('progress', `Chapter ${chapterNum}: Fetching ${courseLanguage || ''} YouTube videos...`);
          
          const youtubeVideos = await fetchYoutubeVideos(
            courseLanguage,
            normalizedTitle,
            subTopics,
            6
          );
          
          if (youtubeVideos.length === 2) {
            sendProgress('progress', `Chapter ${chapterNum}: Found 2 relevant ${courseLanguage || ''} videos`);
          } else if (youtubeVideos.length > 0) {
            sendProgress('progress', `Chapter ${chapterNum}: Found ${youtubeVideos.length} video(s)`);
          } else {
            sendProgress('progress', `Chapter ${chapterNum}: No videos found, continuing...`);
          }

          chaptersWithContent.push({
            chapterId,
            orderIndex: i,
            chapterName: normalizedTitle,
            rawChapterName,
            description: `Learn about ${normalizedTitle} in this chapter`,
            subTopics,
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

        sendProgress('progress', 'Validating chapter data...');
        
        const validatedChapters = chaptersWithContent.map(ch => ({
          ...ch,
          youtubeVideo: ch.youtubeVideo.slice(0, 2)
        }));

        sendProgress('progress', 'Saving course to database...');

        await db.update(coursesTable).set({
          courseContent: validatedChapters
        }).where(eq(coursesTable.cid, courseId));

        sendProgress('progress', 'Course saved successfully!');

        sendProgress('done', 'Course generation completed!', {
          courseName: courseTitle,
          courseLanguage: courseLanguage || 'General',
          chaptersProcessed: validatedChapters.length,
          chaptersWithVideos: validatedChapters.filter(ch => ch.youtubeVideo?.length === 2).length,
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
