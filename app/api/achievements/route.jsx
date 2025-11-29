import { NextResponse } from "next/server";
import { db } from "../../../config/db";
import { achievementsTable, usersTable } from "../../../config/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    const user = await currentUser();
    
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }
    
    // Get user ID from email
    const userResult = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, user.primaryEmailAddress.emailAddress));
    
    if (userResult.length === 0) {
      console.log("User not found in database:", user.primaryEmailAddress.emailAddress);
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }
    
    const userId = userResult[0].id;
    
    // Get user achievements
    const achievements = await db
      .select()
      .from(achievementsTable)
      .where(eq(achievementsTable.userId, userId))
      .orderBy(achievementsTable.earnedAt);
    
    return NextResponse.json(achievements);
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { achievementType, achievementName, description, points } = await req.json();
    const user = await currentUser();
    
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }
    
    // Get user ID from email
    const userResult = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, user.primaryEmailAddress.emailAddress));
    
    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const userId = userResult[0].id;
    
    // Check if achievement already exists
    const existingAchievements = await db
      .select()
      .from(achievementsTable)
      .where(eq(achievementsTable.userId, userId))
      .where(eq(achievementsTable.achievementType, achievementType));
    
    if (existingAchievements.length > 0) {
      return NextResponse.json({ message: "Achievement already earned" });
    }
    
    // Create new achievement
    const result = await db
      .insert(achievementsTable)
      .values({
        userId,
        achievementType,
        achievementName,
        description,
        points: points || 0
      })
      .returning();
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error creating achievement:", error);
    return NextResponse.json(
      { error: "Failed to create achievement" },
      { status: 500 }
    );
  }
}