import { ApiResponse } from './api-response.interface';

/**
 * Standard API Response Helper
 *
 * Enforces consistent response format across all API endpoints
 *
 * Usage:
 * - Controllers should use ResponseHelper.success() or ResponseHelper.error()
 * - Never manually construct response objects
 * - All responses follow the standard ApiResponse interface
 *
 * Rules:
 * - success response: data populated, error = {}
 * - error response: data = {}, error populated
 * - message is mandatory in both cases
 * - Strong typing enforced via generics
 */

export class ResponseHelper {
  /**
   * Success response
   *
   * @param message - Human-readable success message
   * @param data - Response payload (optional)
   * @returns Standardized success response
   */
  static success<T = unknown>(
    message: string,
    data?: T,
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data: data ?? ({} as Record<string, never>),
      error: {},
    };
  }

  /**
   * Error response
   *
   * @param message - Human-readable error message (user-safe)
   * @param error - Error details (optional, no sensitive data)
   * @returns Standardized error response
   */
  static error(
    message: string,
    error?: Record<string, unknown>,
  ): ApiResponse {
    return {
      success: false,
      message,
      data: {},
      error: error ?? {},
    };
  }
}
