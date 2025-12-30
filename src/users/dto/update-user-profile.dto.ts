import { IsString, IsArray, IsOptional, IsNotEmpty } from 'class-validator';

/**
 * Update User Profile DTO
 *
 * Validates user profile update request
 *
 * Rules:
 * - All fields are optional (partial update)
 * - name must be non-empty if provided
 * - selectedDomains must be array of strings if provided
 * - Email cannot be updated (immutable)
 */

export class UpdateUserProfileDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsOptional()
  name?: string;

  @IsArray({ message: 'Selected domains must be an array' })
  @IsString({ each: true, message: 'Each domain must be a string' })
  @IsOptional()
  selectedDomains?: string[];
}
