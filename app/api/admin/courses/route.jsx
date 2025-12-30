import { coursesTable, enrollCourseTable } from "../../../../config/schema";
import { db } from "../../../../config/db";
import { NextResponse } from "next/server";
import { desc, eq, like, or, count } from "drizzle-orm";
import { requireAdmin } from "../../../../@/lib/admin";

const serialize = (obj) =>
  JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)));

export async function GET(req) {
  try {
    await requireAdmin();

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

    const courses = await query;

    const coursesWithEnrollments = await Promise.all(
      courses.map(async (course) => {
        const [enrollmentCount] = await db
          .select({ count: count() })
          .from(enrollCourseTable)
          .where(eq(enrollCourseTable.cid, course.cid));

        return {
          ...course,
          enrollmentCount: enrollmentCount?.count || 0
        };
      })
    );

    return NextResponse.json({
      success: true,
      courses: serialize(coursesWithEnrollments),
      count: coursesWithEnrollments.length
    });

  } catch (error) {
    console.error("Error fetching courses:", error);
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await requireAdmin();

    const { cid, name, description, level, category, bannerImageUrl } = await req.json();

    if (!cid) {
      return NextResponse.json({ success: false, error: "Course ID is required" }, { status: 400 });
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
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      course: serialize(result[0]),
      message: "Course updated successfully"
    });

  } catch (error) {
    console.error("Error updating course:", error);
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const cid = searchParams?.get("cid");

    if (!cid) {
      return NextResponse.json({ success: false, error: "Course ID is required" }, { status: 400 });
    }

    await db.delete(enrollCourseTable).where(eq(enrollCourseTable.cid, cid));

    const result = await db
      .delete(coursesTable)
      .where(eq(coursesTable.cid, cid))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Course and related enrollments deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting course:", error);
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Failed to delete course" }, { status: 500 });
  }
}
