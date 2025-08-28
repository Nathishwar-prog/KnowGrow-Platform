import { NextResponse } from "next/server";
import { db } from "/config/db";                // make sure these imports exist
import { usersTable } from "/config/schema";   // adjust to your schema location
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { email, name } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    // check if user exists
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
          age: 0,                   // ✅ added default
          subscriptionId: "free"    // ✅ added default
        })
        .returning(); // ✅ typo fixed here

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
