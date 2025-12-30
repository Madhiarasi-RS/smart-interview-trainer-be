import { CanActivate, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * JWT Auth Guard
 *
 * Protects routes that require authentication
 *
 * Responsibilities:
 * - Validate JWT token from request
 * - Attach user info to request object
 * - Reject unauthorized requests
 *
 * NO IMPLEMENTATION YET - PLACEHOLDER ONLY
 *
 * Future Implementation:
 * - Extract token from Authorization header
 * - Verify token with JWT strategy
 * - Load user from database
 */

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    // Placeholder: Will validate JWT token
    // For now, allow all requests (remove in production)
    return true;
  }
}
