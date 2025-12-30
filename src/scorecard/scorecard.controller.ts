import { Controller, Post, Body } from '@nestjs/common';
import { ScorecardService } from './scorecard.service';
import { CreateScorecardDto } from './dto/create-scorecard.dto';
import { ResponseHelper, ApiResponse } from '../common/utils/response.helper';

/**
 * Scorecard Controller
 *
 * Responsibilities:
 * - Accept scorecard computation requests
 * - Validate AI analysis input via DTOs
 * - Call ScorecardService for computation
 * - Return standardized responses
 *
 * Endpoints:
 * - POST /scorecard - Generate scorecard from AI analysis
 *
 * Must NOT:
 * - Contain computation logic (use ScorecardService)
 * - Call Gemini directly
 * - Access database directly
 * - Process raw AI responses
 */

@Controller('scorecard')
export class ScorecardController {
  constructor(private readonly scorecardService: ScorecardService) {}

  /**
   * Generate scorecard from AI analysis results
   *
   * Accepts structured AI analysis data and computes:
   * - Communication score
   * - Domain fit score
   * - Confidence score
   * - Answer relevance score
   * - Final score (sum of all components)
   * - Strengths/weaknesses/suggestions
   *
   * @param createScorecardDto - AI analysis input with all score components
   * @returns Computed scorecard with feedback
   */
  @Post()
  async generateScorecard(
    @Body() createScorecardDto: CreateScorecardDto,
  ): Promise<ApiResponse> {
    const scorecard =
      await this.scorecardService.generateScorecard(createScorecardDto);
    return ResponseHelper.success(
      `Scorecard generated successfully | Final Score: ${scorecard.finalScore}/40`,
      scorecard,
    );
  }
}
