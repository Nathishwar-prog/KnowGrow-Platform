import { coursesTable } from "../../../../config/schema";
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

// GET - Fetch all courses
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

    let query = db.select().from(coursesTable).orderBy(desc(coursesTable.id));

    if (search) {
      query = query.where(
        or(
          like(coursesTable.name, `%${search}%`),
          like(coursesTable.description, `%${search}%`),
          like(coursesTable.category, `%${search}%`)
        )
      );
    }

    const result = await query;

    return NextResponse.json({
      success: true,
      courses: serialize(result),
      count: result.length
    });

  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// DELETE - Delete course
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
    const cid = searchParams?.get("cid");

    if (!cid) {
      return NextResponse.json(
        { success: false, error: "Course ID is required" },
        { status: 400 }
      );
    }

    const result = await db
      .delete(coursesTable)
      .where(eq(coursesTable.cid, cid))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete course" },
      { status: 500 }
    );
  }
}

// PUT - Update course
export async function PUT(req) {
  const auth = verifyAdmin(req);
  if (!auth.valid) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: 401 }
    );
  }

  try {
    const { cid, name, description, level, category, bannerImageUrl } = await req.json();

    if (!cid) {
      return NextResponse.json(
        { success: false, error: "Course ID is required" },
        { status: 400 }
      );
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (level) updateData.level = level;
    if (category) updateData.category = category;
    if (bannerImageUrl !== undefined) updateData.bannerImageUrl = bannerImageUrl;

    const result = await db
      .update(coursesTable)
      .set(updateData)
      .where(eq(coursesTable.cid, cid))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      course: serialize(result[0]),
      message: "Course updated successfully"
    });

  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update course" },
      { status: 500 }
    );
  }
}

