import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Login DTO
 * 
 * Validates user login request
 * 
 * Rules:
 * - email must be valid email format
 * - email is required
 */

export class LoginDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;
}
