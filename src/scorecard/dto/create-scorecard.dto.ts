import {
  IsNumber,
  IsNotEmpty,
  Min,
  Max,
  IsInt,
  IsString,
} from 'class-validator';

/**
 * Create Scorecard DTO
 *
 * Accepts structured AI analysis results for scorecard computation
 *
 * Validation Rules:
 * - All score fields: 0-10 range (number)
 * - fillerWordCount: Non-negative integer
 * - interviewId: Required string for tracking
 * - userId: Required string for tracking
 *
 * Input Source:
 * - Future: Gemini AI analysis output
 * - Current: Manual/mock input for testing
 *
 * NO:
 * - Direct Gemini calls from this DTO
 * - Business logic in DTO
 * - Database operations
 */

export class CreateScorecardDto {
  @IsString()
  @IsNotEmpty({ message: 'Interview ID is required' })
  interviewId: string;

  @IsString()
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @IsNumber()
  @Min(0, { message: 'Content clarity score must be at least 0' })
  @Max(10, { message: 'Content clarity score must not exceed 10' })
  contentClarityScore: number;

  @IsNumber()
  @Min(0, { message: 'Answer relevance score must be at least 0' })
  @Max(10, { message: 'Answer relevance score must not exceed 10' })
  answerRelevanceScore: number;

  @IsNumber()
  @Min(0, { message: 'Technical correctness score must be at least 0' })
  @Max(10, { message: 'Technical correctness score must not exceed 10' })
  technicalCorrectnessScore: number;

  @IsNumber()
  @Min(0, { message: 'Confidence level score must be at least 0' })
  @Max(10, { message: 'Confidence level score must not exceed 10' })
  confidenceLevelScore: number;

  @IsInt({ message: 'Filler word count must be an integer' })
  @Min(0, { message: 'Filler word count cannot be negative' })
  fillerWordCount: number;

  @IsNumber()
  @Min(0, { message: 'Speaking pace score must be at least 0' })
  @Max(10, { message: 'Speaking pace score must not exceed 10' })
  speakingPaceScore: number;

  @IsNumber()
  @Min(0, { message: 'Eye contact score must be at least 0' })
  @Max(10, { message: 'Eye contact score must not exceed 10' })
  eyeContactScore: number;
}
