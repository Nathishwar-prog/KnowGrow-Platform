import { userActivityTable } from "../../../config/schema";
import { db } from "../../../config/db";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const ActivitySchema = z.object({
  actionType: z.enum(['enroll', 'chapter_complete', 'quiz_complete', 'course_complete', 'quiz_create']),
  title: z.string().min(1).max(500),
  entityId: z.string().optional(),
  entityType: z.enum(['course', 'chapter', 'quiz']).optional(),
  metadata: z.object({}).passthrough().optional()
});

export async function POST(req) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const validation = ActivitySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid activity data" }, { status: 400 });
    }

    const { actionType, title, entityId, entityType, metadata } = validation.data;
    const userEmail = user.primaryEmailAddress.emailAddress;

    const result = await db.insert(userActivityTable).values({
      userEmail,
      actionType,
      title,
      entityId: entityId || null,
      entityType: entityType || null,
      metadata: metadata || null
    }).returning({ id: userActivityTable.id });

    return NextResponse.json({ success: true, activityId: result[0]?.id });
  } catch (error) {
    console.error("[API /activity POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log activity." },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress.emailAddress;
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);

    const activities = await db
      .select()
      .from(userActivityTable)
      .where(eq(userActivityTable.userEmail, userEmail))
      .orderBy(desc(userActivityTable.createdAt))
      .limit(limit);

    const formattedActivities = activities.map(activity => ({
      id: `activity-${activity.id}`,
      type: getActivityDisplayType(activity.actionType),
      title: activity.title,
      timestamp: activity.createdAt,
      actionType: activity.actionType,
      entityId: activity.entityId,
      entityType: activity.entityType
    }));

    return NextResponse.json({ success: true, activities: formattedActivities });
  } catch (error) {
    console.error("[API /activity GET] Error:", error);
    return NextResponse.json(
      { success: false, activities: [] },
      { status: 500 }
    );
  }
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
