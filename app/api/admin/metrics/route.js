import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../@/lib/admin";
import { db } from "../../../../config/db";
import { usersTable, coursesTable, quizzesTable, enrollCourseTable } from "../../../../config/schema";
import { sql, count } from "drizzle-orm";

export async function GET() {
  try {
    await requireAdmin();
    
    const [usersCount] = await db.select({ count: count() }).from(usersTable);
    const [coursesCount] = await db.select({ count: count() }).from(coursesTable);
    const [quizzesCount] = await db.select({ count: count() }).from(quizzesTable);
    const [enrollmentsCount] = await db.select({ count: count() }).from(enrollCourseTable);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentEnrollments = await db
      .select({ count: count() })
      .from(enrollCourseTable);
    
    return NextResponse.json({
      success: true,
      metrics: {
        totalUsers: usersCount?.count || 0,
        totalCourses: coursesCount?.count || 0,
        totalQuizzes: quizzesCount?.count || 0,
        totalEnrollments: enrollmentsCount?.count || 0,
        activeUsers: Math.min(usersCount?.count || 0, recentEnrollments[0]?.count || 0)
      }
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Failed to fetch metrics" }, { status: 500 });
  }
}
