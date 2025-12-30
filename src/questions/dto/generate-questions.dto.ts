import { IsEnum, IsNumber, IsIn, IsNotEmpty } from 'class-validator';
import { QuestionDomain } from '../enums/question-domain.enum';
import { QuestionDifficulty } from '../enums/question-difficulty.enum';

/**
 * Generate Questions DTO
 *
 * Validates request data for generating interview questions
 *
 * Validation Rules:
 * - domain: Must be valid QuestionDomain enum value
 * - difficulty: Must be valid QuestionDifficulty enum value
 * - duration: Must be 15, 30, or 60 (minutes)
 *
 * Duration Mapping:
 * - 15 minutes → 15 MCQ questions
 * - 30 minutes → 15-20 descriptive questions
 * - 60 minutes → 25-30 descriptive questions
 */

export class GenerateQuestionsDto {
  @IsEnum(QuestionDomain, {
    message: 'Domain must be one of: FULLSTACK, CLOUD, MERN, UI_UX, QA, HR',
  })
  @IsNotEmpty()
  domain: QuestionDomain;

  @IsEnum(QuestionDifficulty, {
    message: 'Difficulty must be one of: EASY, MEDIUM, HARD',
  })
  @IsNotEmpty()
  difficulty: QuestionDifficulty;

  @IsNumber()
  @IsIn([15, 30, 60], {
    message: 'Duration must be 15, 30, or 60 minutes',
  })
  @IsNotEmpty()
  duration: number;
}
