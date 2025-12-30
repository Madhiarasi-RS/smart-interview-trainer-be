import { Module } from '@nestjs/common';
import { RecordingController } from './recording.controller';
import { RecordingService } from './recording.service';

/**
 * Recording Module
 *
 * Provides recording metadata management functionality
 *
 * Components:
 * - RecordingController: API endpoints for recording operations
 * - RecordingService: Business logic for metadata storage
 *
 * Features:
 * - Recording metadata submission (STUB - no actual file handling)
 * - In-memory metadata storage (for testing)
 * - Metadata retrieval by recording ID, interview ID, or user ID
 * - Clean service contract for future media processing
 *
 * Future Enhancements:
 * - MongoDB schema for recording metadata persistence
 * - Cloud storage integration (AWS S3, Google Cloud Storage)
 * - File upload handling with multipart/form-data
 * - Media processing pipeline (transcoding, compression)
 * - Transcript generation service
 * - AI analysis integration
 */

@Module({
  imports: [],
  controllers: [RecordingController],
  providers: [RecordingService],
  exports: [RecordingService],
})
export class RecordingModule {}
