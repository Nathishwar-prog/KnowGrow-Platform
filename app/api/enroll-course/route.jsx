import { coursesTable, enrollCourseTable } from "../../../config/schema";
import { db } from "../../../config/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const API_TIMEOUT_MS = 5000;

const EnrollSchema = z.object({
  courseId: z.string().min(1),
});

async function withTimeout(promise, timeoutMs = API_TIMEOUT_MS) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

const serialize = (obj) => {
  return JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)));
};

export async function POST(req) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const validation = EnrollSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Invalid course ID" }, { status: 400 });
    }

    const { courseId } = validation.data;
    const user = await withTimeout(currentUser(), 2000);

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    const existingEnrollment = await withTimeout(
      db.select({ id: enrollCourseTable.id })
        .from(enrollCourseTable)
        .where(and(
          eq(enrollCourseTable.userEmail, userEmail),
          eq(enrollCourseTable.cid, courseId)
        ))
        .limit(1),
      2000
    );

    if (existingEnrollment.length > 0) {
      return NextResponse.json({ success: true, message: 'Already enrolled' });
    }

    const result = await withTimeout(
      db.insert(enrollCourseTable)
        .values({
          cid: courseId,
          userEmail: userEmail
        })
        .returning({ id: enrollCourseTable.id, cid: enrollCourseTable.cid }),
      2000
    );

    return NextResponse.json({ success: true, data: result[0] });

  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[API /api/enroll-course POST] Error after ${elapsed}ms:`, error.message);

    if (error.message === 'TIMEOUT') {
      return NextResponse.json(
        { success: false, error: "Request took too long. Please try again." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to enroll. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const startTime = Date.now();

  try {
    const user = await withTimeout(currentUser(), 2000);
    
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams?.get('courseId');
    const userEmail = user.primaryEmailAddress.emailAddress;

    const { courseContent, courseJson, ...lightCourseColumns } = getTableColumns(coursesTable);

    if (courseId) {
      const result = await withTimeout(
        db.select({
          courses: lightCourseColumns,
          enrollCourse: enrollCourseTable
        })
        .from(enrollCourseTable)
        .innerJoin(coursesTable, eq(coursesTable.cid, enrollCourseTable.cid))
        .where(and(
          eq(enrollCourseTable.userEmail, userEmail),
          eq(enrollCourseTable.cid, courseId)
        ))
        .limit(1),
        3000
      );

      return NextResponse.json(serialize(result[0] ?? null));
    }

    const result = await withTimeout(
      db.select({
        courses: lightCourseColumns,
        enrollCourse: enrollCourseTable
      })
      .from(enrollCourseTable)
      .innerJoin(coursesTable, eq(coursesTable.cid, enrollCourseTable.cid))
      .where(eq(enrollCourseTable.userEmail, userEmail))
      .orderBy(desc(enrollCourseTable.id))
      .limit(20),
      4000
    );

    const elapsed = Date.now() - startTime;
    if (elapsed > 3000) {
      console.warn(`[API /api/enroll-course GET] Slow response: ${elapsed}ms`);
    }

    return NextResponse.json(serialize(result));

  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[API /api/enroll-course GET] Error after ${elapsed}ms:`, error.message);

    if (error.message === 'TIMEOUT') {
      return NextResponse.json(
        { success: false, error: "Request took too long. Please try again." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to fetch enrolled courses." },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const startTime = Date.now();

  try {
    const { completedChapter, courseId } = await req.json();
    const user = await withTimeout(currentUser(), 2000);

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    const result = await withTimeout(
      db.update(enrollCourseTable)
        .set({ completedChapters: completedChapter })
        .where(and(
          eq(enrollCourseTable.cid, courseId),
          eq(enrollCourseTable.userEmail, user.primaryEmailAddress.emailAddress)
        ))
        .returning({ id: enrollCourseTable.id }),
      3000
    );

    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[API /api/enroll-course PUT] Error after ${elapsed}ms:`, error.message);

    if (error.message === 'TIMEOUT') {
      return NextResponse.json(
        { success: false, error: "Request took too long. Please try again." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update progress." },
      { status: 500 }
    );
  }
}
