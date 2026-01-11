import { adminTable } from "../../../../config/schema";
import { db } from "../../../../config/db";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

// Check if a user email is an admin
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams?.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, isAdmin: false },
        { status: 200 }
      );
    }

    const admin = await db
      .select()
      .from(adminTable)
      .where(eq(adminTable.email, email));

    return NextResponse.json({
      success: true,
      isAdmin: admin.length > 0
    });

  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json(
      { success: false, isAdmin: false },
      { status: 200 }
    );
  }
}

