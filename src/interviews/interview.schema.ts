import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Interview Difficulty Enum
 */
export enum InterviewDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

/**
 * Interview Duration Enum
 */
export enum InterviewDuration {
  FIFTEEN_MIN = '15M',
  THIRTY_MIN = '30M',
  SIXTY_MIN = '60M',
}

/**
 * Interview Status Enum
 * 
 * Lifecycle:
 * CREATED → IN_PROGRESS → COMPLETED
 */
export enum InterviewStatus {
  CREATED = 'CREATED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

/**
 * Interview Session Schema
 *
 * Manages interview session lifecycle and state
 *
 * Responsibilities:
 * - Track session state transitions
 * - Store session metadata (domain, difficulty, duration)
 * - Reference user by ID
 * - Track timing (start, completion)
 *
 * NO AI logic
 * NO WebSocket logic
 * NO media storage
 * NO question generation logic
 */

export type InterviewDocument = Interview & Document;

@Schema({ timestamps: true })
export class Interview {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  domain!: string;

  @Prop({ required: true, enum: InterviewDifficulty })
  difficulty!: InterviewDifficulty;

  @Prop({ required: true, enum: InterviewDuration })
  duration!: InterviewDuration;

  @Prop({ required: true, enum: InterviewStatus, default: InterviewStatus.CREATED })
  status!: InterviewStatus;

  @Prop({ type: Date, default: null })
  startedAt!: Date | null;

  @Prop({ type: Date, default: null })
  completedAt!: Date | null;

  // Mongoose automatically adds:
  // createdAt: Date
  // updatedAt: Date
}

export const InterviewSchema = SchemaFactory.createForClass(Interview);

// Create indexes for performance
InterviewSchema.index({ userId: 1, createdAt: -1 });
InterviewSchema.index({ status: 1 });
