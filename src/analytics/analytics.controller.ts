import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ResponseHelper, ApiResponse } from '../common/utils/response.helper';

/**
 * Analytics Controller
 *
 * Responsibilities:
 * - Accept analytics requests
 * - Call AnalyticsService for data aggregation
 * - Return standardized responses
 *
 * Must NOT:
 * - Contain business logic
 * - Access database directly
 * - Perform data calculations
 */

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Get user performance overview
   */
  @Get('performance/:userId')
  async getUserPerformance(
    @Param('userId') userId: string,
  ): Promise<ApiResponse> {
    const result = await this.analyticsService.getUserPerformance(userId);
    return ResponseHelper.success(
      'Performance data retrieved successfully',
      result,
    );
  }

  /**
   * Get interview statistics
   */
  @Get('interviews/:interviewId')
  async getInterviewStats(
    @Param('interviewId') interviewId: string,
  ): Promise<ApiResponse> {
    const result = await this.analyticsService.getInterviewStats(interviewId);
    return ResponseHelper.success(
      'Interview statistics retrieved successfully',
      result,
    );
  }

  /**
   * Get improvement trends
   */
  @Get('trends/:userId')
  async getImprovementTrends(
    @Param('userId') userId: string,
  ): Promise<ApiResponse> {
    const result = await this.analyticsService.getImprovementTrends(userId);
    return ResponseHelper.success(
      'Improvement trends retrieved successfully',
      result,
    );
  }
}
