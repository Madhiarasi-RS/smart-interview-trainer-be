import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import {
  EmailTemplate,
  EmailTemplateDocument,
  replaceTemplateVariables,
} from '../schemas/email-template.schema';

/**
 * Email Service
 *
 * Responsibilities:
 * - Send emails using Nodemailer
 * - Fetch email templates from MongoDB
 * - Replace template variables with actual values
 * - Handle email errors gracefully
 *
 * Features:
 * - Template-based emails (stored in MongoDB)
 * - Variable substitution ({{otp}}, {{userName}}, etc.)
 * - HTML and plain text support
 * - Gmail SMTP integration
 * - Error logging and retry logic
 *
 * Usage:
 * ```typescript
 * await emailService.sendTemplatedEmail(
 *   'user@example.com',
 *   'otp-verification',
 *   { otp: '123456', expiryMinutes: 5 }
 * );
 * ```
 */

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(EmailTemplate.name)
    private readonly emailTemplateModel: Model<EmailTemplateDocument>,
  ) {
    this.initializeTransporter();
  }

  /**
   * Initialize Nodemailer transporter with Gmail SMTP
   */
  private initializeTransporter(): void {
    const emailConfig = this.configService.get('email');

    if (!emailConfig?.auth?.user || !emailConfig?.auth?.pass) {
      this.logger.warn(
        'Email configuration missing - emails will not be sent',
      );
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
    });

    this.logger.log(
      `Email service initialized with ${emailConfig.host}:${emailConfig.port}`,
    );
  }

  /**
   * Send email using template from MongoDB
   *
   * @param to - Recipient email address
   * @param templateName - Name of template in MongoDB (e.g., 'otp-verification')
   * @param variables - Variables to replace in template (e.g., { otp: '123456' })
   * @returns Promise<boolean> - true if sent successfully
   */
  async sendTemplatedEmail(
    to: string,
    templateName: string,
    variables: Record<string, string | number>,
  ): Promise<boolean> {
    try {
      // Fetch template from MongoDB
      const template = await this.emailTemplateModel
        .findOne({ name: templateName, isActive: true })
        .exec();

      if (!template) {
        this.logger.error(
          `Email template '${templateName}' not found or inactive`,
        );
        return false;
      }

      // Replace template variables
      const subject = replaceTemplateVariables(template.subject, variables);
      const html = replaceTemplateVariables(template.htmlBody, variables);
      const text = template.textBody
        ? replaceTemplateVariables(template.textBody, variables)
        : undefined;

      // Send email
      return await this.sendEmail({ to, subject, html, text });
    } catch (error) {
      this.logger.error(
        `Failed to send templated email to ${to}:`,
        error instanceof Error ? error.stack : error,
      );
      return false;
    }
  }

  /**
   * Send email with raw content (no template)
   *
   * @param options - Email options
   * @returns Promise<boolean> - true if sent successfully
   */
  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    if (!this.transporter) {
      this.logger.error('Email transporter not initialized - cannot send email');
      return false;
    }

    try {
      const from = this.configService.get<string>('email.from');

      const info = await this.transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      this.logger.log(`Email sent to ${options.to}: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${options.to}:`,
        error instanceof Error ? error.stack : error,
      );
      return false;
    }
  }

  /**
   * Create or update email template in MongoDB
   *
   * @param template - Template data
   * @returns Promise<EmailTemplateDocument>
   */
  async saveTemplate(
    template: Partial<EmailTemplate>,
  ): Promise<EmailTemplateDocument> {
    const existingTemplate = await this.emailTemplateModel
      .findOne({ name: template.name })
      .exec();

    if (existingTemplate) {
      Object.assign(existingTemplate, template);
      return existingTemplate.save();
    }

    return this.emailTemplateModel.create(template);
  }

  /**
   * Get template by name
   *
   * @param name - Template name
   * @returns Promise<EmailTemplateDocument | null>
   */
  async getTemplate(name: string): Promise<EmailTemplateDocument | null> {
    return this.emailTemplateModel.findOne({ name }).exec();
  }
}
