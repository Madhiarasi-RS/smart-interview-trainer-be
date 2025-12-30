import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Configuration
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import geminiConfig from './config/gemini.config';

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
 * - ConfigModule loaded globally with validation
 * - MongoDB connection via MongooseModule with ConfigService
 * - All feature modules registered
 * - No hardcoded values - everything from environment
 * 
 * Configuration Files:
 * - src/config/app.config.ts - Application settings
 * - src/config/database.config.ts - Database connection
 */

@Module({
  imports: [
    // Global Configuration Module
    ConfigModule.forRoot({
      isGlobal: true,, geminiConfig
      load: [appConfig, databaseConfig],
      envFilePath: '.env',
      cache: true,
    }),

    // MongoDB Connection (async with ConfigService)
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.mongoUri'),
        retryAttempts: configService.get<number>('database.mongoOptions.retryAttempts'),
        retryDelay: configService.get<number>('database.mongoOptions.retryDelay'),
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
