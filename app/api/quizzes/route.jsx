import { quizzesTable } from "../../../config/schema";
import { db } from "../../../config/db";
import { NextResponse } from "next/server";
import { desc, eq, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

const serialize = (obj) =>
  JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)));

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

    // Validate required fields
    if (!quizId || !title || !topic || !difficulty || !questionCount || !quizData) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: quizId, title, topic, difficulty, questionCount, and quizData are mandatory" },
        { status: 400 }
      );
    }

    // Save quiz to database
    await db.insert(quizzesTable).values({
      quizId,
      title,
      description: description || "",
      topic,
      difficulty,
      questionCount,
      quizData,
      userEmail: user.primaryEmailAddress?.emailAddress,
      createdBy: user.id
    });

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

    const { searchParams } = new URL(req.url);
    const quizId = searchParams?.get("quizId");

    // Fetch all quizzes
    const result = await db
      .select()
      .from(quizzesTable)
      .orderBy(desc(quizzesTable.createdAt));

    return NextResponse.json({
      success: true,
      quizzes: serialize(result)
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
