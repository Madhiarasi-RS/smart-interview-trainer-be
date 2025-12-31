import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Login DTO
 *
 * Validation for user login with email and password
 *
 * Fields:
 * - email: User's email address
 * - password: User's password (plaintext, will be compared with bcrypt hash)
 *
 * Flow:
 * 1. User submits email + password
 * 2. System validates credentials
 * 3. System generates JWT token
 * 4. System sets HTTP-only cookie
 * 5. User is authenticated
 */

export class LoginDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;
}
