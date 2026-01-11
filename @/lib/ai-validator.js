import { z } from 'zod';

/**
 * Robustly sanitizes and extracts JSON from AI-generated text.
 * Handles markdown fences, extra text, trailing commas, and control characters.
 */
export function sanitizeAIJson(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return null;
  }

  // 1. Remove markdown code blocks (e.g., ```json ... ``` or ``` ... ```)
  let cleaned = rawText
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  // 2. Try to find the first '{' or '[' and the last '}' or ']'
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  const lastBrace = cleaned.lastIndexOf('}');
  const lastBracket = cleaned.lastIndexOf(']');

  let start = -1;
  let end = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    start = firstBrace;
    end = lastBrace;
  } else if (firstBracket !== -1) {
    start = firstBracket;
    end = lastBracket;
  }

  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.substring(start, end + 1);
  }

  // 3. Fix common JSON malformations
  cleaned = cleaned
    .replace(/,\s*}/g, '}') // Trailing commas in objects
    .replace(/,\s*]/g, ']') // Trailing commas in arrays
    .replace(/[\x00-\x1F\x7F]/g, ' '); // Control characters

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('[Validator] JSON Parse Error:', error.message);
    console.debug('[Validator] Malformed JSON Content:', cleaned);
    return null;
  }
}

// --- Schemas ---

export const CourseLayoutSchema = z.object({
  course: z.object({
    name: z.string(),
    description: z.string(),
    category: z.string(),
    level: z.enum(['beginner', 'moderate', 'advanced', 'Intermediate', 'Beginner', 'Advanced']).transform(val => val.toLowerCase()),
    includeVideo: z.boolean().or(z.string().transform(v => v === 'true')),
    noOfChapters: z.number().or(z.string().transform(v => parseInt(v, 10))),
    bannerImagePrompt: z.string(),
    chapters: z.array(z.object({
      chapterName: z.string(),
      duration: z.string(),
      installation: z.array(z.string()).optional().default([]),
      setup: z.array(z.string()).optional().default([]),
      notes: z.array(z.string()).optional().default([]),
      definitions: z.array(z.string()).optional().default([]),
      topics: z.array(z.string()).optional().default([])
    }))
  })
});

export const CourseContentSchema = z.object({
  topics: z.array(z.object({
    topic: z.string(),
    content: z.string()
  })),
  chapterName: z.string().optional()
});

export const QuizSchema = z.object({
  title: z.string(),
  description: z.string(),
  learningObjectives: z.array(z.string()).optional().default([]),
  questions: z.array(z.object({
    id: z.number().or(z.string()),
    type: z.enum(["multiple_choice", "true_false", "fill_blank", "short_answer", "code"]),
    question: z.string(),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string().or(z.number()).transform(v => String(v)),
    explanation: z.string(),
    hint: z.string().optional(),
    codeExample: z.string().optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional().default("medium")
  })),
  totalQuestions: z.number().or(z.string().transform(v => parseInt(v, 10))),
  estimatedTime: z.string().optional()
});

/**
 * Validates AI output against a Zod schema after sanitization.
 * @returns { success: true, data: T } | { success: false, error: string }
 */
export function validateAIResponse(rawText, schema) {
  const sanitized = sanitizeAIJson(rawText);
  
  if (!sanitized) {
    return { success: false, error: 'Failed to extract valid JSON from AI response.' };
  }

  const result = schema.safeParse(sanitized);
  
  if (!result.success) {
    console.error('[Validator] Schema Validation Failed:', result.error.format());
    return { 
      success: false, 
      error: 'AI response did not match the expected structure.',
      details: result.error.errors
    };
  }

  return { success: true, data: result.data };
}
