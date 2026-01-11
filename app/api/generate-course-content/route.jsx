import { NextResponse } from "next/server";
import { ai } from "../../../@/lib/ai";
import axios from "axios";
import { db } from "../../../config/db";
import { coursesTable } from "../../../config/schema";
import { eq } from "drizzle-orm";

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
  const { courseJson, courseTitle, courseId } = await req.json();

  const promises = courseJson?.chapters?.map(async (chapter) => {
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

    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    const RawResp = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let JSONResponse = null;

    try {
      const RawJson = RawResp.replace(/```json|```/g, "").trim();

      // Extra cleanup for trailing commas
      const safeJson = RawJson
        .replace(/,\s*}/g, "}")   // remove trailing comma before }
        .replace(/,\s*]/g, "]");  // remove trailing comma before ]

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
  });

  const CourseContent = await Promise.all(promises);

  // save to DataBase
  await db.update(coursesTable).set({
    courseContent: CourseContent
  }).where(eq(coursesTable.cid, courseId));

  return NextResponse.json({
    courseName: courseTitle,
    CourseContent: CourseContent
  })
}

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search'
const GetYoutubeVideo = async (topic) => {
  const params = {
    part: 'snippet',
    q: topic,
    maxResult: 4,
    type: 'video',
    key: process.env.YOUTUBE_API_KEY              // YOUTUBE API KEY
  }

  const resp = await axios.get(YOUTUBE_BASE_URL, { params });
  const youtubeVideoListResp = resp.data.items;
  const youtubeVideoList = [];
  youtubeVideoListResp.forEach(item => {
    const data = {
      videoId: item.id?.videoId,
      title: item?.snippet?.title
    }
    youtubeVideoList.push(data);

  });
  console.log("youtubeVideoList", youtubeVideoList);
  return youtubeVideoList;
}
