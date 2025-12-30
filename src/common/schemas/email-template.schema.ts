import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Email Template Schema
 *
 * Stores reusable email templates in MongoDB
 *
 * Template Variables:
 * - Use {{variableName}} syntax for placeholders
 * - Example: "Your OTP is {{otp}}"
 *
 * Template Types:
 * - otp-verification: OTP email for login
 * - welcome: Welcome email for new users
 * - interview-reminder: Interview session reminder
 * - scorecard-ready: Scorecard completion notification
 *
 * Usage:
 * - Fetch template by name
 * - Replace placeholders with actual values
 * - Send via email service
 */

export type EmailTemplateDocument = EmailTemplate & Document;

@Schema({ timestamps: true })
export class EmailTemplate {
  @Prop({ required: true, unique: true })
  name: string; // e.g., 'otp-verification', 'welcome'

  @Prop({ required: true })
  subject: string; // Email subject line with placeholder support

  @Prop({ required: true })
  htmlBody: string; // HTML email body with {{variable}} placeholders

  @Prop()
  textBody?: string; // Plain text fallback (optional)

  @Prop({ default: true })
  isActive: boolean; // Enable/disable template

  @Prop()
  description?: string; // Admin notes about template usage
}

export const EmailTemplateSchema =
  SchemaFactory.createForClass(EmailTemplate);

/**
 * Template Variable Replacement
 *
 * Replace {{variableName}} with actual values
 *
 * Example:
 * Template: "Your OTP is {{otp}}. Valid for {{expiryMinutes}} minutes."
 * Variables: { otp: "123456", expiryMinutes: "5" }
 * Result: "Your OTP is 123456. Valid for 5 minutes."
 */
export function replaceTemplateVariables(
  template: string,
  variables: Record<string, string | number>,
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(placeholder, String(value));
  }
  return result;
}
