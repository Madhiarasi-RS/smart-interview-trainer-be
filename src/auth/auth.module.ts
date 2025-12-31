import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from './schemas/user.schema';
import { Otp, OtpSchema } from './schemas/otp.schema';
import { EmailService } from '../common/services/email.service';
import {
  EmailTemplate,
  EmailTemplateSchema,
} from '../common/schemas/email-template.schema';

/**
 * Auth Module
 *
 * Complete authentication module with:
 * - Registration with OTP verification
 * - Login with email + password
 * - Forgot password with OTP
 * - Password reset
 * - Logout
 *
 * Features:
 * - JWT authentication with HTTP-only cookies
 * - Bcrypt password hashing
 * - OTP storage in MongoDB with TTL
 * - Email sending via EmailService
 * - Standard API response wrapper
 *
 * Schemas:
 * - User: User accounts with hashed passwords
 * - OTP: Temporary OTP codes with expiry
 * - EmailTemplate: Email templates from MongoDB
 *
 * Services:
 * - AuthService: Authentication business logic
 * - EmailService: Email sending with templates
 * - JwtService: JWT token generation
 *
 * Security:
 * - Passwords never stored in plaintext
 * - OTPs expire after 5 minutes
 * - JWT tokens in HTTP-only cookies
 * - CSRF protection with sameSite: strict
 */

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: EmailTemplate.name, schema: EmailTemplateSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn') || '7d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
  exports: [AuthService],
})
export class AuthModule {}
