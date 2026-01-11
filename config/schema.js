import { boolean, integer, json, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  subscriptionId: varchar({ length: 64 })
});


export const coursesTable = pgTable("courses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }),
  description: varchar({ length: 1000 }),
  noOfChapters: integer().notNull(),
  includeVideo: boolean().default(false),
  level: varchar({ length: 50 }).notNull(),
  category: varchar({ length: 255 }),
  courseJson: json(),
  bannerImageUrl: varchar({ length: 1024 }).default(""),
  courseContent: json().default({}),
  userEmail: varchar({ length: 255 }).references(() => usersTable.email).notNull()
});

export const enrollCourseTable = pgTable('enrollCourse',{
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar({ length: 255 }).references(() => coursesTable.cid),
  userEmail: varchar({ length: 255 }).references(() => usersTable.email).notNull(),
  completedChapters: json()
})

export const quizzesTable = pgTable('quizzes', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  quizId: varchar({ length: 255 }).notNull().unique(),
  title: varchar({ length: 500 }).notNull(),
  description: varchar({ length: 1000 }),
  topic: varchar({ length: 255 }).notNull(),
  difficulty: varchar({ length: 50 }).notNull(),
  questionCount: integer().notNull(),
  quizData: json().notNull(),
  userEmail: varchar({ length: 255 }).references(() => usersTable.email).notNull(),
  createdAt: timestamp().notNull().defaultNow()
})

export const adminTable = pgTable('admins', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 50 }).notNull().default('admin'),
  createdAt: timestamp().notNull().defaultNow(),
  lastLogin: timestamp()
})

// Add achievements table for gamification
export const achievementsTable = pgTable('achievements', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => usersTable.id).notNull(),
  achievementType: varchar({ length: 100 }).notNull(),
  achievementName: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 500 }),
  earnedAt: timestamp().notNull().defaultNow(),
  points: integer().default(0)
})