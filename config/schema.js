import { boolean, integer, json, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  subscriptionId: varchar()
});


export const coursesTable = pgTable("courses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar().notNull().unique(),
  name:varchar(),
  description:varchar(),
  noOfChapters:integer().notNull(),
  includeVideo:boolean().default(false),
  level:varchar().notNull(),
  category:varchar(),
  courseJson:json(),
  bannerImageUrl:varchar().default(""),
  courseContent:json().default({}),
  userEmail:varchar().references(()=>usersTable.email).notNull()
});

export const enrollCourseTable = pgTable('enrollCourse',{
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cid:varchar('cid').references(()=>coursesTable.cid),
  userEmail:varchar().references(()=>usersTable.email).notNull(),
  completedChapters: json()
})

export const quizzesTable = pgTable('quizzes', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  quizId: varchar().notNull().unique(),
  title: varchar({ length: 500 }).notNull(),
  description: varchar({ length: 1000 }),
  topic: varchar({ length: 255 }).notNull(),
  difficulty: varchar({ length: 50 }).notNull(),
  questionCount: integer().notNull(),
  quizData: json().notNull(),
  userEmail: varchar().references(() => usersTable.email).notNull(),
  createdAt: varchar().notNull()
})

export const adminTable = pgTable('admins', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 50 }).notNull().default('admin'),
  createdAt: varchar().notNull(),
  lastLogin: varchar()
})