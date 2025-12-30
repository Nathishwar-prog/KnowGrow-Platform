import { usersTable, coursesTable, enrollCourseTable, quizzesTable } from "../../../../config/schema";
import { db } from "../../../../config/db";
import { NextResponse } from "next/server";
import { desc, eq, like, or, sql, count } from "drizzle-orm";
import { requireAdmin } from "../../../../@/lib/admin";

const serialize = (obj) =>
  JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)));

export async function GET(req) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const search = searchParams?.get("search");

    let query = db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        age: usersTable.age,
        subscriptionId: usersTable.subscriptionId,
        isOnboarded: usersTable.isOnboarded
      })
      .from(usersTable)
      .orderBy(desc(usersTable.id));

    if (search) {
      query = query.where(
        or(
          like(usersTable.name, `%${search}%`),
          like(usersTable.email, `%${search}%`)
        )
      );
    }

    const users = await query;
    
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [coursesCreated] = await db
          .select({ count: count() })
          .from(coursesTable)
          .where(eq(coursesTable.userEmail, user.email));
        
        const [enrollments] = await db
          .select({ count: count() })
          .from(enrollCourseTable)
          .where(eq(enrollCourseTable.userEmail, user.email));
        
        const [quizzes] = await db
          .select({ count: count() })
          .from(quizzesTable)
          .where(eq(quizzesTable.userEmail, user.email));

        return {
          ...user,
          coursesCreated: coursesCreated?.count || 0,
          enrolledCourses: enrollments?.count || 0,
          quizzesCreated: quizzes?.count || 0
        };
      })
    );

    return NextResponse.json({
      success: true,
      users: serialize(usersWithStats),
      count: usersWithStats.length
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await requireAdmin();

    const { id, name, email, age, subscriptionId } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
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
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: serialize(result[0]),
      message: "User updated successfully"
    });

  } catch (error) {
    console.error("Error updating user:", error);
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const id = searchParams?.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const user = await db.select().from(usersTable).where(eq(usersTable.id, parseInt(id)));
    if (user.length === 0) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const userEmail = user[0].email;

    await db.delete(enrollCourseTable).where(eq(enrollCourseTable.userEmail, userEmail));
    await db.delete(quizzesTable).where(eq(quizzesTable.userEmail, userEmail));
    
    const coursesToDelete = await db.select({ cid: coursesTable.cid }).from(coursesTable).where(eq(coursesTable.userEmail, userEmail));
    for (const course of coursesToDelete) {
      await db.delete(enrollCourseTable).where(eq(enrollCourseTable.cid, course.cid));
    }
    await db.delete(coursesTable).where(eq(coursesTable.userEmail, userEmail));

    const result = await db
      .delete(usersTable)
      .where(eq(usersTable.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      success: true,
      message: "User and related data deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting user:", error);
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 });
  }
}
