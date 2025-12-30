import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiResponse } from './common/response/api-response.interface';
import { ResponseHelper } from './common/response/api-response.helper';

/**
 * App Service
 *
 * Root service for infrastructure health checks
 *
 * NO business logic
 * NO feature services (auth, interviews, etc.)
 */

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Basic health check
   */
  getHealth(): ApiResponse {
    return ResponseHelper.success(
      'Smart Interview Trainer Backend is running',
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
      },
    );
  }

  /**
   * Detailed health check with infrastructure status
   */
  getDetailedHealth(): ApiResponse {
    const nodeEnv = this.configService.get<string>('app.nodeEnv');
    const port = this.configService.get<number>('app.port');
    const mongoUri = this.configService.get<string>('database.mongoUri');
    const geminiConfigured = !!this.configService.get<string>('gemini.apiKey');

    return ResponseHelper.success('Infrastructure status', {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: nodeEnv,
      port,
      infrastructure: {
        database: {
          type: 'MongoDB',
          connected: !!mongoUri,
        },
        ai: {
          provider: 'Gemini',
          configured: geminiConfigured,
        },
        config: {
          loaded: true,
          global: true,
        },
      },
    });
  }
}
