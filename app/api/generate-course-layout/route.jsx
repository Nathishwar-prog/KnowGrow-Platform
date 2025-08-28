import { coursesTable } from "../../../config/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ai } from "../../../@/lib/ai"
// ✅ fixed import
import { NextResponse } from "next/server";
import { db } from "../../../config/db"; // ✅ import db
import axios from "axios";
import { eq } from "drizzle-orm";
const PROMPT = `Genrate Learning Course depends on following details. In which Make sure to add Course Name, Description,Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format Chapter Name, , Topic under each chapters , Duration for each chapters etc, in JSON format only

Schema:

{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",

    "bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": [
          "string"
        ]
      }
    ]
  }
}

, User Input: 
`;


export async function POST(request) {
  try {
    const { courseId, ...formData } = await request.json();
    const user = await currentUser();
    const {has} = await auth();
    const hasPremiumAccess = has({plan:'starter' })

    

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

    if(!hasPremiumAccess){
      const result = await db.select().from(coursesTable)
        .where(eq(coursesTable.userEmail,user?.primaryEmailAddress.emailAddress));

        
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
    console.log( response.candidates[0].content.parts[0].text);
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


const GenerateImage=async(ImagePrompt)=>{
  const BASE_URL='https://aigurulab.tech';
const result = await axios.post(BASE_URL+'/api/generate-image',
        {
            width: 1024,
            height: 1024,
            input: ImagePrompt,
            model: 'flux',//'flux'
            aspectRatio:"16:9"//Applicable to Flux model only
        },
        {
            headers: {
                'x-api-key': process?.env?.AI_GURU_LAB_API_KEY, // Your API Key
                'Content-Type': 'application/json', // Content Type
            },
        })
        console.log(result.data.image) //Output Result: Base 64 Image
        return result.data.image;
      }
