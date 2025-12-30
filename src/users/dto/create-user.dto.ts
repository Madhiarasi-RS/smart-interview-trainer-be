import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../user.schema';

/**
 * Create User DTO
 *
 * Validates user creation request
 *
 * Rules:
 * - name is required, non-empty string
 * - email is required, valid email format
 * - role is optional (defaults to STUDENT in schema)
 * - selectedDomains is optional array of strings
 */

export class CreateUserDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsEnum(UserRole, { message: 'Role must be STUDENT' })
  @IsOptional()
  role?: UserRole;

  @IsArray({ message: 'Selected domains must be an array' })
  @IsString({ each: true, message: 'Each domain must be a string' })
  @IsOptional()
  selectedDomains?: string[];
}
