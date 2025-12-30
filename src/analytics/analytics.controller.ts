import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ResponseHelper, ApiResponse } from '../common/utils/response.helper';

/**
 * Analytics Controller
 *
 * Responsibilities:
 * - Expose read-only GET APIs for analytics data
 * - Validate input (userId as param)
 * - Call AnalyticsService for aggregation
 * - Return standardized API responses
 *
 * Endpoints:
 * - GET /analytics/overview/:userId - Comprehensive analytics overview
 * - GET /analytics/filler-words/:userId - Filler words aggregation
 * - GET /analytics/improvement-timeline/:userId - Performance timeline
 *
 * Must NOT:
 * - Contain business logic (use AnalyticsService)
 * - Access database directly
 * - Perform calculations
 * - Call external APIs
 *
 * Future: Replace userId param with authenticated session context
 */

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Get analytics overview
   *
   * Returns:
   * - Total interviews
   * - Average final score
   * - Best performing interviews (top 3)
   * - Top weaknesses (lowest 2 categories)
   * - Recent trend (improving/declining/stable)
   *
   * @param userId - User ID (placeholder for authentication)
   * @returns Analytics overview
   */
  @Get('overview/:userId')
  async getAnalyticsOverview(
    @Param('userId') userId: string,
  ): Promise<ApiResponse> {
    const overview = await this.analyticsService.getAnalyticsOverview(userId);
    return ResponseHelper.success(
      'Analytics overview retrieved successfully',
      overview,
    );
  }

  /**
   * Get filler words analytics
   *
   * Returns:
   * - Total filler words across all interviews
   * - Most common filler words with counts
   * - Average filler words per interview
   *
   * @param userId - User ID (placeholder for authentication)
   * @returns Filler words analytics
   */
  @Get('filler-words/:userId')
  async getFillerWordsAnalytics(
    @Param('userId') userId: string,
  ): Promise<ApiResponse> {
    const fillerWords =
      await this.analyticsService.getFillerWordsAnalytics(userId);
    return ResponseHelper.success(
      'Filler words analytics retrieved successfully',
      fillerWords,
    );
  }

  /**
   * Get improvement timeline
   *
   * Returns:
   * - Chronological list of interviews with scores
   * - Overall trend (improving/declining/stable)
   * - Score improvement (last vs first)
   *
   * @param userId - User ID (placeholder for authentication)
   * @returns Improvement timeline
   */
  @Get('improvement-timeline/:userId')
  async getImprovementTimeline(
    @Param('userId') userId: string,
  ): Promise<ApiResponse> {
    const timeline =
      await this.analyticsService.getImprovementTimeline(userId);
    return ResponseHelper.success(
      'Improvement timeline retrieved successfully',
      timeline,
    );
  }
}

