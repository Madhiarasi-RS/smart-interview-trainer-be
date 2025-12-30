import { Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

/**
 * Auth Service
 *
 * Responsibilities:
 * - Handle user login and OTP verification
 * - Manage authentication flow
 *
 * CURRENT STATUS: SKELETON ONLY
 * - Stub implementations only
 * - No real OTP generation
 * - No email sending
 * - No JWT tokens
 * - No database interaction
 *
 * Future Implementation:
 * - Real OTP generation and storage
 * - Email service integration
 * - JWT token generation
 * - User validation
 */

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  /**
   * Login - Send OTP to user email
   *
   * STUB IMPLEMENTATION
   *
   * Future:
   * - Generate random OTP (4-6 digits)
   * - Store OTP with expiry (Redis/DB)
   * - Send OTP via email service
   * - Return success message
   *
   * @param loginDto - Contains user email
   * @returns Mock success response
   */
  async login(loginDto: LoginDto): Promise<{ otpSent: boolean; email: string }> {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);

    // STUB: Simulate OTP sending
    // TODO: Generate real OTP
    // TODO: Store in Redis/DB with expiry
    // TODO: Send via email service

    return Promise.resolve({
      otpSent: true,
      email: loginDto.email,
    });
  }

  /**
   * Verify OTP and authenticate user
   *
   * STUB IMPLEMENTATION
   *
   * Future:
   * - Validate OTP against stored value
   * - Check OTP expiry
   * - Fetch user from database
   * - Generate JWT tokens
   * - Return authenticated user data
   *
   * @param verifyOtpDto - Contains email and OTP
   * @returns Mock authenticated user object
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
    authenticated: boolean;
    user: { id: string; email: string; role: string };
  }> {
    this.logger.log(`OTP verification for email: ${verifyOtpDto.email}`);

    // STUB: Simulate OTP verification
    // TODO: Validate OTP from Redis/DB
    // TODO: Check expiry
    // TODO: Fetch user from database
    // TODO: Generate JWT access and refresh tokens

    return Promise.resolve({
      authenticated: true,
      user: {
        id: 'mock-user-id',
        email: verifyOtpDto.email,
        role: 'user',
      },
    });
  }
}
