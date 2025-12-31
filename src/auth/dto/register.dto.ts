import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Register DTO
 *
 * Validation for user registration
 *
 * Fields:
 * - name: User's full name (required, min 2 characters)
 * - email: Valid email address (required, unique check in service)
 * - password: Strong password (required, min 8 characters)
 *
 * Flow:
 * 1. User submits registration form
 * 2. System validates input
 * 3. System sends OTP to email
 * 4. User verifies OTP to complete registration
 */

export class RegisterDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
