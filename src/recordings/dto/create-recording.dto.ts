import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsEnum,
  Min,
} from 'class-validator';
import { RecordingStatus } from '../enums/recording-status.enum';

/**
 * Create Recording DTO
 *
 * Validates metadata for interview recording submission
 *
 * Validation Rules:
 * - interviewId: Required string (references interview session)
 * - userId: Required string (references user who recorded)
 * - durationSeconds: Required positive number
 * - hasVideo: Required boolean flag
 * - hasAudio: Required boolean flag
 * - recordingStatus: Must be valid RecordingStatus enum
 *
 * NO actual file handling:
 * - This DTO accepts metadata only
 * - Actual media files handled separately (future implementation)
 */

export class CreateRecordingDto {
  @IsString()
  @IsNotEmpty({ message: 'Interview ID is required' })
  interviewId: string;

  @IsString()
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @IsNumber()
  @Min(1, { message: 'Duration must be at least 1 second' })
  durationSeconds: number;

  @IsBoolean()
  hasVideo: boolean;

  @IsBoolean()
  hasAudio: boolean;

  @IsEnum(RecordingStatus, {
    message: 'Recording status must be either COMPLETED or STOPPED_EARLY',
  })
  @IsNotEmpty()
  recordingStatus: RecordingStatus;
}
