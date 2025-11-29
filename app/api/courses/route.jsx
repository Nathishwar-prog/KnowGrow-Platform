import { coursesTable } from "../../../config/schema";
import { db } from "../../../config/db";
import { NextResponse } from "next/server";
import { desc, eq, sql, and, getTableColumns } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

const serialize = (obj) => {
  // Simple check to avoid expensive serialization if not needed
  // If we know IDs are standard integers, we might skip this, but keeping it safe.
  // We can optimize by not cloning if no BigInts are expected, but for now, 
  // the main fix is reducing the data size via query.
  return JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)));
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams?.get("courseId");
  const searchQuery = searchParams?.get("search");
  const user = await currentUser();

  // Get all columns except courseContent to reduce payload size
  const { courseContent, ...courseColumns } = getTableColumns(coursesTable);

  // Case 1: special "0" -> return courses with non-empty content (Search/Explore)
  if (courseId === "0") {
    let query = db
      .select({
        ...courseColumns,
        hasContent: sql`CASE WHEN ${coursesTable.courseContent}::jsonb != '{}'::jsonb THEN true ELSE false END`
      })
      .from(coursesTable)
      .where(sql`${coursesTable.courseContent}::jsonb != '{}'::jsonb`);

    // Add enhanced search functionality if search query is provided
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
    return NextResponse.json(serialize(result));
  }

  // Case 2: fetch a specific course (Needs full content)
  if (courseId) {
    const result = await db
      .select({
        ...getTableColumns(coursesTable),
        hasContent: sql`CASE WHEN ${coursesTable.courseContent}::jsonb != '{}'::jsonb THEN true ELSE false END`
      })
      .from(coursesTable)
      .where(eq(coursesTable.cid, courseId));

    return NextResponse.json(serialize(result[0] ?? null));
  }

  // Case 3: fetch all courses for current user (Dashboard)
  const result = await db
    .select({
      ...courseColumns,
      hasContent: sql`CASE WHEN ${coursesTable.courseContent}::jsonb != '{}'::jsonb THEN true ELSE false END`
    })
    .from(coursesTable)
    .where(eq(coursesTable.userEmail, user.primaryEmailAddress?.emailAddress))
    .orderBy(desc(coursesTable.id));

  return NextResponse.json(serialize(result));
}
