import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InterviewRepository } from './interview.repository';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewStatusDto } from './dto/update-interview-status.dto';
import { InterviewDocument, InterviewStatus } from './interview.schema';

/**
 * Interview Service
 *
 * Manages interview session lifecycle and state transitions
 *
 * Responsibilities:
 * - Create new interview sessions
 * - Validate and execute state transitions
 * - Enforce business rules (e.g., can't skip states)
 * - Retrieve interview data
 *
 * State transition rules:
 * - CREATED → IN_PROGRESS (sets startedAt)
 * - IN_PROGRESS → COMPLETED (sets completedAt)
 * - Invalid transitions rejected with BadRequestException
 *
 * NO AI logic
 * NO WebSocket logic
 * NO media processing
 * Pure session state management only
 */

@Injectable()
export class InterviewService {
  private readonly logger = new Logger(InterviewService.name);

  constructor(private readonly interviewRepository: InterviewRepository) {}

  /**
   * Create new interview session
   *
   * @param createInterviewDto - Interview creation data
   * @returns Created interview document
   */
  async createInterview(
    createInterviewDto: CreateInterviewDto,
  ): Promise<InterviewDocument> {
    this.logger.log(
      `Creating interview for user ${createInterviewDto.userId} in domain ${createInterviewDto.domain}`,
    );

    const interview =
      await this.interviewRepository.createSession(createInterviewDto);

    this.logger.log(`Interview created with ID: ${interview._id}`);
    return interview;
  }

  /**
   * Update interview status with state transition validation
   *
   * Valid transitions:
   * - CREATED → IN_PROGRESS (sets startedAt to current time)
   * - IN_PROGRESS → COMPLETED (sets completedAt to current time)
   *
   * @param id - Interview ID
   * @param updateInterviewStatusDto - Status update data
   * @returns Updated interview document
   * @throws NotFoundException if interview not found
   * @throws BadRequestException if invalid state transition
   */
  async updateInterviewStatus(
    id: string,
    updateInterviewStatusDto: UpdateInterviewStatusDto,
  ): Promise<InterviewDocument> {
    const interview = await this.interviewRepository.findById(id);

    if (!interview) {
      throw new NotFoundException(`Interview with ID ${id} not found`);
    }

    const currentStatus = interview.status;
    const newStatus = updateInterviewStatusDto.status;

    // Validate state transition
    this.validateStateTransition(currentStatus, newStatus);

    // Prepare timestamp updates
    const timestamps: { startedAt?: Date; completedAt?: Date } = {};

    if (newStatus === InterviewStatus.IN_PROGRESS) {
      timestamps.startedAt = new Date();
      this.logger.log(`Starting interview ${id} at ${timestamps.startedAt}`);
    }

    if (newStatus === InterviewStatus.COMPLETED) {
      timestamps.completedAt = new Date();
      this.logger.log(`Completing interview ${id} at ${timestamps.completedAt}`);
    }

    const updatedInterview = await this.interviewRepository.updateStatus(
      id,
      newStatus,
      timestamps,
    );

    if (!updatedInterview) {
      throw new NotFoundException(
        `Interview with ID ${id} not found during update`,
      );
    }

    this.logger.log(
      `Interview ${id} status updated: ${currentStatus} → ${newStatus}`,
    );

    return updatedInterview;
  }

  /**
   * Get all interviews for a user
   *
   * @param userId - User ID
   * @returns Array of interview documents
   */
  async getUserInterviews(userId: string): Promise<InterviewDocument[]> {
    this.logger.log(`Fetching interviews for user ${userId}`);
    return this.interviewRepository.findByUserId(userId);
  }

  /**
   * Get interview by ID
   *
   * @param id - Interview ID
   * @returns Interview document
   * @throws NotFoundException if interview not found
   */
  async getInterviewById(id: string): Promise<InterviewDocument> {
    const interview = await this.interviewRepository.findById(id);

    if (!interview) {
      throw new NotFoundException(`Interview with ID ${id} not found`);
    }

    return interview;
  }

  /**
   * Validate interview state transition
   *
   * Allowed transitions:
   * - CREATED → IN_PROGRESS
   * - IN_PROGRESS → COMPLETED
   *
   * @param currentStatus - Current interview status
   * @param newStatus - Desired new status
   * @throws BadRequestException if transition is invalid
   */
  private validateStateTransition(
    currentStatus: InterviewStatus,
    newStatus: InterviewStatus,
  ): void {
    // Allow idempotent operations (same status)
    if (currentStatus === newStatus) {
      this.logger.warn(
        `Interview already in ${newStatus} state - idempotent operation`,
      );
      return;
    }

    // Define allowed transitions
    const allowedTransitions: Record<InterviewStatus, InterviewStatus[]> = {
      [InterviewStatus.CREATED]: [InterviewStatus.IN_PROGRESS],
      [InterviewStatus.IN_PROGRESS]: [InterviewStatus.COMPLETED],
      [InterviewStatus.COMPLETED]: [], // No transitions allowed from COMPLETED
    };

    const validNextStates = allowedTransitions[currentStatus];

    if (!validNextStates.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid state transition: ${currentStatus} → ${newStatus}. ` +
          `Allowed transitions from ${currentStatus}: ${validNextStates.length > 0 ? validNextStates.join(', ') : 'none'}`,
      );
    }
  }
}
