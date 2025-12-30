import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

/**
 * Auth Module
 *
 * Provides authentication and authorization functionality
 *
 * Future Integrations:
 * - JwtModule for token management
 * - PassportModule for authentication strategies
 * - UsersModule for user operations
 */

@Module({
  imports: [
    // TODO: Add JwtModule configuration
    // TODO: Add PassportModule configuration
    // TODO: Import UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
