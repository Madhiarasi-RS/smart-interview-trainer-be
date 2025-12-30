import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './user.schema';

/**
 * Users Module
 *
 * Provides user profile management functionality
 *
 * Responsibilities:
 * - User CRUD operations
 * - Profile management
 * - Domain preference tracking
 * - Interview history references
 *
 * NO authentication logic (handled by AuthModule)
 * NO interview logic (handled by InterviewModule)
 *
 * Exports:
 * - UsersService (for other modules to access user data)
 */

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
