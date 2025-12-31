import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Send OTP DTO
 *
 * Validation for sending OTP (registration or password reset)
 *
 * Fields:
 * - email: Email address to send OTP to
 * - purpose: Why OTP is being sent (registration, password-reset)
 *
 * Flow:
 * - Forgot Password: User enters email, system sends OTP
 * - Registration: System sends OTP after user submits registration form
 */

export class SendOtpDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
}
