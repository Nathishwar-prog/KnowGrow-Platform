import { quizzesTable } from "../../../../config/schema";
import { db } from "../../../../config/db";
import { NextResponse } from "next/server";
import { desc, eq, like, or } from "drizzle-orm";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

const serialize = (obj) =>
  JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)));

// Verify admin token
const verifyAdmin = (req) => {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return { valid: false, error: "No token provided" };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return { valid: false, error: "Unauthorized" };
    }
    return { valid: true, admin: decoded };
  } catch (error) {
    return { valid: false, error: "Invalid token" };
  }
};

// GET - Fetch all quizzes
export async function GET(req) {
  const auth = verifyAdmin(req);
  if (!auth.valid) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams?.get("search");

    let query = db.select().from(quizzesTable).orderBy(desc(quizzesTable.id));

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
    return NextResponse.json(
      { success: false, error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}

// DELETE - Delete quiz
export async function DELETE(req) {
  const auth = verifyAdmin(req);
  if (!auth.valid) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const quizId = searchParams?.get("quizId");

    if (!quizId) {
      return NextResponse.json(
        { success: false, error: "Quiz ID is required" },
        { status: 400 }
      );
    }

    const result = await db
      .delete(quizzesTable)
      .where(eq(quizzesTable.quizId, quizId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Quiz deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}

