import { coursesTable } from "../../../config/schema";
import { db } from "../../../config/db";
import { desc, eq, sql, and, getTableColumns } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { apiResponse, successResponse, errorResponse, serialize, safeParseJson } from "../../../lib/api-utils";
import { CourseSchema } from "../../../lib/schemas";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams?.get("courseId");
    const searchQuery = searchParams?.get("search");
    const user = await currentUser();

    const { courseContent, ...courseColumns } = getTableColumns(coursesTable);

    if (courseId === "0") {
      let query = db
        .select({
          ...courseColumns,
          hasContent: sql`CASE WHEN ${coursesTable.courseContent}::jsonb != '{}'::jsonb THEN true ELSE false END`
        })
        .from(coursesTable)
        .where(sql`${coursesTable.courseContent}::jsonb != '{}'::jsonb`)
        .limit(50);

      if (searchQuery && searchQuery.trim() !== "") {
        const terms = searchQuery.trim().split(/\s+/).filter(t => t.length > 0);
        if (terms.length > 0) {
          const searchConditions = terms.map(term => {
            const pattern = `%${term}%`;
            return sql`(
              ${coursesTable.name} ILIKE ${pattern} OR
              ${coursesTable.description} ILIKE ${pattern} OR
              ${coursesTable.category} ILIKE ${pattern}
            )`;
          });
          query = query.where(and(...searchConditions));
        }
      }

      const result = await query;
      const parsedResult = result.map(row => ({
        ...row,
        courseJson: safeParseJson(row.courseJson)
      }));
      
      return successResponse(serialize(parsedResult));
    }

    if (courseId) {
      const result = await db
        .select({
          ...getTableColumns(coursesTable),
          hasContent: sql`CASE WHEN ${coursesTable.courseContent}::jsonb != '{}'::jsonb THEN true ELSE false END`
        })
        .from(coursesTable)
        .where(eq(coursesTable.cid, courseId))
        .limit(1);

      if (result.length === 0) {
        return errorResponse("Course not found", 404);
      }

      const row = result[0];
      const courseData = {
        ...row,
        courseJson: safeParseJson(row.courseJson),
        courseContent: safeParseJson(row.courseContent),
      };

      // Validate
      const validation = CourseSchema.safeParse(courseData);
      if (!validation.success) {
        console.warn("[Validation Warning] Course data schema mismatch:", validation.error.format());
      }

      return successResponse(serialize(courseData));
    }

    if (!user?.primaryEmailAddress?.emailAddress) {
      return errorResponse("User not authenticated", 401);
    }

    const result = await db
      .select({
        ...courseColumns,
        hasContent: sql`CASE WHEN ${coursesTable.courseContent}::jsonb != '{}'::jsonb THEN true ELSE false END`
      })
      .from(coursesTable)
      .where(eq(coursesTable.userEmail, user.primaryEmailAddress.emailAddress))
      .orderBy(desc(coursesTable.id))
      .limit(100);

    const parsedResult = result.map(row => ({
      ...row,
      courseJson: safeParseJson(row.courseJson)
    }));

    return successResponse(serialize(parsedResult));
  } catch (error) {
    console.error("[API /courses GET] Error:", error);
    return errorResponse("Failed to fetch courses.", 500);
  }
}
