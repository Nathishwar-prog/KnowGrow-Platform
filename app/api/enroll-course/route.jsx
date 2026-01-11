import { coursesTable, enrollCourseTable, userActivityTable } from "../../../config/schema";
import { db } from "../../../config/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { apiResponse, successResponse, errorResponse, serialize, safeParseJson } from "../../../lib/api-utils";
import { CourseSchema, EnrollmentSchema } from "../../../lib/schemas";

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
      return errorResponse("Invalid course ID", 400);
    }

    const { courseId } = validation.data;
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return errorResponse("User not authenticated", 401);
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
      return successResponse({ resp: "Already Enrolled" });
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
        lastActivityAt: new Date(),
        completedChapters: []
      })
      .returning({ id: enrollCourseTable.id, cid: enrollCourseTable.cid });

    await logActivity(
      userEmail,
      'enroll',
      `Enrolled in ${courseName}`,
      courseId,
      'course'
    );

    return successResponse(result);
  } catch (error) {
    console.error("[API /enroll-course POST] Error:", error);
    return errorResponse("Failed to enroll in course.", 500);
  }
}

export async function GET(req) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams?.get("courseId");

    if (!user?.primaryEmailAddress?.emailAddress) {
      return errorResponse("User not authenticated", 401);
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    if (courseId) {
      // Fetch course and enrollment together
      const result = await db
        .select()
        .from(coursesTable)
        .leftJoin(enrollCourseTable, and(
          eq(coursesTable.cid, enrollCourseTable.cid),
          eq(enrollCourseTable.userEmail, userEmail)
        ))
        .where(eq(coursesTable.cid, courseId))
        .limit(1);

      if (result.length === 0) {
        return errorResponse("Course not found", 404);
      }

      const row = result[0];
      
      // Defensive parsing and validation
      const courseData = {
        ...row.courses,
        courseJson: safeParseJson(row.courses.courseJson),
        courseContent: safeParseJson(row.courses.courseContent),
      };

      const enrollmentData = row.enrollCourse ? {
        ...row.enrollCourse,
        completedChapters: safeParseJson(row.enrollCourse.completedChapters, []),
      } : null;

      // Validate against schemas
      const validatedCourse = CourseSchema.safeParse(courseData);
      if (!validatedCourse.success) {
        console.error("[Validation Error] Course data invalid:", validatedCourse.error.format());
      }

      return successResponse(serialize({
        courses: courseData,
        enrollCourse: enrollmentData
      }));
    }

    // List all enrollments
    const enrollments = await db
      .select({
        courses: getTableColumns(coursesTable),
        enrollCourse: getTableColumns(enrollCourseTable),
      })
      .from(coursesTable)
      .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
      .where(eq(enrollCourseTable.userEmail, userEmail))
      .orderBy(desc(enrollCourseTable.id))
      .limit(50);

    const serializedEnrollments = enrollments.map(row => ({
      courses: {
        ...row.courses,
        courseJson: safeParseJson(row.courses.courseJson),
        courseContent: safeParseJson(row.courses.courseContent),
      },
      enrollCourse: {
        ...row.enrollCourse,
        completedChapters: safeParseJson(row.enrollCourse.completedChapters, []),
      }
    }));

    return successResponse(serialize(serializedEnrollments));
  } catch (error) {
    console.error("[API /enroll-course GET] Error:", error);
    return errorResponse("Failed to fetch enrolled courses.", 500);
  }
}

export async function PUT(req) {
  try {
    const { completedChapter, courseId, chapterName } = await req.json();
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return errorResponse("User not authenticated", 401);
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

    if (existingEnroll.length === 0) {
      return errorResponse("Enrollment not found", 404);
    }

    const currentChapters = safeParseJson(existingEnroll[0].completedChapters, []);
    const previousCount = Array.isArray(currentChapters) ? currentChapters.length : 0;
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

    return successResponse(serialize(result));
  } catch (error) {
    console.error("[API /enroll-course PUT] Error:", error);
    return errorResponse("Failed to update progress.", 500);
  }
}
