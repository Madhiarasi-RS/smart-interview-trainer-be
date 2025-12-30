import { Controller, Post, Body } from '@nestjs/common';
import { QuestionService } from './question.service';
import { GenerateQuestionsDto } from './dto/generate-questions.dto';
import { ResponseHelper, ApiResponse } from '../common/utils/response.helper';

/**
 * Question Controller
 *
 * Responsibilities:
 * - Accept question generation requests
 * - Validate input via GenerateQuestionsDto
 * - Call QuestionService for business logic
 * - Return standardized responses
 *
 * Endpoints:
 * - POST /questions/generate - Generate questions for interview
 *
 * Must NOT:
 * - Contain business logic (use QuestionService)
 * - Call Gemini integration directly (use QuestionService)
 * - Hardcode domain/difficulty values
 */

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  /**
   * Generate interview questions
   *
   * @param generateQuestionsDto - Question generation parameters (domain, difficulty, duration)
   * @returns Generated questions with metadata
   */
  @Post('generate')
  async generateQuestions(
    @Body() generateQuestionsDto: GenerateQuestionsDto,
  ): Promise<ApiResponse> {
    const result =
      await this.questionService.generateQuestions(generateQuestionsDto);
    return ResponseHelper.success(
      `Generated ${result.questionCount} ${result.questionType} questions for ${result.domain}`,
      result,
    );
  }
}
