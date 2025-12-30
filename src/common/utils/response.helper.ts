/**
 * Standard API Response Helper
 *
 * Enforces consistent response format across all API endpoints.
 * All controllers must use this helper to return responses.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | Record<string, never>;
  error: Record<string, unknown> | Record<string, never>;
}

export class ResponseHelper {
  /**
   * Success response
   * @param message - Human-readable success message
   * @param data - Response payload (optional)
   * @returns Standardized success response
   */
  static success<T>(message: string, data?: T): ApiResponse<T> {
    return {
      success: true,
      message,
      data: data ?? ({} as Record<string, never>),
      error: {},
    };
  }

  /**
   * Error response
   * @param message - Human-readable error message
   * @param error - Error details (optional, no sensitive data)
   * @returns Standardized error response
   */
  static error(message: string, error?: Record<string, unknown>): ApiResponse {
    return {
      success: false,
      message,
      data: {},
      error: error ?? {},
    };
  }
}
