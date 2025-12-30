import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * User Role Enum
 * 
 * Single role support for Smart Interview Trainer
 */
export enum UserRole {
  STUDENT = 'STUDENT',
}

/**
 * User Schema
 *
 * Defines the user entity structure for MongoDB
 *
 * Responsibilities:
 * - Store user profile data
 * - Track domain preferences
 * - Reference interview history by ID
 *
 * NO authentication data (handled by auth module)
 * NO embedded interview documents
 * NO scorecard logic
 */

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.STUDENT })
  role!: UserRole;

  @Prop({ type: [String], default: [] })
  selectedDomains!: string[];

  @Prop({ type: [String], default: [] })
  interviewIds!: string[];

  // Mongoose will automatically add:
  // createdAt: Date
  // updatedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create indexes for performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ createdAt: -1 });
