import { NextResponse } from "next/server";

/**
 * Standard API response wrapper
 */
export function apiResponse({ success, data, message, error, status = 200 }) {
  const response = {
    success,
    ...(data && { data }),
    ...(message && { message }),
    ...(error && { error }),
  };

  return NextResponse.json(response, { status });
}

/**
 * Success response helper
 */
export function successResponse(data, message = "Success", status = 200) {
  return apiResponse({ success: true, data, message, status });
}

/**
 * Error response helper
 */
export function errorResponse(error, status = 400) {
  return apiResponse({ success: false, error, status });
}

/**
 * Serialization helper for BigInt and other non-JSON types
 */
export function serialize(obj) {
  if (!obj) return obj;
  return JSON.parse(
    JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v))
  );
}

/**
 * Safe JSON parse for JSONB fields
 */
export function safeParseJson(value, defaultValue = {}) {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value) || defaultValue;
  } catch (e) {
    console.warn("Failed to parse JSON field:", e);
    return defaultValue;
  }
}
