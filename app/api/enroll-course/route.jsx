import { coursesTable, enrollCourseTable } from "../../../config/schema";
import { db } from "../../../config/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const serialize = (obj) => {
  return JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)));
};

const EnrollSchema = z.object({
  courseId: z.string().min(1),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const validation = EnrollSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const { courseId } = validation.data;
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const enrollCourses = await db.select({ id: enrollCourseTable.id })
      .from(enrollCourseTable)
      .where(and(
        eq(enrollCourseTable.userEmail, user.primaryEmailAddress.emailAddress),
        eq(enrollCourseTable.cid, courseId)
      ))
      .limit(1);

    if (enrollCourses?.length > 0) {
      return NextResponse.json({ resp: "Already Enrolled" });
    }

    const result = await db.insert(enrollCourseTable)
      .values({
        cid: courseId,
        userEmail: user.primaryEmailAddress.emailAddress
      })
      .returning({ id: enrollCourseTable.id, cid: enrollCourseTable.cid });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API /enroll-course POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to enroll in course." },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams?.get("courseId");

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { courseContent, ...courseColumns } = getTableColumns(coursesTable);

    if (courseId) {
      const result = await db
        .select({
          courses: courseColumns,
          enrollCourse: enrollCourseTable,
        })
        .from(coursesTable)
        .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
        .where(and(
          eq(enrollCourseTable.userEmail, user.primaryEmailAddress.emailAddress),
          eq(enrollCourseTable.cid, courseId)
        ))
        .limit(1);

      if (result.length === 0) {
        return NextResponse.json(null);
      }

      const fullCourse = await db.select().from(coursesTable).where(eq(coursesTable.cid, courseId)).limit(1);

      return NextResponse.json(serialize({
        courses: fullCourse[0] || result[0].courses,
        enrollCourse: result[0].enrollCourse
      }));
    }

    const result = await db
      .select({
        courses: courseColumns,
        enrollCourse: enrollCourseTable,
      })
      .from(coursesTable)
      .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
      .where(eq(enrollCourseTable.userEmail, user.primaryEmailAddress.emailAddress))
      .orderBy(desc(enrollCourseTable.id))
      .limit(50);

    return NextResponse.json(serialize(result));
  } catch (error) {
    console.error("[API /enroll-course GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch enrolled courses." },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { completedChapter, courseId } = await req.json();
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const result = await db.update(enrollCourseTable)
      .set({ completedChapters: completedChapter })
      .where(and(
        eq(enrollCourseTable.cid, courseId),
        eq(enrollCourseTable.userEmail, user.primaryEmailAddress.emailAddress)
      ))
      .returning({ id: enrollCourseTable.id, completedChapters: enrollCourseTable.completedChapters });

    return NextResponse.json(serialize(result));
  } catch (error) {
    console.error("[API /enroll-course PUT] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update progress." },
      { status: 500 }
    );
  }
}
