import { registerAs } from '@nestjs/config';

/**
 * JWT Configuration
 *
 * Centralized configuration for JWT authentication
 *
 * Environment Variables:
 * - JWT_SECRET: Secret key for signing JWTs (required)
 * - JWT_EXPIRES_IN: Token expiry duration (default: 7d)
 *
 * Cookie Settings:
 * - httpOnly: true (prevent XSS attacks)
 * - secure: true in production (HTTPS only)
 * - sameSite: 'strict' (CSRF protection)
 * - maxAge: 7 days
 *
 * NO direct process.env usage outside this file
 */

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  cookieName: string;
  cookieMaxAge: number; // milliseconds
}

export default registerAs('jwt', (): JwtConfig => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  // Validate required fields
  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is required but not provided. ' +
        'Please set JWT_SECRET in your .env file.',
    );
  }

  return {
    secret,
    expiresIn,
    cookieName: 'auth_token',
    cookieMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  };
});
