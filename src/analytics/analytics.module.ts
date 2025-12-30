import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

/**
 * Analytics Module
 *
 * Provides aggregated insights and performance analytics for students
 *
 * Components:
 * - AnalyticsController: Read-only GET APIs for analytics data
 * - AnalyticsService: Data aggregation and computation logic
 *
 * Features:
 * - Analytics overview (total interviews, avg score, best interviews, weaknesses)
 * - Filler words aggregation across all interviews
 * - Improvement timeline with trend analysis
 * - Rule-based trend detection (improving/declining/stable)
 *
 * Data Sources (Future):
 * - InterviewRepository for interview data
 * - ScorecardRepository for evaluation data
 * - MongoDB aggregation pipelines
 *
 * Current State:
 * - Uses mock/placeholder data for testing
 * - Ready for repository integration
 * - Clean controller-service separation
 */

@Module({
  imports: [],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
