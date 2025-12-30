import { Module } from '@nestjs/common';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { InterviewGateway } from './interview.gateway';

/**
 * Interview Module
 *
 * Provides interview session management and real-time communication
 *
 * Future Integrations:
 * - QuestionsModule for question generation
 * - RecordingsModule for audio/video storage
 * - ScorecardModule for evaluation
 * - AI Module for Gemini integration
 */

@Module({
  imports: [
    // TODO: Import QuestionsModule
    // TODO: Import RecordingsModule
    // TODO: Import ScorecardModule
  ],
  controllers: [InterviewController],
  providers: [InterviewService, InterviewGateway],
  exports: [InterviewService, InterviewGateway],
})
export class InterviewModule {}
