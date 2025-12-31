import { coursesTable } from "../../../config/schema";
import { db } from "../../../config/db";
import { NextResponse } from "next/server";
import { desc, eq, sql, and, getTableColumns } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

const serialize = (obj) => {
  return JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)));
};

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
      return NextResponse.json(serialize(result));
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

      return NextResponse.json(serialize(result[0] ?? null));
    }

    const result = await db
      .select({
        ...courseColumns,
        hasContent: sql`CASE WHEN ${coursesTable.courseContent}::jsonb != '{}'::jsonb THEN true ELSE false END`
      })
      .from(coursesTable)
      .where(eq(coursesTable.userEmail, user.primaryEmailAddress?.emailAddress))
      .orderBy(desc(coursesTable.id))
      .limit(100);

    return NextResponse.json(serialize(result));
  } catch (error) {
    console.error("[API /courses] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch courses." },
      { status: 500 }
    );
  }
}
