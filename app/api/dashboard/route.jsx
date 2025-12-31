import { coursesTable, enrollCourseTable, quizzesTable, achievementsTable, usersTable } from "../../../config/schema";
import { db } from "../../../config/db";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq, sql, getTableColumns } from "drizzle-orm";
import { NextResponse } from "next/server";

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

function createEmptyDashboard(userEmail) {
  return {
    courses: {
      enrolled: [],
      created: [],
      totalEnrolled: 0,
      totalCreated: 0
    },
    progress: {
      overallPercentage: 0,
      totalChapters: 0,
      completedChapters: 0,
      completedCourses: 0,
      inProgressCourses: 0,
      totalCourses: 0,
      perCourse: []
    },
    quizzes: {
      list: [],
      totalCount: 0
    },
    achievements: [],
    recentActivity: [],
    user: {
      email: userEmail || "",
      isOnboarded: false
    },
    focusState: {}
  };
}

export async function GET(req) {
  let userEmail = "";
  
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { success: false, error: "User not authenticated", data: createEmptyDashboard("") },
        { status: 401 }
      );
    }

    userEmail = user.primaryEmailAddress.emailAddress;
    const { courseContent, ...courseColumns } = getTableColumns(coursesTable);

    let enrolledCourses = [];
    try {
      enrolledCourses = await db
        .select({
          courses: courseColumns,
          enrollCourse: enrollCourseTable,
        })
        .from(coursesTable)
        .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
        .where(eq(enrollCourseTable.userEmail, userEmail))
        .orderBy(desc(enrollCourseTable.id))
        .limit(50);
    } catch (err) {
      console.error("[Dashboard] Enrolled courses query failed:", err.message);
      enrolledCourses = [];
    }

    let userCourses = [];
    try {
      userCourses = await db
        .select({
          ...courseColumns,
          hasContent: sql`CASE WHEN ${coursesTable.courseContent}::jsonb != '{}'::jsonb THEN true ELSE false END`
        })
        .from(coursesTable)
        .where(eq(coursesTable.userEmail, userEmail))
        .orderBy(desc(coursesTable.id))
        .limit(100);
    } catch (err) {
      console.error("[Dashboard] User courses query failed:", err.message);
      userCourses = [];
    }

    let userDbResult = [];
    try {
      userDbResult = await db
        .select({ id: usersTable.id, isOnboarded: usersTable.isOnboarded })
        .from(usersTable)
        .where(eq(usersTable.email, userEmail))
        .limit(1);
    } catch (err) {
      console.error("[Dashboard] User query failed:", err.message);
      userDbResult = [];
    }

    let quizzes = [];
    try {
      quizzes = await db
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
        .limit(20);
    } catch (err) {
      console.error("[Dashboard] Quizzes query failed:", err.message);
      quizzes = [];
    }

    let achievements = [];
    if (userDbResult.length > 0) {
      try {
        const userId = userDbResult[0].id;
        achievements = await db
          .select()
          .from(achievementsTable)
          .where(eq(achievementsTable.userId, userId))
          .orderBy(desc(achievementsTable.earnedAt))
          .limit(20);
      } catch (err) {
        console.error("[Dashboard] Achievements query failed:", err.message);
        achievements = [];
      }
    }

    let totalChapters = 0;
    let completedChaptersCount = 0;
    let completedCourses = 0;
    let inProgressCourses = 0;

    const perCourseProgress = (enrolledCourses || []).map(enrollment => {
      const { progress, completedChapters, totalChapters: courseTotal } = calculateCourseProgress(
        enrollment?.courses,
        enrollment?.enrollCourse
      );

      totalChapters += courseTotal;
      completedChaptersCount += completedChapters;

      if (progress >= 100) {
        completedCourses++;
      } else if (progress > 0) {
        inProgressCourses++;
      }

      return {
        courseId: enrollment?.courses?.cid || '',
        courseName: enrollment?.courses?.name || 'Untitled Course',
        progress,
        completedChapters,
        totalChapters: courseTotal,
        category: enrollment?.courses?.category || '',
        level: enrollment?.courses?.level || ''
      };
    });

    const overallPercentage = totalChapters > 0
      ? Math.round((completedChaptersCount / totalChapters) * 100)
      : 0;

    const recentActivity = [];

    const recentEnrollments = (enrolledCourses || []).slice(0, 3);
    recentEnrollments.forEach(enrollment => {
      if (enrollment?.courses?.name) {
        recentActivity.push({
          id: `enroll-${enrollment?.enrollCourse?.id || Date.now()}`,
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

    (achievements || []).slice(0, 3).forEach(achievement => {
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
        enrolled: enrolledCourses || [],
        created: userCourses || [],
        totalEnrolled: (enrolledCourses || []).length,
        totalCreated: (userCourses || []).length
      },
      progress: {
        overallPercentage,
        totalChapters,
        completedChapters: completedChaptersCount,
        completedCourses,
        inProgressCourses,
        totalCourses: (enrolledCourses || []).length,
        perCourse: perCourseProgress
      },
      quizzes: {
        list: quizzes || [],
        totalCount: (quizzes || []).length
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
    console.error("[API /dashboard] Critical error:", error);
    return NextResponse.json({
      success: true,
      data: createEmptyDashboard(userEmail),
      timestamp: Date.now(),
      partial: true
    });
  }
}
