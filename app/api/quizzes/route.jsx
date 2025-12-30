import { quizzesTable } from "../../../config/schema";
import { db } from "../../../config/db";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

const API_TIMEOUT_MS = 6000;

async function withTimeout(promise, timeoutMs = API_TIMEOUT_MS) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

const serialize = (obj) =>
  JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)));

export async function POST(req) {
  const startTime = Date.now();
  
  try {
    const user = await withTimeout(currentUser(), 2000);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { quizId, title, description, topic, difficulty, questionCount, quizData } = body;

    if (!quizId || !title || !topic || !difficulty || !questionCount || !quizData) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await withTimeout(
      db.insert(quizzesTable).values({
        quizId,
        title,
        description: description || "",
        topic,
        difficulty,
        questionCount,
        quizData,
        userEmail: user.primaryEmailAddress?.emailAddress,
        createdBy: user.id
      }),
      3000
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[API /api/quizzes POST] Error after ${elapsed}ms:`, error.message);
    
    if (error.message === 'TIMEOUT') {
      return NextResponse.json(
        { success: false, error: "Request took too long. Please try again." },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const startTime = Date.now();
  
  try {
    const user = await withTimeout(currentUser(), 2000);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await withTimeout(
      db.select({
        id: quizzesTable.id,
        quizId: quizzesTable.quizId,
        title: quizzesTable.title,
        description: quizzesTable.description,
        topic: quizzesTable.topic,
        difficulty: quizzesTable.difficulty,
        questionCount: quizzesTable.questionCount,
        createdAt: quizzesTable.createdAt
      })
      .from(quizzesTable)
      .orderBy(desc(quizzesTable.createdAt))
      .limit(50),
      4000
    );

    return NextResponse.json({
      success: true,
      quizzes: serialize(result)
    });

  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[API /api/quizzes GET] Error after ${elapsed}ms:`, error.message);
    
    if (error.message === 'TIMEOUT') {
      return NextResponse.json(
        { success: false, error: "Request took too long. Please try again." },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
