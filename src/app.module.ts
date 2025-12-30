import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Configuration
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import geminiConfig from './config/gemini.config';

/**
 * App Module
 *
 * Root module of the Smart Interview Trainer Backend
 *
 * Phase 1: Core Infrastructure Only
 *
 * Architecture:
 * - ConfigModule loaded globally with typed configuration
 * - MongoDB connection via MongooseModule with async ConfigService
 * - NO feature modules yet (auth, interviews, etc.)
 * - NO business logic
 * - Minimal controllers/services for health checks only
 *
 * Configuration Files:
 * - src/config/app.config.ts - Application settings (NODE_ENV, PORT)
 * - src/config/database.config.ts - Database connection (MONGO_URI)
 * - src/config/gemini.config.ts - AI integration (GEMINI_API_KEY)
 *
 * Global Providers (registered in main.ts):
 * - HttpExceptionFilter, AllExceptionsFilter
 * - ValidationPipe with strict rules
 * - LoggingInterceptor
 *
 * Rules Enforced:
 * - NO process.env direct access (use ConfigService)
 * - NO hardcoded secrets
 * - Strong typing required
 * - NO business logic in this module
 */

@Module({
  imports: [
    // Global Configuration Module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, geminiConfig],
      envFilePath: '.env',
      cache: true,
      expandVariables: true,
    }),

    // MongoDB Connection (async with ConfigService)
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.mongoUri'),
        retryAttempts: configService.get<number>(
          'database.mongoOptions.retryAttempts',
        ),
        retryDelay: configService.get<number>(
          'database.mongoOptions.retryDelay',
        ),
      }),
    }),

    // Feature Modules will be added in Phase 2+
    // (auth, users, interviews, questions, recordings, analytics, scorecard)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
