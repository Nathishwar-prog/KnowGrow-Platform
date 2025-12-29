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

    const quiz = result[0];

    // Ownership check
    if (quiz.createdBy !== user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You do not own this quiz" },
        { status: 403 }
      );
    }

    // Secure delete with ownership check in WHERE clause as well for defense in depth
    await db
      .delete(quizzesTable)
      .where(
        and(
          eq(quizzesTable.quizId, quizId),
          eq(quizzesTable.createdBy, user.id)
        )
      );

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error"
      },
      { status: 500 }
    );
  }
}
