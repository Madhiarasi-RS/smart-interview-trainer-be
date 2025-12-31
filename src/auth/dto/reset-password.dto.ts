import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

/**
 * Reset Password DTO
 *
 * Validation for password reset after OTP verification
 *
 * Fields:
 * - email: Email address of user resetting password
 * - otp: 6-digit OTP code (already verified)
 * - newPassword: New password to set (min 8 characters)
 *
 * Flow:
 * 1. User receives OTP via email
 * 2. User verifies OTP
 * 3. User enters new password
 * 4. System hashes and saves new password
 *
 * Security:
 * - OTP must be verified before allowing password reset
 * - Old password hash is overwritten
 * - New password is bcrypt hashed before storage
 */

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'OTP is required' })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp: string;

  @IsNotEmpty({ message: 'New password is required' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;
}
