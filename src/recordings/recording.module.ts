import { Module } from '@nestjs/common';
import { RecordingService } from './recording.service';

/**
 * Recordings Module
 *
 * Provides recording storage and management functionality
 *
 * Future Integrations:
 * - Cloud storage service (AWS S3, Google Cloud Storage)
 * - MongoDB for metadata
 */

@Module({
  providers: [RecordingService],
  exports: [RecordingService],
})
export class RecordingModule {}
