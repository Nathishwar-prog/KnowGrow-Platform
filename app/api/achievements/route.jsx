import { NextResponse } from "next/server";
import { db } from "../../../config/db";
import { achievementsTable, usersTable } from "../../../config/schema";
import { eq, and, desc } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

const API_TIMEOUT_MS = 5000;

async function withTimeout(promise, timeoutMs = API_TIMEOUT_MS) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs);
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
    const user = await withTimeout(currentUser(), 2000);
    
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }
    
    const userResult = await withTimeout(
      db.select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, user.primaryEmailAddress.emailAddress))
        .limit(1),
      2000
    );
    
    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }
    
    const userId = userResult[0].id;
    
    const achievements = await withTimeout(
      db.select({
        id: achievementsTable.id,
        achievementType: achievementsTable.achievementType,
        achievementName: achievementsTable.achievementName,
        description: achievementsTable.description,
        points: achievementsTable.points,
        earnedAt: achievementsTable.earnedAt
      })
      .from(achievementsTable)
      .where(eq(achievementsTable.userId, userId))
      .orderBy(desc(achievementsTable.earnedAt))
      .limit(20),
      3000
    );
    
    return NextResponse.json(achievements);
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[API /api/achievements GET] Error after ${elapsed}ms:`, error.message);
    
    if (error.message === 'TIMEOUT') {
      return NextResponse.json(
        { success: false, error: "Request took too long. Please try again." },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const startTime = Date.now();
  
  try {
    const { achievementType, achievementName, description, points } = await req.json();
    const user = await withTimeout(currentUser(), 2000);
    
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }
    
    const userResult = await withTimeout(
      db.select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, user.primaryEmailAddress.emailAddress))
        .limit(1),
      2000
    );
    
    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const userId = userResult[0].id;
    
    const existingAchievements = await withTimeout(
      db.select({ id: achievementsTable.id })
        .from(achievementsTable)
        .where(and(
          eq(achievementsTable.userId, userId),
          eq(achievementsTable.achievementType, achievementType)
        ))
        .limit(1),
      2000
    );
    
    if (existingAchievements.length > 0) {
      return NextResponse.json({ message: "Achievement already earned" });
    }
    
    const result = await withTimeout(
      db.insert(achievementsTable)
        .values({
          userId,
          achievementType,
          achievementName,
          description,
          points: points || 0
        })
        .returning({ id: achievementsTable.id, achievementName: achievementsTable.achievementName }),
      2000
    );
    
    return NextResponse.json(result[0]);
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[API /api/achievements POST] Error after ${elapsed}ms:`, error.message);
    
    if (error.message === 'TIMEOUT') {
      return NextResponse.json(
        { success: false, error: "Request took too long. Please try again." },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create achievement" },
      { status: 500 }
    );
  }
}