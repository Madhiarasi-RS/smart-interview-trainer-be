import { Module } from '@nestjs/common';
import { ScorecardController } from './scorecard.controller';
import { ScorecardService } from './scorecard.service';

/**
 * Scorecard Module
 *
 * Provides interview evaluation and scoring functionality
 *
 * Components:
 * - ScorecardController: API endpoint for scorecard generation
 * - ScorecardService: Score computation and feedback generation
 *
 * Features:
 * - Accepts structured AI analysis results
 * - Computes communication, domain fit, confidence, and relevance scores
 * - Generates final score (0-40)
 * - Rule-based strengths/weaknesses identification
 * - Actionable improvement suggestions
 *
 * Future Enhancements:
 * - MongoDB schema for scorecard persistence
 * - Historical score tracking and analytics
 * - Advanced ML-based feedback
 * - Comparative analysis across interviews
 */

@Module({
  imports: [],
  controllers: [ScorecardController],
  providers: [ScorecardService],
  exports: [ScorecardService],
})
export class ScorecardModule {}
