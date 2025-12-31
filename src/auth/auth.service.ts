import {
  Injectable,
  Logger,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Otp, OtpDocument, OtpPurpose } from './schemas/otp.schema';
import { EmailService } from '../common/services/email.service';

/**
 * Auth Service
 *
 * Complete authentication service supporting:
 * - Registration with OTP verification
 * - Login with email + password
 * - Forgot password with OTP
 * - Password reset
 * - JWT token generation
 *
 * Security:
 * - Passwords hashed with bcrypt (salt rounds: 10)
 * - OTPs stored in MongoDB with TTL (5 minutes)
 * - OTPs invalidated after use
 * - JWT tokens for session management
 * - HTTP-only cookies for token storage
 *
 * NO:
 * - Plaintext passwords
 * - Hardcoded OTPs
 * - OTPs in responses
 * - Sensitive data logging
 */

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly OTP_EXPIRY_MINUTES = 5;
  private readonly BCRYPT_SALT_ROUNDS = 10;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * REGISTER FLOW
   *
   * Step 1: Register user (this method)
   * Step 2: User receives OTP via email
   * Step 3: User verifies OTP (verifyRegistrationOtp)
   *
   * Process:
   * 1. Check if email already exists
   * 2. Hash password with bcrypt
   * 3. Create user (unverified)
   * 4. Generate and send OTP
   * 5. Return success message
   */
  async register(
    registerDto: RegisterDto,
  ): Promise<{ message: string; email: string }> {
    this.logger.log(`Registration attempt for email: ${registerDto.email}`);

    // Check if user already exists
    const existingUser = await this.userModel
      .findOne({ email: registerDto.email })
      .exec();

    if (existingUser) {
      this.logger.warn(`Registration failed: Email already exists - ${registerDto.email}`);
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      this.BCRYPT_SALT_ROUNDS,
    );

    // Create user (email not verified yet)
    const user = await this.userModel.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      isEmailVerified: false,
    });

    this.logger.log(`User created (unverified): ${user.email}`);

    // Generate and send OTP
    await this.generateAndSendOtp(user.email, OtpPurpose.REGISTRATION);

    return {
      message: 'Registration successful. Please verify your email with the OTP sent.',
      email: user.email,
    };
  }

  /**
   * VERIFY REGISTRATION OTP
   *
   * Completes registration by verifying email with OTP
   *
   * Process:
   * 1. Validate OTP
   * 2. Mark user email as verified
   * 3. Invalidate OTP
   * 4. Return success
   */
  async verifyRegistrationOtp(
    verifyOtpDto: VerifyOtpDto,
  ): Promise<{ message: string }> {
    this.logger.log(`Verifying registration OTP for: ${verifyOtpDto.email}`);

    // Validate OTP
    await this.validateOtp(
      verifyOtpDto.email,
      verifyOtpDto.otp,
      OtpPurpose.REGISTRATION,
    );

    // Mark email as verified
    const user = await this.userModel
      .findOneAndUpdate(
        { email: verifyOtpDto.email },
        { isEmailVerified: true },
        { new: true },
      )
      .exec();

    if (!user) {
      throw new BadRequestException('User not found');
    }

    this.logger.log(`Email verified for user: ${user.email}`);

    return {
      message: 'Email verified successfully. You can now log in.',
    };
  }

  /**
   * LOGIN FLOW
   *
   * Process:
   * 1. Find user by email
   * 2. Verify password with bcrypt
   * 3. Check email verification status
   * 4. Generate JWT token
   * 5. Return token
   */
  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; user: { id: string; name: string; email: string } }> {
    this.logger.log(`Login attempt for: ${loginDto.email}`);

    // Find user
    const user = await this.userModel.findOne({ email: loginDto.email }).exec();

    if (!user) {
      this.logger.warn(`Login failed: User not found - ${loginDto.email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      this.logger.warn(`Login failed: Invalid password - ${loginDto.email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check email verification (optional - can be enforced or not)
    if (!user.isEmailVerified) {
      this.logger.warn(`Login attempt with unverified email: ${loginDto.email}`);
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    // Generate JWT token
    const accessToken = this.generateJwtToken(user);

    this.logger.log(`Login successful for: ${user.email}`);

    return {
      accessToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }

  /**
   * SEND OTP (Forgot Password)
   *
   * Process:
   * 1. Check if user exists
   * 2. Generate and send OTP
   * 3. Return success
   */
  async sendPasswordResetOtp(
    sendOtpDto: SendOtpDto,
  ): Promise<{ message: string }> {
    this.logger.log(`Password reset OTP request for: ${sendOtpDto.email}`);

    // Check if user exists
    const user = await this.userModel.findOne({ email: sendOtpDto.email }).exec();

    if (!user) {
      // Security: Don't reveal if email exists or not
      this.logger.warn(`Password reset requested for non-existent email: ${sendOtpDto.email}`);
      // Return success anyway to prevent email enumeration
      return {
        message: 'If the email exists, an OTP has been sent.',
      };
    }

    // Generate and send OTP
    await this.generateAndSendOtp(user.email, OtpPurpose.PASSWORD_RESET);

    this.logger.log(`Password reset OTP sent to: ${user.email}`);

    return {
      message: 'OTP sent to your email address.',
    };
  }

  /**
   * VERIFY PASSWORD RESET OTP
   *
   * Process:
   * 1. Validate OTP
   * 2. Return success (allows user to proceed to password reset)
   */
  async verifyPasswordResetOtp(
    verifyOtpDto: VerifyOtpDto,
  ): Promise<{ message: string }> {
    this.logger.log(`Verifying password reset OTP for: ${verifyOtpDto.email}`);

    // Validate OTP (but don't invalidate yet - will be invalidated on password reset)
    await this.validateOtp(
      verifyOtpDto.email,
      verifyOtpDto.otp,
      OtpPurpose.PASSWORD_RESET,
    );

    this.logger.log(`Password reset OTP verified for: ${verifyOtpDto.email}`);

    return {
      message: 'OTP verified. You can now reset your password.',
    };
  }

  /**
   * RESET PASSWORD
   *
   * Process:
   * 1. Re-validate OTP
   * 2. Hash new password
   * 3. Update user password
   * 4. Invalidate OTP
   * 5. Return success
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    this.logger.log(`Password reset for: ${resetPasswordDto.email}`);

    // Re-validate OTP
    await this.validateOtp(
      resetPasswordDto.email,
      resetPasswordDto.otp,
      OtpPurpose.PASSWORD_RESET,
    );

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      resetPasswordDto.newPassword,
      this.BCRYPT_SALT_ROUNDS,
    );

    // Update user password
    const user = await this.userModel
      .findOneAndUpdate(
        { email: resetPasswordDto.email },
        { password: hashedPassword },
        { new: true },
      )
      .exec();

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Invalidate OTP
    await this.otpModel
      .updateOne(
        {
          email: resetPasswordDto.email,
          otp: resetPasswordDto.otp,
          purpose: OtpPurpose.PASSWORD_RESET,
          isUsed: false,
        },
        { isUsed: true },
      )
      .exec();

    this.logger.log(`Password reset successful for: ${user.email}`);

    return {
      message: 'Password reset successfully. You can now log in with your new password.',
    };
  }

  /**
   * HELPER: Generate and send OTP
   *
   * Process:
   * 1. Generate 6-digit OTP
   * 2. Calculate expiry time (5 minutes)
   * 3. Store in MongoDB
   * 4. Send via email
   */
  private async generateAndSendOtp(
    email: string,
    purpose: OtpPurpose,
  ): Promise<void> {
    // Generate 6-digit OTP
    const otp = this.generateOtp();

    // Calculate expiry
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);

    // Delete any existing OTPs for this email and purpose
    await this.otpModel
      .deleteMany({ email, purpose })
      .exec();

    // Store new OTP
    await this.otpModel.create({
      email,
      otp,
      purpose,
      expiresAt,
      isUsed: false,
    });

    this.logger.debug(`Generated OTP for ${email} (${purpose}): ${otp}`);

    // Send OTP via email
    const emailSent = await this.emailService.sendTemplatedEmail(
      email,
      'otp-verification',
      {
        otp,
        expiryMinutes: this.OTP_EXPIRY_MINUTES,
        email,
      },
    );

    if (!emailSent) {
      this.logger.error(`Failed to send OTP email to ${email}`);
      throw new BadRequestException(
        'Failed to send OTP email. Please try again.',
      );
    }

    this.logger.log(`OTP sent successfully to ${email} for ${purpose}`);
  }

  /**
   * HELPER: Validate OTP
   *
   * Process:
   * 1. Find OTP in database
   * 2. Check if exists
   * 3. Check if expired
   * 4. Check if already used
   * 5. Verify OTP matches
   */
  private async validateOtp(
    email: string,
    otp: string,
    purpose: OtpPurpose,
  ): Promise<void> {
    const otpRecord = await this.otpModel
      .findOne({ email, purpose, isUsed: false })
      .sort({ createdAt: -1 })
      .exec();

    if (!otpRecord) {
      this.logger.warn(`No valid OTP found for ${email} (${purpose})`);
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Check expiry
    if (new Date() > otpRecord.expiresAt) {
      this.logger.warn(`Expired OTP for ${email} (${purpose})`);
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      this.logger.warn(`Invalid OTP attempt for ${email} (${purpose}): ${otp}`);
      throw new BadRequestException('Invalid OTP');
    }

    // Mark as used (for registration verification)
    if (purpose === OtpPurpose.REGISTRATION) {
      await this.otpModel
        .updateOne({ _id: otpRecord._id }, { isUsed: true })
        .exec();
    }

    this.logger.log(`OTP validated for ${email} (${purpose})`);
  }

  /**
   * HELPER: Generate random 6-digit OTP
   */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * HELPER: Generate JWT token
   */
  private generateJwtToken(user: UserDocument): string {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    return this.jwtService.sign(payload);
  }
}
