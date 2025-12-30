import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Interview, InterviewDocument, InterviewStatus } from './interview.schema';
import { CreateInterviewDto } from './dto/create-interview.dto';

/**
 * Interview Repository
 *
 * Abstracts data persistence layer for interview sessions
 *
 * Responsibilities:
 * - Create interview sessions
 * - Update interview status and timestamps
 * - Fetch interviews by ID or user ID
 * - Query interview data
 *
 * NO business logic
 * NO validation logic (handled by service)
 * NO controller logic
 *
 * Pure data access operations only
 */

@Injectable()
export class InterviewRepository {
  constructor(
    @InjectModel(Interview.name)
    private readonly interviewModel: Model<InterviewDocument>,
  ) {}

  /**
   * Create new interview session
   *
   * @param createInterviewDto - Interview creation data
   * @returns Created interview document
   */
  async createSession(
    createInterviewDto: CreateInterviewDto,
  ): Promise<InterviewDocument> {
    const interview = new this.interviewModel({
      ...createInterviewDto,
      status: InterviewStatus.CREATED,
      startedAt: null,
      completedAt: null,
    });

    return interview.save();
  }

  /**
   * Find interview by ID
   *
   * @param id - Interview ID
   * @returns Interview document or null
   */
  async findById(id: string): Promise<InterviewDocument | null> {
    return this.interviewModel.findById(id).exec();
  }

  /**
   * Find all interviews for a user
   *
   * @param userId - User ID
   * @returns Array of interview documents
   */
  async findByUserId(userId: string): Promise<InterviewDocument[]> {
    return this.interviewModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Update interview status
   *
   * @param id - Interview ID
   * @param status - New status
   * @param timestamps - Optional timestamp updates
   * @returns Updated interview document or null
   */
  async updateStatus(
    id: string,
    status: InterviewStatus,
    timestamps?: { startedAt?: Date; completedAt?: Date },
  ): Promise<InterviewDocument | null> {
    const updateData: Record<string, unknown> = { status };

    if (timestamps?.startedAt) {
      updateData.startedAt = timestamps.startedAt;
    }

    if (timestamps?.completedAt) {
      updateData.completedAt = timestamps.completedAt;
    }

    return this.interviewModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .exec();
  }
}
