import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Transform Interceptor
 *
 * Ensures all responses follow the standard API format
 *
 * Responsibilities:
 * - Wrap raw responses in standard format
 * - Add metadata (timestamp, request ID)
 *
 * NOTE: Controllers should already use ResponseHelper
 * This is a safety net for any direct returns
 */

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        // If data already follows standard format, return as-is
        if (data && typeof data === 'object' && 'success' in data) {
          return data as Record<string, unknown>;
        }

        // Otherwise, wrap in standard format (safety net)
        return {
          success: true,
          message: 'Success',
          data: data ?? {},
          error: {},
        };
      }),
    );
  }
}
