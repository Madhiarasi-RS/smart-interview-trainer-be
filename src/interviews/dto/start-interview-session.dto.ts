import { IsString, IsNotEmpty } from 'class-validator';

/**
 * Start Interview Session DTO
 *
 * Payload for starting a WebSocket interview session
 *
 * Used for:
 * - Initiating real-time interview monitoring
 * - Linking WebSocket connection to specific interview session
 * - Triggering mock feedback emission
 */
export class StartInterviewSessionDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
