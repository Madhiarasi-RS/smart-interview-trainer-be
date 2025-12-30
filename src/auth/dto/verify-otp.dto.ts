import { IsEmail, IsNotEmpty, IsString, Matches, Length } from 'class-validator';

/**
 * Verify OTP DTO
 * 
 * Validates OTP verification request
 * 
 * Rules:
 * - email must be valid email format
 * - otp must be numeric string
 * - otp length must be 4-6 digits
 */

export class VerifyOtpDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString({ message: 'OTP must be a string' })
  @IsNotEmpty({ message: 'OTP is required' })
  @Matches(/^[0-9]+$/, { message: 'OTP must contain only numbers' })
  @Length(4, 6, { message: 'OTP must be between 4 and 6 digits' })
  otp!: string;
}
