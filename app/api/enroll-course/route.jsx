import { coursesTable, enrollCourseTable, userActivityTable } from "../../../config/schema";
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

    const userEmail = user.primaryEmailAddress.emailAddress;

    const enrollCourses = await db.select({ id: enrollCourseTable.id })
      .from(enrollCourseTable)
      .where(and(
        eq(enrollCourseTable.userEmail, userEmail),
        eq(enrollCourseTable.cid, courseId)
      ))
      .limit(1);

    if (enrollCourses?.length > 0) {
      return NextResponse.json({ resp: "Already Enrolled" });
    }

    const courseInfo = await db.select({ name: coursesTable.name })
      .from(coursesTable)
      .where(eq(coursesTable.cid, courseId))
      .limit(1);

    const courseName = courseInfo[0]?.name || 'a course';

    const result = await db.insert(enrollCourseTable)
      .values({
        cid: courseId,
        userEmail: userEmail,
        enrolledAt: new Date(),
        lastActivityAt: new Date()
      })
      .returning({ id: enrollCourseTable.id, cid: enrollCourseTable.cid });

    await logActivity(
      userEmail,
      'enroll',
      `Enrolled in ${courseName}`,
      courseId,
      'course'
    );

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
    const { completedChapter, courseId, chapterName } = await req.json();
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    const existingEnroll = await db.select({ 
      completedChapters: enrollCourseTable.completedChapters 
    })
      .from(enrollCourseTable)
      .where(and(
        eq(enrollCourseTable.cid, courseId),
        eq(enrollCourseTable.userEmail, userEmail)
      ))
      .limit(1);

    const previousCount = Array.isArray(existingEnroll[0]?.completedChapters) 
      ? existingEnroll[0].completedChapters.length 
      : 0;
    const newCount = Array.isArray(completedChapter) ? completedChapter.length : 0;
    const isNewCompletion = newCount > previousCount;

    const result = await db.update(enrollCourseTable)
      .set({ 
        completedChapters: completedChapter,
        lastActivityAt: new Date()
      })
      .where(and(
        eq(enrollCourseTable.cid, courseId),
        eq(enrollCourseTable.userEmail, userEmail)
      ))
      .returning({ id: enrollCourseTable.id, completedChapters: enrollCourseTable.completedChapters });

    if (isNewCompletion && chapterName) {
      await logActivity(
        userEmail,
        'chapter_complete',
        `Completed: ${chapterName}`,
        courseId,
        'chapter',
        { chapterIndex: newCount - 1 }
      );

      const courseInfo = await db.select({ 
        noOfChapters: coursesTable.noOfChapters,
        name: coursesTable.name 
      })
        .from(coursesTable)
        .where(eq(coursesTable.cid, courseId))
        .limit(1);

      if (courseInfo[0] && newCount >= courseInfo[0].noOfChapters) {
        await logActivity(
          userEmail,
          'course_complete',
          `Completed course: ${courseInfo[0].name}`,
          courseId,
          'course'
        );
      }
    }

    return NextResponse.json(serialize(result));
  } catch (error) {
    console.error("[API /enroll-course PUT] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update progress." },
      { status: 500 }
    );
  }
}
