import { NextResponse } from "next/server";
import { db } from "../../../config/db";
import { usersTable } from "../../../config/schema";
import { eq } from "drizzle-orm";
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

export async function POST(req) {
  const startTime = Date.now();
  
  try {
    const { email, name } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    const existingUsers = await withTimeout(
      db.select({ id: usersTable.id, email: usersTable.email, name: usersTable.name, isOnboarded: usersTable.isOnboarded })
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1),
      2000
    );

    if (existingUsers.length === 0) {
      const result = await withTimeout(
        db.insert(usersTable)
          .values({ 
            name, 
            email,
            age: 0,
            subscriptionId: "free",
            isOnboarded: false
          })
          .returning({ id: usersTable.id, email: usersTable.email, name: usersTable.name, isOnboarded: usersTable.isOnboarded }),
        2000
      );

      return NextResponse.json(result[0]);
    }

    return NextResponse.json(existingUsers[0]);
  } catch (err) {
    const elapsed = Date.now() - startTime;
    console.error(`[API /api/user POST] Error after ${elapsed}ms:`, err.message);
    
    if (err.message === 'TIMEOUT') {
      return NextResponse.json(
        { success: false, error: "Request took too long. Please try again." },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const startTime = Date.now();
  
  try {
    const user = await withTimeout(currentUser(), 2000);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const existingUsers = await withTimeout(
      db.select({ id: usersTable.id, email: usersTable.email, name: usersTable.name, isOnboarded: usersTable.isOnboarded })
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1),
      2000
    );

    if (existingUsers.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(existingUsers[0]);
  } catch (err) {
    const elapsed = Date.now() - startTime;
    console.error(`[API /api/user GET] Error after ${elapsed}ms:`, err.message);
    
    if (err.message === 'TIMEOUT') {
      return NextResponse.json(
        { success: false, error: "Request took too long. Please try again." },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  const startTime = Date.now();
  
  try {
    const user = await withTimeout(currentUser(), 2000);
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

    const result = await withTimeout(
      db.update(usersTable)
        .set({ isOnboarded })
        .where(eq(usersTable.email, email))
        .returning({ id: usersTable.id, isOnboarded: usersTable.isOnboarded }),
      2000
    );

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (err) {
    const elapsed = Date.now() - startTime;
    console.error(`[API /api/user PATCH] Error after ${elapsed}ms:`, err.message);
    
    if (err.message === 'TIMEOUT') {
      return NextResponse.json(
        { success: false, error: "Request took too long. Please try again." },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
