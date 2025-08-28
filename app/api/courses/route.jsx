import { coursesTable } from "../../../config/schema";
import { db } from "../../../config/db";
import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

const serialize = (obj) =>
  JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)));

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams?.get("courseId");
  const user = await currentUser();

  // Case 1: special "0" -> return courses with non-empty content
  if (courseId === "0") {
    const result = await db
      .select()
      .from(coursesTable)
      .where(sql`${coursesTable.courseContent}::jsonb != '{}'::jsonb`);

    return NextResponse.json(serialize(result));
  }

  // Case 2: fetch a specific course
  if (courseId) {
    const result = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.cid,courseId)); // ensure numeric match

    return NextResponse.json(serialize(result[0] ?? null));
  }

  // Case 3: fetch all courses for current user
  const result = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.userEmail, user.primaryEmailAddress?.emailAddress))
    .orderBy(desc(coursesTable.id));

  return NextResponse.json(serialize(result));
}
