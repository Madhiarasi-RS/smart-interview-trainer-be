import { registerAs } from '@nestjs/config';

/**
 * Email Configuration
 *
 * Centralized configuration for email service (Nodemailer)
 *
 * Supports:
 * - Gmail SMTP
 * - Custom SMTP servers
 * - OAuth2 authentication (optional)
 *
 * Environment Variables Required:
 * - EMAIL_HOST (e.g., smtp.gmail.com)
 * - EMAIL_PORT (e.g., 587 for TLS, 465 for SSL)
 * - EMAIL_USER (sender email address)
 * - EMAIL_PASSWORD (app password for Gmail)
 * - EMAIL_FROM (from address, defaults to EMAIL_USER)
 *
 * Gmail Setup:
 * 1. Enable 2FA on Google account
 * 2. Generate App Password: https://myaccount.google.com/apppasswords
 * 3. Use app password (not regular password)
 *
 * NO direct process.env usage outside this file
 */

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean; // true for 465, false for other ports
  auth: {
    user: string;
    pass: string;
  };
  from: string; // Default sender address
}

export default registerAs('email', (): EmailConfig => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;
  const from = process.env.EMAIL_FROM || user;

  // Validate required fields
  if (!user || !pass) {
    console.warn(
      'WARNING: EMAIL_USER and EMAIL_PASSWORD not configured - Email service will fail',
    );
  }

  return {
    host,
    port,
    secure: port === 465, // true for 465, false for other ports (587, etc.)
    auth: {
      user: user || '',
      pass: pass || '',
    },
    from: from || 'noreply@smart-interview-trainer.com',
  };
});
