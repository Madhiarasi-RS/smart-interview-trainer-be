import { IsEmail, IsNotEmpty, IsString, Matches, Length } from 'class-validator';

/**
 * Verify OTP DTO
 *
 * Validation for OTP verification (registration or password reset)
 *
 * Fields:
 * - email: Email address linked to OTP
 * - otp: 6-digit numeric code
 *
 * Flow:
 * - Registration: User enters OTP to verify email and complete registration
 * - Password Reset: User enters OTP to proceed to password reset
 */

export class VerifyOtpDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString({ message: 'OTP must be a string' })
  @IsNotEmpty({ message: 'OTP is required' })
  @Matches(/^[0-9]+$/, { message: 'OTP must contain only numbers' })
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp!: string;
}
