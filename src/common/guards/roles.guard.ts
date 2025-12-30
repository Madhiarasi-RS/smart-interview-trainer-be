import { CanActivate, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

/**
 * Roles Guard
 *
 * Enforces role-based access control
 *
 * Responsibilities:
 * - Check if user has required role(s)
 * - Reject requests from unauthorized roles
 *
 * NO IMPLEMENTATION YET - PLACEHOLDER ONLY
 *
 * Usage:
 * @Roles('admin', 'moderator')
 * @UseGuards(RolesGuard)
 * someProtectedRoute() { }
 */

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    // Placeholder: Will check user roles
    // For now, allow all requests (remove in production)
    return true;
  }
}
