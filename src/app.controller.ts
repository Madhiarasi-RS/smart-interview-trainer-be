import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from './common/response/api-response.interface';

/**
 * App Controller
 *
 * Root controller for infrastructure health checks only
 *
 * Endpoints:
 * - GET / - Health check
 * - GET /health - Detailed health status
 *
 * NO business logic
 * NO feature endpoints (auth, interviews, etc.)
 */

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Root endpoint - Basic health check
   */
  @Get()
  getHealth(): ApiResponse {
    return this.appService.getHealth();
  }

  /**
   * Detailed health check with infrastructure status
   */
  @Get('health')
  getDetailedHealth(): ApiResponse {
    return this.appService.getDetailedHealth();
  }
}
