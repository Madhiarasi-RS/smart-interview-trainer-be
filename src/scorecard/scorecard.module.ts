import { Module } from '@nestjs/common';
import { ScorecardService } from './scorecard.service';

/**
 * Scorecard Module
 *
 * Provides interview evaluation and scoring functionality
 *
 * Future Integrations:
 * - AI Module for intelligent evaluation
 * - MongoDB for score storage
 */

@Module({
  providers: [ScorecardService],
  exports: [ScorecardService],
})
export class ScorecardModule {}
