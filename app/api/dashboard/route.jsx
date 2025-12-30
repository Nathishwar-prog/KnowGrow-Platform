import { coursesTable, enrollCourseTable, quizzesTable, achievementsTable, usersTable } from "../../../config/schema";
import { db } from "../../../config/db";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq, sql, getTableColumns } from "drizzle-orm";
import { NextResponse } from "next/server";

const API_TIMEOUT_MS = 10000;

function withTimeout(promise, ms = API_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT")), ms)
    ),
  ]);
}

const serialize = (obj) => {
  return JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)));
};

function calculateCourseProgress(course, enrollData) {
  if (!course || !enrollData) {
    return { progress: 0, completedChapters: 0, totalChapters: 0 };
  }

  const totalChapters = course.noOfChapters || 0;
  const completedChapters = Array.isArray(enrollData.completedChapters) 
    ? enrollData.completedChapters.length 
    : 0;

  const progress = totalChapters > 0
    ? Math.min(100, Math.round((completedChapters / totalChapters) * 100))
    : 0;

  return { progress, completedChapters, totalChapters };
}

export async function GET(req) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    const userEmail = user.primaryEmailAddress.emailAddress;

    const { courseContent, ...courseColumns } = getTableColumns(coursesTable);

    const [enrolledCoursesResult, userCoursesResult, quizzesResult, userDbResult] = await withTimeout(
      Promise.all([
        db
          .select({
            courses: courseColumns,
            enrollCourse: enrollCourseTable,
          })
          .from(coursesTable)
          .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
          .where(eq(enrollCourseTable.userEmail, userEmail))
          .orderBy(desc(enrollCourseTable.id))
          .limit(50),

        db
          .select({
            ...courseColumns,
            hasContent: sql`CASE WHEN ${coursesTable.courseContent}::jsonb != '{}'::jsonb THEN true ELSE false END`
          })
          .from(coursesTable)
          .where(eq(coursesTable.userEmail, userEmail))
          .orderBy(desc(coursesTable.id))
          .limit(100),

        db
          .select({
            id: quizzesTable.id,
            quizId: quizzesTable.quizId,
            title: quizzesTable.title,
            topic: quizzesTable.topic,
            difficulty: quizzesTable.difficulty,
            questionCount: quizzesTable.questionCount,
            createdAt: quizzesTable.createdAt
          })
          .from(quizzesTable)
          .where(eq(quizzesTable.userEmail, userEmail))
          .orderBy(desc(quizzesTable.createdAt))
          .limit(20),

        db
          .select({ id: usersTable.id, isOnboarded: usersTable.isOnboarded })
          .from(usersTable)
          .where(eq(usersTable.email, userEmail))
          .limit(1)
      ])
    );

    let achievements = [];
    if (userDbResult.length > 0) {
      const userId = userDbResult[0].id;
      achievements = await db
        .select()
        .from(achievementsTable)
        .where(eq(achievementsTable.userId, userId))
        .orderBy(desc(achievementsTable.earnedAt))
        .limit(20);
    }

    const enrolledCourses = enrolledCoursesResult || [];
    const userCourses = userCoursesResult || [];
    const quizzes = quizzesResult || [];

    let totalChapters = 0;
    let completedChaptersCount = 0;
    let completedCourses = 0;
    let inProgressCourses = 0;

    const perCourseProgress = enrolledCourses.map(enrollment => {
      const { progress, completedChapters, totalChapters: courseTotal } = calculateCourseProgress(
        enrollment.courses,
        enrollment.enrollCourse
      );

      totalChapters += courseTotal;
      completedChaptersCount += completedChapters;

      if (progress >= 100) {
        completedCourses++;
      } else if (progress > 0) {
        inProgressCourses++;
      }

      return {
        courseId: enrollment.courses?.cid || '',
        courseName: enrollment.courses?.name || 'Untitled Course',
        progress,
        completedChapters,
        totalChapters: courseTotal,
        category: enrollment.courses?.category || '',
        level: enrollment.courses?.level || ''
      };
    });

    const overallPercentage = totalChapters > 0
      ? Math.round((completedChaptersCount / totalChapters) * 100)
      : 0;

    const recentActivity = [];

    const recentEnrollments = enrolledCourses.slice(0, 3);
    recentEnrollments.forEach(enrollment => {
      if (enrollment.courses?.name) {
        recentActivity.push({
          id: `enroll-${enrollment.enrollCourse?.id || Date.now()}`,
          type: 'info',
          title: `Enrolled in ${enrollment.courses.name}`,
          timestamp: new Date().toISOString()
        });
      }
    });

    perCourseProgress.forEach(course => {
      if (course.progress >= 100) {
        recentActivity.push({
          id: `complete-${course.courseId}`,
          type: 'success',
          title: `Completed ${course.courseName}`,
          timestamp: new Date().toISOString()
        });
      } else if (course.completedChapters > 0) {
        recentActivity.push({
          id: `progress-${course.courseId}`,
          type: 'info',
          title: `${course.completedChapters}/${course.totalChapters} chapters in ${course.courseName}`,
          timestamp: new Date().toISOString()
        });
      }
    });

    achievements.slice(0, 3).forEach(achievement => {
      recentActivity.push({
        id: `achievement-${achievement.id}`,
        type: 'award',
        title: `Earned: ${achievement.achievementName}`,
        timestamp: achievement.earnedAt || new Date().toISOString()
      });
    });

    recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const limitedActivity = recentActivity.slice(0, 10);

    const dashboardData = {
      courses: {
        enrolled: enrolledCourses,
        created: userCourses,
        totalEnrolled: enrolledCourses.length,
        totalCreated: userCourses.length
      },
      progress: {
        overallPercentage,
        totalChapters,
        completedChapters: completedChaptersCount,
        completedCourses,
        inProgressCourses,
        totalCourses: enrolledCourses.length,
        perCourse: perCourseProgress
      },
      quizzes: {
        list: quizzes,
        totalCount: quizzes.length
      },
      achievements: achievements || [],
      recentActivity: limitedActivity,
      user: {
        email: userEmail,
        isOnboarded: userDbResult[0]?.isOnboarded ?? false
      },
      focusState: {}
    };

    return NextResponse.json({
      success: true,
      data: serialize(dashboardData),
      timestamp: Date.now()
    });
  } catch (error) {
    if (error.message === "TIMEOUT") {
      return NextResponse.json(
        { success: false, error: "Request took too long. Please retry.", data: null },
        { status: 504 }
      );
    }
    console.error("[API /dashboard] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data.", data: null },
      { status: 500 }
    );
  }
}
