import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Configuration
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import geminiConfig from './config/gemini.config';
import emailConfig from './config/email.config';
import jwtConfig from './config/jwt.config';

// Feature Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InterviewModule } from './interviews/interview.module';
import { QuestionModule } from './questions/question.module';
import { RecordingModule } from './recordings/recording.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ScorecardModule } from './scorecard/scorecard.module';

/**
 * App Module
 *
 * Root module of the Smart Interview Trainer Backend
 *
 * Architecture:
 * - ConfigModule loaded globally with typed configuration
 * - MongoDB connection via MongooseModule with async ConfigService
 * - Feature modules for business logic (auth, interviews, etc.)
 * - Clean separation of concerns
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
 */

@Module({
  imports: [
    // Global Configuration Module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, geminiConfig, emailConfig, jwtConfig],
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

    // Feature Modules
    AuthModule,
    UsersModule,
    InterviewModule,
    QuestionModule,
    RecordingModule,
    AnalyticsModule,
    ScorecardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
