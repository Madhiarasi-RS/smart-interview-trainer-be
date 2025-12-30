import { RecordingStatus } from '../enums/recording-status.enum';

/**
 * Recording Response DTO
 *
 * Represents the response structure for recording metadata
 *
 * Contains:
 * - recordingId: Unique identifier for the recording
 * - interviewId: Reference to interview session
 * - userId: Reference to user
 * - durationSeconds: Recording duration
 * - hasVideo: Video presence flag
 * - hasAudio: Audio presence flag
 * - recordingStatus: Completion status
 * - createdAt: Timestamp when recording was submitted
 *
 * Future fields (when media processing is implemented):
 * - mediaUrl: URL to stored media file
 * - processingStatus: Status of media processing pipeline
 * - transcriptUrl: URL to generated transcript
 */

export class RecordingResponseDto {
  recordingId: string;
  interviewId: string;
  userId: string;
  durationSeconds: number;
  hasVideo: boolean;
  hasAudio: boolean;
  recordingStatus: RecordingStatus;
  createdAt: string;
}
