import { NextResponse } from "next/server";
import { db } from "../../../config/db";
import { usersTable } from "../../../config/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { email, name } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    const existingUsers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUsers.length === 0) {
      const result = await db
        .insert(usersTable)
        .values({ 
          name, 
          email,
          age: 0,
          subscriptionId: "free",
          isOnboarded: false
        })
        .returning();

      console.log("User created:", result);
      return NextResponse.json(result[0]);
    }

    console.log("User exists:", existingUsers[0]);
    return NextResponse.json(existingUsers[0]);
  } catch (err) {
    console.error("🔥 Error in /api/user:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const existingUsers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUsers.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(existingUsers[0]);
  } catch (err) {
    console.error("🔥 Error in GET /api/user:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const body = await req.json();
    const { isOnboarded } = body;

    if (typeof isOnboarded !== 'boolean') {
      return NextResponse.json({ error: "Invalid isOnboarded value" }, { status: 400 });
    }

    const result = await db
      .update(usersTable)
      .set({ isOnboarded })
      .where(eq(usersTable.email, email))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (err) {
    console.error("🔥 Error in PATCH /api/user:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
