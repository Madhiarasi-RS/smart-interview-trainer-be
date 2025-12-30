import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from '../common/services/email.service';
import {
  EmailTemplate,
  EmailTemplateSchema,
} from '../common/schemas/email-template.schema';

/**
 * Auth Module
 *
 * Provides authentication and authorization functionality
 *
 * Features:
 * - OTP-based login
 * - Email verification
 * - Template-based emails from MongoDB
 *
 * Dependencies:
 * - EmailService for sending OTP emails
 * - EmailTemplate schema for template storage
 *
 * Future Integrations:
 * - JwtModule for token management
 * - PassportModule for authentication strategies
 * - UsersModule for user operations
 */

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailTemplate.name, schema: EmailTemplateSchema },
    ]),
    // TODO: Add JwtModule configuration
    // TODO: Add PassportModule configuration
    // TODO: Import UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
  exports: [AuthService],
})
export class AuthModule {}
