import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { InterviewDifficulty, InterviewDuration } from '../interview.schema';

/**
 * Create Interview DTO
 *
 * Validates interview session creation request
 *
 * Rules:
 * - userId is required
 * - domain is required, non-empty string
 * - difficulty must be EASY, MEDIUM, or HIGH
 * - duration must be 15M, 30M, or 60M
 */

export class CreateInterviewDto {
  @IsString({ message: 'User ID must be a string' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId!: string;

  @IsString({ message: 'Domain must be a string' })
  @IsNotEmpty({ message: 'Domain is required' })
  domain!: string;

  @IsEnum(InterviewDifficulty, {
    message: 'Difficulty must be EASY, MEDIUM, or HIGH',
  })
  difficulty!: InterviewDifficulty;

  @IsEnum(InterviewDuration, {
    message: 'Duration must be 15M, 30M, or 60M',
  })
  duration!: InterviewDuration;
}
