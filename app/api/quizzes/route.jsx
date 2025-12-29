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

    const { quizId, title, description, topic, difficulty, questionCount, quizData } = await req.json();

    // Validate required fields
    if (!quizId || !title || !topic || !difficulty || !questionCount || !quizData) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save quiz to database
    const result = await db.insert(quizzesTable).values({
      quizId,
      title,
      description: description || "",
      topic,
      difficulty,
      questionCount,
      quizData,
      userEmail: user.primaryEmailAddress?.emailAddress,
      createdBy: user.id
    }).returning();

    return NextResponse.json({
      success: true,
      quiz: serialize(result[0]),
      message: "Quiz saved successfully"
    });

  } catch (error) {
    console.error("Error saving quiz:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save quiz",
        details: error.message
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

    // Fetch specific quiz by ID
    if (quizId) {
      const result = await db
        .select()
        .from(quizzesTable)
        .where(eq(quizzesTable.quizId, quizId));

      if (result.length === 0) {
        return NextResponse.json(
          { success: false, error: "Quiz not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        quiz: serialize(result[0])
      });
    }

    // Fetch all quizzes (from all users)
    const result = await db
      .select()
      .from(quizzesTable)
      .orderBy(desc(quizzesTable.id));

    return NextResponse.json({
      success: true,
      quizzes: serialize(result),
      count: result.length
    });

  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch quizzes",
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
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

    if (!quizId) {
      return NextResponse.json(
        { success: false, error: "Quiz ID is required" },
        { status: 400 }
      );
    }

    const existingQuiz = await db
      .select()
      .from(quizzesTable)
      .where(eq(quizzesTable.quizId, quizId));

    if (existingQuiz.length === 0) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 }
      );
    }

    const quiz = existingQuiz[0];
    if (quiz.createdBy !== user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You are not the owner of this quiz" },
        { status: 403 }
      );
    }

    await db
      .delete(quizzesTable)
      .where(eq(quizzesTable.quizId, quizId));

    return NextResponse.json({
      success: true,
      message: "Quiz deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete quiz",
        details: error.message
      },
      { status: 500 }
    );
  }
}

