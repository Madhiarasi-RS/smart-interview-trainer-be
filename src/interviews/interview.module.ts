import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { InterviewRepository } from './interview.repository';
import { InterviewGateway } from './interview.gateway';
import { Interview, InterviewSchema } from './interview.schema';

/**
 * Interview Module
 *
 * Provides interview session lifecycle management and real-time communication
 *
 * Components:
 * - InterviewController: REST API endpoints for interview operations
 * - InterviewService: Business logic for state transitions
 * - InterviewRepository: Data access layer
 * - InterviewGateway: WebSocket gateway for real-time feedback
 * - Interview Schema: MongoDB schema with enums
 *
 * Features:
 * - Interview session CRUD operations
 * - State transition validation (CREATED → IN_PROGRESS → COMPLETED)
 * - Real-time WebSocket communication for behavioral feedback
 * - Mock feedback emission during active sessions
 *
 * Future Integrations:
 * - QuestionsModule for question generation
 * - RecordingsModule for audio/video storage
 * - ScorecardModule for evaluation
 * - Real Gemini AI integration for feedback
 */

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Interview.name, schema: InterviewSchema },
    ]),
  ],
  controllers: [InterviewController],
  providers: [InterviewService, InterviewRepository, InterviewGateway],
  exports: [InterviewService],
})
export class InterviewModule {}

