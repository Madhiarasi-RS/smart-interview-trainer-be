import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * HTTP Exception Filter
 *
 * Global exception handler for all HTTP exceptions
 *
 * Responsibilities:
 * - Catch all HTTP exceptions
 * - Format error responses consistently
 * - Log errors for monitoring
 * - Hide sensitive internal details
 *
 * Follows standard API response format
 */

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract error message
    let message = 'An error occurred';
    let error: Record<string, unknown> = {};

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      message =
        ((exceptionResponse as Record<string, unknown>).message as string) ||
        message;
      error = exceptionResponse as Record<string, unknown>;
    }

    // Log error
    this.logger.error(`HTTP ${status} Error: ${message}`, exception.stack);

    // Return standard error response
    response.status(status).json({
      success: false,
      message,
      data: {},
      error: {
        statusCode: status,
        ...error,
      },
    });
  }
}

/**
 * All Exceptions Filter
 *
 * Catches any unhandled exceptions (fallback)
 */

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Default to 500 Internal Server Error
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    // Log the unhandled exception
    this.logger.error('Unhandled Exception:', exception);

    // Return standard error response
    response.status(status).json({
      success: false,
      message: 'Internal server error',
      data: {},
      error: {
        statusCode: status,
      },
    });
  }
}
