import { adminTable } from "../../../../config/schema";
import { db } from "../../../../config/db";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

// 🔹 INITIAL ADMIN LOGIC — define your default admin credentials
const INITIAL_ADMIN = {
  email: "nathishwarc@gmail.com",        // ← replace with your admin email
  password: "@Alive_8788_POOVIZHI",    // ← replace with your chosen password
  name: "Super Admin",
  role: "superadmin",
};

const serialize = (obj) =>
  JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v)));

export async function POST(req) {
  try {
    const body = await req.json(); 
    const { email, password, action, token, name } = body;

    // --------------------------------------------
    // 🔹 AUTO-CREATE INITIAL ADMIN IF NOT EXISTS
    // --------------------------------------------
    if (email === INITIAL_ADMIN.email) {
      const existing = await db
        .select()
        .from(adminTable)
        .where(eq(adminTable.email, INITIAL_ADMIN.email));

      if (existing.length === 0) {
        const hashedPassword = await bcrypt.hash(INITIAL_ADMIN.password, 10);
        await db.insert(adminTable).values({
          email: INITIAL_ADMIN.email,
          password: hashedPassword,
          name: INITIAL_ADMIN.name,
          role: INITIAL_ADMIN.role,
          createdAt: new Date().toISOString(),
        });
        console.log("✅ Initial admin created:", INITIAL_ADMIN.email);
      }
    }

    // --------------------------------------------
    // LOGIN LOGIC (same as before)
    // --------------------------------------------
    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: "Email and password are required" },
          { status: 400 }
        );
      }

      const admin = await db
        .select()
        .from(adminTable)
        .where(eq(adminTable.email, email));

      if (admin.length === 0) {
        return NextResponse.json(
          { success: false, error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const isValidPassword = await bcrypt.compare(password, admin[0].password);

      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: "Invalid credentials" },
          { status: 401 }
        );
      }

      await db
        .update(adminTable)
        .set({ lastLogin: new Date().toISOString() })
        .where(eq(adminTable.email, email));

      const token = jwt.sign(
        {
          id: admin[0].id,
          email: admin[0].email,
          role: admin[0].role,
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      const { password: _, ...adminData } = admin[0];

      return NextResponse.json({
        success: true,
        token,
        admin: serialize(adminData),
        message: "Login successful",
      });
    }

    // --------------------------------------------
    // VERIFY TOKEN LOGIC
    // --------------------------------------------
    if (action === "verify") {

      if (!token) {
        return NextResponse.json(
          { success: false, error: "Token is required" },
          { status: 400 }
        );
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const admin = await db
          .select()
          .from(adminTable)
          .where(eq(adminTable.id, decoded.id));

        if (admin.length === 0) {
          return NextResponse.json(
            { success: false, error: "Admin not found" },
            { status: 404 }
          );
        }

        const { password: _, ...adminData } = admin[0];
        return NextResponse.json({
          success: true,
          admin: serialize(adminData),
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, error: "Invalid or expired token" },
          { status: 401 }
        );
      }
    }

    // --------------------------------------------
    // CREATE ADMIN (manual creation route)
    // --------------------------------------------
    if (action === "create") {
      const { name } = await req.json();

      if (!email || !password || !name) {
        return NextResponse.json(
          { success: false, error: "All fields are required" },
          { status: 400 }
        );
      }

      const existingAdmin = await db
        .select()
        .from(adminTable)
        .where(eq(adminTable.email, email));

      if (existingAdmin.length > 0) {
        return NextResponse.json(
          { success: false, error: "Admin already exists" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await db
        .insert(adminTable)
        .values({
          email,
          password: hashedPassword,
          name,
          role: "admin",
          createdAt: new Date().toISOString(),
        })
        .returning();

      const { password: _, ...adminData } = result[0];

      return NextResponse.json({
        success: true,
        admin: serialize(adminData),
        message: "Admin created successfully",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Authentication failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
