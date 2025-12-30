import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';

/**
 * Questions Module
 *
 * Provides question generation and management functionality
 *
 * Future Integrations:
 * - AI Module for Gemini-powered question generation
 * - MongoDB for question bank storage
 */

@Module({
  imports: [
    // TODO: Import AI Module for question generation
  ],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
