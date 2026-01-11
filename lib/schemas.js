import { z } from "zod";

// --- Course Layout Schemas ---

export const ChapterSchema = z.object({
  chapterName: z.string(),
  description: z.string().optional(),
  duration: z.string().optional(),
  topics: z.array(z.string()).optional().default([]),
});

export const CourseJsonSchema = z.object({
  courseTitle: z.string(),
  description: z.string().optional(),
  level: z.string(),
  category: z.string().optional(),
  chapters: z.array(ChapterSchema).optional().default([]),
});

// --- Course Content Schemas ---

export const LessonSchema = z.object({
  title: z.string(),
  content: z.string(),
  codeExample: z.string().optional(),
});

export const ChapterContentSchema = z.record(z.string(), z.array(LessonSchema));

// --- Database Row Schemas ---

export const CourseSchema = z.object({
  id: z.number(),
  cid: z.string(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  noOfChapters: z.number(),
  includeVideo: z.boolean().nullable(),
  level: z.string(),
  category: z.string().nullable(),
  courseJson: CourseJsonSchema.nullable(),
  bannerImageUrl: z.string().nullable(),
  courseContent: z.any().nullable().default({}), // Can be complex record
  userEmail: z.string(),
});

export const EnrollmentSchema = z.object({
  id: z.number(),
  cid: z.string().nullable(),
  userEmail: z.string(),
  completedChapters: z.array(z.string()).nullable().default([]),
  enrolledAt: z.date().or(z.string()).nullable(),
  lastActivityAt: z.date().or(z.string()).nullable(),
});

// --- API Response Schemas ---

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export const CourseDetailResponseSchema = ApiResponseSchema.extend({
  data: z.object({
    courses: CourseSchema,
    enrollCourse: EnrollmentSchema.nullable().optional(),
  }).optional(),
});
