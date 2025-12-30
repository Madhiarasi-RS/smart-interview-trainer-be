import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { GeminiIntegration } from '../integrations/gemini.integration';

/**
 * Question Module
 *
 * Provides AI-powered question generation functionality
 *
 * Components:
 * - QuestionController: API endpoints for question generation
 * - QuestionService: Business logic for prompt building and duration mapping
 * - GeminiIntegration: Stub wrapper for Gemini AI (mock responses for now)
 *
 * Features:
 * - Generate questions by domain, difficulty, duration
 * - Duration-based question count mapping (15/30/60 min)
 * - MCQ vs Descriptive question types
 * - Comprehensive prompt building for AI
 *
 * Future Enhancements:
 * - Question bank storage in MongoDB
 * - Question caching and reuse
 * - Custom question templates
 * - Real Gemini API integration (replace stub)
 */

@Module({
  imports: [],
  controllers: [QuestionController],
  providers: [QuestionService, GeminiIntegration],
  exports: [QuestionService],
})
export class QuestionModule {}
