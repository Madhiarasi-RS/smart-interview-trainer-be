import { IsEnum, IsNotEmpty } from 'class-validator';
import { InterviewStatus } from '../interview.schema';

/**
 * Update Interview Status DTO
 *
 * Validates interview status update request
 *
 * Rules:
 * - status must be a valid InterviewStatus enum value
 * - status is required
 *
 * Allowed transitions (validated in service):
 * - CREATED → IN_PROGRESS
 * - IN_PROGRESS → COMPLETED
 */

export class UpdateInterviewStatusDto {
  @IsEnum(InterviewStatus, {
    message: 'Status must be CREATED, IN_PROGRESS, or COMPLETED',
  })
  @IsNotEmpty({ message: 'Status is required' })
  status!: InterviewStatus;
}
