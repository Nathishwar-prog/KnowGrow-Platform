import { coursesTable, enrollCourseTable, quizzesTable, achievementsTable, usersTable, userActivityTable } from "../../../config/schema";
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

  const courseContent = course.courseContent;
  const totalChapters = Array.isArray(courseContent) ? courseContent.length : (course.noOfChapters || 0);
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

function getActivityDisplayType(actionType) {
  switch (actionType) {
    case 'chapter_complete':
    case 'course_complete':
      return 'success';
    case 'enroll':
    case 'quiz_create':
      return 'info';
    case 'quiz_complete':
      return 'award';
    default:
      return 'info';
  }
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

    let enrolledCourses = [];
    try {
      enrolledCourses = await db
        .select()
        .from(coursesTable)
        .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
        .where(eq(enrollCourseTable.userEmail, userEmail))
        .orderBy(desc(enrollCourseTable.lastActivityAt))
        .limit(50);
    } catch (err) {
      console.error("[Dashboard] Enrolled courses query failed:", err.message);
      enrolledCourses = [];
    }

    let userCourses = [];
    try {
      const { courseContent, ...courseColumns } = getTableColumns(coursesTable);
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

    let recentActivities = [];
    try {
      recentActivities = await db
        .select()
        .from(userActivityTable)
        .where(eq(userActivityTable.userEmail, userEmail))
        .orderBy(desc(userActivityTable.createdAt))
        .limit(10);
    } catch (err) {
      console.error("[Dashboard] Activities query failed:", err.message);
      recentActivities = [];
    }

    let totalChapters = 0;
    let completedChaptersCount = 0;
    let completedCourses = 0;
    let inProgressCourses = 0;

    const perCourseProgress = (enrolledCourses || []).map(enrollment => {
      const course = enrollment?.courses;
      const enroll = enrollment?.enrollCourse;
      
      const { progress, completedChapters, totalChapters: courseTotal } = calculateCourseProgress(
        course,
        enroll
      );

      totalChapters += courseTotal;
      completedChaptersCount += completedChapters;

      if (progress >= 100) {
        completedCourses++;
      } else if (progress > 0) {
        inProgressCourses++;
      }

      return {
        courseId: course?.cid || '',
        courseName: course?.name || 'Untitled Course',
        progress,
        completedChapters,
        totalChapters: courseTotal,
        category: course?.category || '',
        level: course?.level || ''
      };
    });

    const overallPercentage = totalChapters > 0
      ? Math.round((completedChaptersCount / totalChapters) * 100)
      : 0;

    const formattedActivities = recentActivities.map(activity => ({
      id: `activity-${activity.id}`,
      type: getActivityDisplayType(activity.actionType),
      title: activity.title,
      timestamp: activity.createdAt
    }));

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
      recentActivity: formattedActivities,
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
