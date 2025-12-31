import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * User Schema
 *
 * Stores user authentication and profile data
 *
 * Fields:
 * - name: User's full name
 * - email: Unique email address (login identifier)
 * - password: Bcrypt hashed password (NEVER store plaintext)
 * - isEmailVerified: Email verification status
 * - createdAt: Account creation timestamp
 * - updatedAt: Last update timestamp
 *
 * Security:
 * - Password is hashed using bcrypt before storage
 * - Email must be unique (enforced by index)
 * - No sensitive data in plain text
 *
 * Usage:
 * - Register: Create new user with hashed password
 * - Login: Validate email + password
 * - Reset Password: Update password hash
 */

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string; // Bcrypt hashed password

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for performance
UserSchema.index({ email: 1 }, { unique: true });
