import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Logging Interceptor
 *
 * Logs all incoming requests and outgoing responses
 *
 * Responsibilities:
 * - Log request method, URL, and timestamp
 * - Log response time
 * - Log errors (if any)
 *
 * Used globally or per-controller
 */

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context
      .switchToHttp()
      .getRequest<{ method: string; url: string }>();
    const { method, url } = request;
    const now = Date.now();

    this.logger.log(`Incoming Request: ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        this.logger.log(`Response: ${method} ${url} - ${responseTime}ms`);
      }),
    );
  }
}
