import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { EmailService } from '../common/services/email.service';

/**
 * Auth Service
 *
 * Responsibilities:
 * - Handle user login and OTP verification
 * - Manage authentication flow
 * - Generate and send OTP via email
 *
 * Features:
 * - Random 6-digit OTP generation
 * - Email sending with MongoDB templates
 * - OTP storage (in-memory, TODO: move to Redis)
 * - OTP expiry (5 minutes)
 *
 * TODO:
 * - Move OTP storage to Redis for production
 * - Add rate limiting for OTP requests
 * - Implement JWT token generation after verification
 * - Add user validation from database
 */

// In-memory OTP storage (TODO: Replace with Redis)
interface OtpStorage {
  otp: string;
  email: string;
  expiresAt: Date;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly otpStore = new Map<string, OtpStorage>(); // email -> OTP data
  private readonly OTP_EXPIRY_MINUTES = 5;

  constructor(private readonly emailService: EmailService) {}

  /**
   * Login - Generate and send OTP to user email
   *
   * Steps:
   * 1. Generate random 6-digit OTP
   * 2. Store OTP with expiry time
   * 3. Send OTP via email using MongoDB template
   * 4. Return success response
   *
   * @param loginDto - Contains user email
   * @returns OTP sent status and email
   */
  async login(loginDto: LoginDto): Promise<{ otpSent: boolean; email: string }> {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);

    try {
      // Generate 6-digit OTP
      const otp = this.generateOtp();

      // Store OTP with expiry (5 minutes)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);

      this.otpStore.set(loginDto.email, {
        otp,
        email: loginDto.email,
        expiresAt,
      });


      // Send OTP via email using template from MongoDB
      const emailSent = await this.emailService.sendTemplatedEmail(
        loginDto.email,
        'otp-verification',
        {
          otp,
          expiryMinutes: this.OTP_EXPIRY_MINUTES,
          email: loginDto.email,
        },
      );

      if (!emailSent) {
        this.logger.error(`Failed to send OTP email`);
        throw new BadRequestException(
          'Failed to send OTP email. Please try again.',
        );
      }

      this.logger.log(`OTP sent successfully`);

      return {
        otpSent: true,
        email: loginDto.email,
      };
    } catch (error) {
      this.logger.error(
        `Error during login for ${loginDto.email}:`,
        error instanceof Error ? error.stack : error,
      );
      throw error;
    }
  }

  /**
   * Verify OTP and authenticate user
   *
   * Steps:
   * 1. Validate OTP from in-memory storage
   * 2. Check OTP expiry
   * 3. Clear used OTP
   * 4. Return authenticated user (TODO: generate JWT)
   *
   * @param verifyOtpDto - Contains email and OTP
   * @returns Authenticated user object
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
    authenticated: boolean;
    user: { id: string; email: string; role: string };
  }> {
    this.logger.log(`OTP verification for email: ${verifyOtpDto.email}`);

    // Get stored OTP
    const storedOtp = this.otpStore.get(verifyOtpDto.email);

    if (!storedOtp) {
      this.logger.warn(`No OTP found for ${verifyOtpDto.email}`);
      throw new BadRequestException('Invalid OTP or OTP expired');
    }

    // Check OTP expiry
    if (new Date() > storedOtp.expiresAt) {
      this.otpStore.delete(verifyOtpDto.email);
      this.logger.warn(`Expired OTP for ${verifyOtpDto.email}`);
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    // Verify OTP
    if (storedOtp.otp !== verifyOtpDto.otp) {
      this.logger.warn(
        `Invalid OTP attempt for ${verifyOtpDto.email}: ${verifyOtpDto.otp}`,
      );
      throw new BadRequestException('Invalid OTP');
    }

    // Clear used OTP
    this.otpStore.delete(verifyOtpDto.email);

    this.logger.log(`OTP verified successfully for ${verifyOtpDto.email}`);

    // TODO: Fetch user from database
    // TODO: Generate JWT access and refresh tokens

    return {
      authenticated: true,
      user: {
        id: 'mock-user-id', // TODO: Real user ID from database
        email: verifyOtpDto.email,
        role: 'user',
      },
    };
  }

  /**
   * Generate random 6-digit OTP
   *
   * @returns 6-digit OTP string
   */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
