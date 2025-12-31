import { Controller, Post, Body, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResponseHelper } from '../common/response/api-response.helper';
import type { ApiResponse } from '../common/response/api-response.interface';

/**
 * Auth Controller
 *
 * Handles all authentication endpoints:
 * - POST /auth/register - Register new user with OTP
 * - POST /auth/verify-otp - Verify OTP (registration or password reset)
 * - POST /auth/login - Login with email + password
 * - POST /auth/send-otp - Send OTP for password reset
 * - POST /auth/reset-password - Reset password after OTP verification
 * - POST /auth/logout - Logout and clear session
 *
 * All responses use standard API response wrapper
 * Tokens are set as HTTP-only cookies
 * No business logic in controller
 */

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * POST /auth/register
   *
   * Register new user and send OTP for email verification
   *
   * Flow:
   * 1. Validate input (DTO)
   * 2. Create user with hashed password
   * 3. Send OTP to email
   * 4. Return success message
   *
   * Next step: User must verify email with OTP
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<ApiResponse> {
    const result = await this.authService.register(registerDto);
    return ResponseHelper.success('Registration successful', result);
  }

  /**
   * POST /auth/verify-otp
   *
   * Verify OTP for registration or password reset
   *
   * Note: Purpose is inferred from OTP record in database
   */
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<ApiResponse> {
    // For now, assume registration OTP verification
    // TODO: Add purpose field to DTO if needed
    const result = await this.authService.verifyRegistrationOtp(verifyOtpDto);
    return ResponseHelper.success('OTP verified successfully', result);
  }

  /**
   * POST /auth/login
   *
   * Login with email and password
   *
   * Flow:
   * 1. Validate credentials
   * 2. Generate JWT token
   * 3. Set HTTP-only cookie
   * 4. Return user data
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiResponse> {
    const result = await this.authService.login(loginDto);

    // Set JWT token as HTTP-only cookie
    const cookieName = this.configService.get<string>('jwt.cookieName') || 'auth_token';
    const cookieMaxAge = this.configService.get<number>('jwt.cookieMaxAge') || 7 * 24 * 60 * 60 * 1000;
    const isProduction = this.configService.get<string>('app.nodeEnv') === 'production';

    response.cookie(cookieName, result.accessToken, {
      httpOnly: true,
      secure: isProduction, // HTTPS only in production
      sameSite: 'strict',
      maxAge: cookieMaxAge,
    });

    return ResponseHelper.success('Login successful', {
      user: result.user,
    });
  }

  /**
   * POST /auth/send-otp
   *
   * Send OTP for password reset (forgot password flow)
   *
   * Flow:
   * 1. Validate email
   * 2. Generate and send OTP
   * 3. Return success message
   *
   * Next step: User must verify OTP to reset password
   */
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() sendOtpDto: SendOtpDto): Promise<ApiResponse> {
    const result = await this.authService.sendPasswordResetOtp(sendOtpDto);
    return ResponseHelper.success('OTP sent successfully', result);
  }

  /**
   * POST /auth/reset-password
   *
   * Reset password after OTP verification
   *
   * Flow:
   * 1. Re-validate OTP
   * 2. Hash new password
   * 3. Update user password
   * 4. Invalidate OTP
   * 5. Return success
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ApiResponse> {
    const result = await this.authService.resetPassword(resetPasswordDto);
    return ResponseHelper.success('Password reset successfully', result);
  }

  /**
   * POST /auth/logout
   *
   * Logout user by clearing authentication cookie
   *
   * Flow:
   * 1. Clear HTTP-only cookie
   * 2. Return success message
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response): Promise<ApiResponse> {
    const cookieName = this.configService.get<string>('jwt.cookieName') || 'auth_token';

    // Clear cookie
    response.clearCookie(cookieName, {
      httpOnly: true,
      secure: this.configService.get<string>('app.nodeEnv') === 'production',
      sameSite: 'strict',
    });

    return ResponseHelper.success('Logged out successfully', {});
  }
}
