import { quizzesTable, userActivityTable } from "../../../config/schema";
import { db } from "../../../config/db";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

const serialize = (obj) =>
  JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)));

async function logActivity(userEmail, actionType, title, entityId, entityType, metadata = null) {
  try {
    await db.insert(userActivityTable).values({
      userEmail,
      actionType,
      title,
      entityId,
      entityType,
      metadata
    });
  } catch (err) {
    console.error("[Activity Log] Failed:", err.message);
  }
}

export async function POST(req) {
  try {
    const user = await currentUser();
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
        { success: false, error: "Missing required fields: quizId, title, topic, difficulty, questionCount, and quizData are mandatory" },
        { status: 400 }
      );
    }

    const userEmail = user.primaryEmailAddress?.emailAddress;

    await db.insert(quizzesTable).values({
      quizId,
      title,
      description: description || "",
      topic,
      difficulty,
      questionCount,
      quizData,
      userEmail,
      createdBy: user.id
    });

    await logActivity(
      userEmail,
      'quiz_create',
      `Created quiz: ${title}`,
      quizId,
      'quiz',
      { topic, difficulty, questionCount }
    );

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error("Error saving quiz:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error"
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await db
      .select()
      .from(quizzesTable)
      .orderBy(desc(quizzesTable.createdAt));

    return NextResponse.json({
      success: true,
      quizzes: serialize(result),
      currentUserId: user.id
    });

  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error"
      },
      { status: 500 }
    );
  }
}
