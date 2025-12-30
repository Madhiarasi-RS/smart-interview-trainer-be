import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import {
  HttpExceptionFilter,
  AllExceptionsFilter,
} from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

/**
 * Bootstrap function
 *
 * Initializes the NestJS application with:
 * - ConfigService for environment-based configuration
 * - Global validation pipes with strict rules
 * - Exception filters for standardized error responses
 * - Logging interceptors
 * - CORS configuration from environment
 *
 * NO hardcoded values - all configuration from ConfigService
 */

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Create NestJS application
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Get ConfigService
  const configService = app.get(ConfigService);

  // Enable CORS (environment-based)
  const frontendUrl = configService.get<string>('app.frontendUrl');
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  logger.log(`CORS enabled for origin: ${frontendUrl}`);

  // Global API prefix (if configured)
  const apiPrefix = configService.get<string>('app.apiPrefix');
  if (apiPrefix) {
    app.setGlobalPrefix(apiPrefix);
    logger.log(`Global API prefix set to: /${apiPrefix}`);
  }

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTO
      forbidNonWhitelisted: true, // Throw error if extra properties
      transform: true, // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert string to number, etc.
      },
    }),
  );

  logger.log('Global validation pipe enabled');

  // Global exception filters
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  logger.log('Global exception filters registered');

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  logger.log('Global logging interceptor enabled');

  // Start server
  const port = configService.get<number>('app.port') ?? 3001;
  const nodeEnv = configService.get<string>('app.nodeEnv') ?? 'development';

  await app.listen(port);

  logger.log(`🚀 Smart Interview Trainer Backend running on port ${port}`);
  logger.log(`📝 Environment: ${nodeEnv}`);
  logger.log(`🌐 API: http://localhost:${port}${apiPrefix ? '/' + apiPrefix : ''}`);
}

void bootstrap();
