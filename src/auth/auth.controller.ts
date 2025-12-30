import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResponseHelper, ApiResponse } from '../common/utils/response.helper';

/**
 * Auth Controller
 *
 * Responsibilities:
 * - Accept authentication requests
 * - Validate input via DTOs (class-validator)
 * - Call AuthService for business logic
 * - Return standardized responses
 *
 * Must NOT:
 * - Contain business logic
 * - Access database directly
 * - Handle OTP generation
 * - Manage JWT tokens
 *
 * Endpoints:
 * - POST /auth/login - Send OTP to email
 * - POST /auth/verify-otp - Verify OTP and authenticate
 */

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   *
   * Send OTP to user email for authentication
   *
   * Request Body:
   * {
   *   "email": "user@example.com"
   * }
   *
   * Response:
   * {
   *   "success": true,
   *   "message": "OTP sent successfully",
   *   "data": { "otpSent": true, "email": "user@example.com" },
   *   "error": {}
   * }
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse> {
    const result = await this.authService.login(loginDto);
    return ResponseHelper.success('OTP sent successfully', result);
  }

  /**
   * POST /auth/verify-otp
   *
   * Verify OTP and authenticate user
   *
   * Request Body:
   * {
   *   "email": "user@example.com",
   *   "otp": "123456"
   * }
   *
   * Response:
   * {
   *   "success": true,
   *   "message": "Authentication successful",
   *   "data": {
   *     "authenticated": true,
   *     "user": { "id": "...", "email": "...", "role": "..." }
   *   },
   *   "error": {}
   * }
   */
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<ApiResponse> {
    const result = await this.authService.verifyOtp(verifyOtpDto);
    return ResponseHelper.success('Authentication successful', result);
  }
}
