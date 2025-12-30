import { coursesTable } from "../../../config/schema";
import { db } from "../../../config/db";
import { NextResponse } from "next/server";
import { desc, eq, sql, and, getTableColumns } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

const API_TIMEOUT_MS = 8000;

const serialize = (obj) => {
  return JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)));
};

async function withTimeout(promise, timeoutMs = API_TIMEOUT_MS) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('TIMEOUT'));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function GET(req) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams?.get("courseId");
    const searchQuery = searchParams?.get("search");
    const page = parseInt(searchParams?.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams?.get("limit") || "20", 10), 50);
    const offset = (page - 1) * limit;

    const user = await withTimeout(currentUser(), 3000);

    const { courseContent, courseJson, ...lightColumns } = getTableColumns(coursesTable);

    if (courseId === "0") {
      let baseConditions = [sql`${coursesTable.courseContent}::jsonb != '{}'::jsonb`];

      if (searchQuery && searchQuery.trim() !== "") {
        const terms = searchQuery.trim().split(/\s+/).filter(t => t.length > 0).slice(0, 5);
        
        if (terms.length > 0) {
          terms.forEach(term => {
            const pattern = `%${term}%`;
            baseConditions.push(
              sql`(${coursesTable.name} ILIKE ${pattern} OR ${coursesTable.description} ILIKE ${pattern} OR ${coursesTable.category} ILIKE ${pattern})`
            );
          });
        }
      }

      const result = await withTimeout(
        db.select({
          ...lightColumns,
          hasContent: sql`true`
        })
        .from(coursesTable)
        .where(and(...baseConditions))
        .limit(limit)
        .offset(offset),
        5000
      );

      return NextResponse.json(serialize(result));
    }

    if (courseId) {
      const result = await withTimeout(
        db.select({
          ...getTableColumns(coursesTable),
          hasContent: sql`CASE WHEN ${coursesTable.courseContent}::jsonb != '{}'::jsonb THEN true ELSE false END`
        })
        .from(coursesTable)
        .where(eq(coursesTable.cid, courseId))
        .limit(1),
        5000
      );

      return NextResponse.json(serialize(result[0] ?? null));
    }

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    const result = await withTimeout(
      db.select({
        ...lightColumns,
        hasContent: sql`CASE WHEN ${coursesTable.courseContent}::jsonb != '{}'::jsonb THEN true ELSE false END`
      })
      .from(coursesTable)
      .where(eq(coursesTable.userEmail, user.primaryEmailAddress.emailAddress))
      .orderBy(desc(coursesTable.id))
      .limit(limit),
      5000
    );

    const elapsed = Date.now() - startTime;
    if (elapsed > 3000) {
      console.warn(`[API /api/courses] Slow response: ${elapsed}ms`);
    }

    return NextResponse.json(serialize(result));

  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[API /api/courses] Error after ${elapsed}ms:`, error.message);

    if (error.message === 'TIMEOUT') {
      return NextResponse.json(
        { success: false, error: "Request took too long. Please try again." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to fetch courses. Please try again." },
      { status: 500 }
    );
  }
}
