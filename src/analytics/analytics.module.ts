import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

/**
 * Analytics Module
 *
 * Provides performance analytics and insights functionality
 *
 * Future Integrations:
 * - ScorecardModule for evaluation data
 * - MongoDB for data aggregation
 */

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
