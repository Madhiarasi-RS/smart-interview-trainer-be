import { IsEnum, IsString, IsNotEmpty } from 'class-validator';

/**
 * Feedback Type Enum
 *
 * Defines types of real-time feedback during interview sessions
 */
export enum FeedbackType {
  PACE = 'PACE',
  FILLER = 'FILLER',
  CONFIDENCE = 'CONFIDENCE',
  RELEVANCE = 'RELEVANCE',
}

/**
 * Feedback Severity Enum
 *
 * Defines severity levels for feedback messages
 */
export enum FeedbackSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

/**
 * Feedback Event DTO
 *
 * Payload for real-time feedback events emitted to clients
 *
 * Used for:
 * - Real-time behavioral feedback during interviews
 * - Communication pattern analysis
 * - Performance indicators
 */
export class FeedbackEventDto {
  @IsEnum(FeedbackType, {
    message: 'Type must be one of: PACE, FILLER, CONFIDENCE, RELEVANCE',
  })
  @IsNotEmpty()
  type: FeedbackType;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(FeedbackSeverity, {
    message: 'Severity must be one of: LOW, MEDIUM, HIGH',
  })
  @IsNotEmpty()
  severity: FeedbackSeverity;

  @IsString()
  @IsNotEmpty()
  timestamp: string;
}
