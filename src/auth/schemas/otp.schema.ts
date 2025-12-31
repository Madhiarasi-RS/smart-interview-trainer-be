import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * OTP Schema
 *
 * Temporary storage for OTP codes during authentication flows
 *
 * Fields:
 * - email: Email address linked to OTP
 * - otp: 6-digit numeric code
 * - purpose: Usage context (registration, password-reset)
 * - expiresAt: Expiration timestamp (TTL)
 * - isUsed: Whether OTP has been verified
 * - createdAt: OTP generation timestamp
 *
 * Security Rules:
 * - OTP expires after 5 minutes
 * - OTP is invalidated after successful verification
 * - One active OTP per email per purpose
 * - Old OTPs are automatically cleaned up via TTL index
 *
 * Usage:
 * - Register: Verify email during registration
 * - Forgot Password: Verify identity before password reset
 *
 * TTL Index:
 * - MongoDB automatically deletes expired OTPs
 * - Reduces manual cleanup logic
 */

export type OtpDocument = Otp & Document;

export enum OtpPurpose {
  REGISTRATION = 'registration',
  PASSWORD_RESET = 'password-reset',
  LOGIN_VERIFICATION = 'login-verification',
}

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  otp: string; // 6-digit numeric code

  @Prop({ required: true, enum: OtpPurpose })
  purpose: OtpPurpose;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  isUsed: boolean;

  @Prop()
  createdAt?: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

// Indexes
OtpSchema.index({ email: 1, purpose: 1 });
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-cleanup
