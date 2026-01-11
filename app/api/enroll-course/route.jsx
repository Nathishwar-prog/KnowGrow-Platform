import { coursesTable, enrollCourseTable } from "../../../config/schema";
import { db } from "../../../config/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const EnrollSchema = z.object({
  courseId: z.string().min(1),
});

export async function POST(req) {
  const body = await req.json();
  const validation = EnrollSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
  }

  const { courseId } = validation.data;
  const user = await currentUser();

  // if Course alredy Enrolled
  const enrollCourses = await db.select().from(enrollCourseTable)
    .where(and(eq(enrollCourseTable.userEmail, user?.primaryEmailAddress.emailAddress),
      eq(enrollCourseTable.cid, courseId)))

  if (enrollCourses?.length == 0) {
    const result = await db.insert(enrollCourseTable)
      .values({
        cid: courseId,
        userEmail: user.primaryEmailAddress?.emailAddress
      }).returning(enrollCourseTable)

    // Award "First Course" achievement if this is their first enrollment
    try {
      const allEnrollments = await db
        .select()
        .from(enrollCourseTable)
        .where(eq(enrollCourseTable.userEmail, user.primaryEmailAddress.emailAddress));

      // If this is their first course, award the achievement
      if (allEnrollments.length === 1) {
        // In a real implementation, we would call the achievement API here
        // For now, we'll just log it
        console.log("User earned 'First Course' achievement");
      }
    } catch (achievementError) {
      console.error("Error checking for first course achievement:", achievementError);
    }

    return NextResponse.json(result);
  }

  return NextResponse.json({ 'resp': 'Alredy Enrolled' })
}

export async function GET(req) {
  const user = await currentUser();
  const { searchParams } = new URL(req.url);
  const courseId = searchParams?.get('courseId');

  if (courseId) {
    const result = await db
      .select()
      .from(coursesTable)
      .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
      .where(and(eq(enrollCourseTable.userEmail, user.primaryEmailAddress.emailAddress),
        eq(enrollCourseTable.cid, courseId)))

    return NextResponse.json(result[0])
  }
  else {

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const result = await db
      .select()
      .from(coursesTable)
      .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
      .where(eq(enrollCourseTable.userEmail, user.primaryEmailAddress.emailAddress))
      .orderBy(desc(enrollCourseTable.id));

    return NextResponse.json(result);
  }
}

export async function PUT(req) {
  const { completedChapter, courseId } = await req.json();
  const user = await currentUser();

  const result = await db.update(enrollCourseTable).set({
    completedChapters: completedChapter
  }).where(and(eq(enrollCourseTable.cid, courseId),
    eq(enrollCourseTable.userEmail, user?.primaryEmailAddress?.emailAddress)))
    .returning(enrollCourseTable)

  return NextResponse.json(result);
}