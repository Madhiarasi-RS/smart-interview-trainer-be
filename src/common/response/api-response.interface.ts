/**
 * Standard API Response Interface
 *
 * All API responses MUST follow this structure
 *
 * Rules:
 * - No additional root-level fields
 * - success = true → data populated, error = {}
 * - success = false → data = {}, error populated
 * - message is mandatory in all responses
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | Record<string, never>;
  error: Record<string, unknown> | Record<string, never>;
}
