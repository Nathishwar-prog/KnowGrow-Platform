import { quizzesTable } from "../../../../config/schema";
import { db } from "../../../../config/db";
import { NextResponse } from "next/server";
import { desc, eq, like, or } from "drizzle-orm";
import { requireAdmin } from "../../../../@/lib/admin";

const serialize = (obj) =>
  JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)));

export async function GET(req) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const search = searchParams?.get("search");

    let query = db.select().from(quizzesTable).orderBy(desc(quizzesTable.createdAt));

    if (search) {
      query = query.where(
        or(
          like(quizzesTable.title, `%${search}%`),
          like(quizzesTable.topic, `%${search}%`),
          like(quizzesTable.description, `%${search}%`)
        )
      );
    }

    const result = await query;

    return NextResponse.json({
      success: true,
      quizzes: serialize(result),
      count: result.length
    });

  } catch (error) {
    console.error("Error fetching quizzes:", error);
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Failed to fetch quizzes" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const quizId = searchParams?.get("quizId");

    if (!quizId) {
      return NextResponse.json({ success: false, error: "Quiz ID is required" }, { status: 400 });
    }

    const result = await db
      .delete(quizzesTable)
      .where(eq(quizzesTable.quizId, quizId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Quiz deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting quiz:", error);
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Failed to delete quiz" }, { status: 500 });
  }
}
