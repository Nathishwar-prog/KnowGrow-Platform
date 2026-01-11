import { usersTable } from "../../../../config/schema";
import { db } from "../../../../config/db";
import { NextResponse } from "next/server";
import { desc, eq, like, or } from "drizzle-orm";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

const serialize = (obj) =>
  JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)));

// Verify admin token
const verifyAdmin = (req) => {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return { valid: false, error: "No token provided" };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return { valid: false, error: "Unauthorized" };
    }
    return { valid: true, admin: decoded };
  } catch (error) {
    return { valid: false, error: "Invalid token" };
  }
};

// GET - Fetch all users
export async function GET(req) {
  const auth = verifyAdmin(req);
  if (!auth.valid) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams?.get("search");

    let query = db.select().from(usersTable).orderBy(desc(usersTable.id));

    if (search) {
      query = query.where(
        or(
          like(usersTable.name, `%${search}%`),
          like(usersTable.email, `%${search}%`)
        )
      );
    }

    const result = await query;

    return NextResponse.json({
      success: true,
      users: serialize(result),
      count: result.length
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(req) {
  const auth = verifyAdmin(req);
  if (!auth.valid) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: 401 }
    );
  }

  try {
    const { name, email, age, subscriptionId } = await req.json();

    if (!name || !email || !age) {
      return NextResponse.json(
        { success: false, error: "Name, email, and age are required" },
        { status: 400 }
      );
    }

    const result = await db.insert(usersTable).values({
      name,
      email,
      age,
      subscriptionId: subscriptionId || null
    }).returning();

    return NextResponse.json({
      success: true,
      user: serialize(result[0]),
      message: "User created successfully"
    });

  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// PUT - Update user
export async function PUT(req) {
  const auth = verifyAdmin(req);
  if (!auth.valid) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: 401 }
    );
  }

  try {
    const { id, name, email, age, subscriptionId } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (age) updateData.age = age;
    if (subscriptionId !== undefined) updateData.subscriptionId = subscriptionId;

    const result = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: serialize(result[0]),
      message: "User updated successfully"
    });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(req) {
  const auth = verifyAdmin(req);
  if (!auth.valid) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams?.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await db
      .delete(usersTable)
      .where(eq(usersTable.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

