import { quizzesTable } from "../../../../config/schema";
import { db } from "../../../../config/db";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

const serialize = (obj) =>
  JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)));

export async function GET(req, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { quizId } = params;

    if (!quizId) {
      return NextResponse.json(
        { success: false, error: "Quiz ID is required" },
        { status: 400 }
      );
    }

    // Fetch quiz from database
    const result = await db
      .select({
        id: quizzesTable.id,
        quizId: quizzesTable.quizId,
        title: quizzesTable.title,
        description: quizzesTable.description,
        topic: quizzesTable.topic,
        difficulty: quizzesTable.difficulty,
        questionCount: quizzesTable.questionCount,
        quizData: quizzesTable.quizData,
        createdBy: quizzesTable.createdBy,
        createdAt: quizzesTable.createdAt,
        userEmail: quizzesTable.userEmail
      })
      .from(quizzesTable)
      .where(eq(quizzesTable.quizId, quizId));

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 }
      );
    }

    // Any authenticated user can view the quiz
    return NextResponse.json({
      success: true,
      quiz: serialize(result[0])
    });

  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { quizId } = params;

    if (!quizId) {
      return NextResponse.json(
        { success: false, error: "Quiz ID is required" },
        { status: 400 }
      );
    }

    // Fetch quiz to check ownership
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

    // Ownership check: Only creator can delete
    if (quiz.createdBy !== user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Only the creator can delete this quiz" },
        { status: 403 }
      );
    }

    // Secure delete
    await db
      .delete(quizzesTable)
      .where(
        and(
          eq(quizzesTable.quizId, quizId),
          eq(quizzesTable.createdBy, user.id)
        )
      );

    return NextResponse.json({
      success: true,
      message: "Quiz deleted successfully"
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
