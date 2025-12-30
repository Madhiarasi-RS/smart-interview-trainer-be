import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../response/api-response.interface';

/**
 * Global Exception Filter
 *
 * Centralized error handling for all HTTP exceptions
 *
 * Responsibilities:
 * - Catch all HttpException instances
 * - Format error responses consistently using standard ApiResponse
 * - Handle validation errors (class-validator)
 * - Log errors for monitoring
 * - Hide sensitive internal details
 * - Never expose stack traces to clients
 *
 * Handled Exception Types:
 * - ValidationException (class-validator errors)
 * - BadRequestException
 * - UnauthorizedException
 * - ForbiddenException
 * - NotFoundException
 * - InternalServerErrorException
 * - All other HttpExceptions
 *
 * Response Format:
 * {
 *   "success": false,
 *   "message": "User-safe error message",
 *   "data": {},
 *   "error": { "statusCode": 400, "details": [...] }
 * }
 */

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract error message and details
    let message = 'An error occurred';
    let errorDetails: Record<string, unknown> = {};

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      const responseObj = exceptionResponse as Record<string, unknown>;
      
      // Handle validation errors (class-validator)
      if (Array.isArray(responseObj.message)) {
        message = 'Validation failed';
        errorDetails = {
          statusCode: status,
          validationErrors: this.formatValidationErrors(
            responseObj.message as string[],
          ),
        };
      } else {
        message = (responseObj.message as string) || message;
        errorDetails = {
          statusCode: status,
          error: responseObj.error,
        };
      }
    }

    // Log error (with request context)
    this.logger.error(
      `HTTP ${status} Error: ${message} | Path: ${request.url}`,
      exception.stack,
    );

    // Return standard error response
    const apiResponse: ApiResponse = {
      success: false,
      message,
      data: {},
      error: errorDetails,
    };

    response.status(status).json(apiResponse);
  }

  /**
   * Format validation errors into readable structure
   *
   * @param errors - Array of validation error messages
   * @returns Formatted validation errors
   */
  private formatValidationErrors(
    errors: string[],
  ): Array<{ field: string; message: string }> {
    return errors.map((error) => {
      // Try to extract field name from error message
      const match = error.match(/^(\w+)\s+(.+)$/);
      if (match) {
        return {
          field: match[1],
          message: match[2],
        };
      }
      return {
        field: 'unknown',
        message: error,
      };
    });
  }
}

/**
 * All Exceptions Filter
 *
 * Fallback handler for any unhandled exceptions
 *
 * Catches:
 * - Non-HTTP exceptions
 * - Unexpected errors
 * - Runtime errors
 *
 * Always returns 500 Internal Server Error with safe message
 */

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Default to 500 Internal Server Error
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    // Log the unhandled exception (full details)
    this.logger.error(
      `Unhandled Exception | Path: ${request.url}`,
      exception instanceof Error ? exception.stack : exception,
    );

    // Return standard error response (safe message)
    const apiResponse: ApiResponse = {
      success: false,
      message: 'Internal server error',
      data: {},
      error: {
        statusCode: status,
      },
    };

    response.status(status).json(apiResponse);
  }
}
