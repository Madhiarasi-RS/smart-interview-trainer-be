import { registerAs } from '@nestjs/config';

/**
 * Application Configuration
 * 
 * Centralized configuration for application-level settings
 * All environment variables are validated and typed here
 * 
 * NO direct process.env usage outside this file
 */

export interface AppConfig {
  nodeEnv: string;
  port: number;
  frontendUrl: string;
  apiPrefix: string;
}

export default registerAs('app', (): AppConfig => {
  // Validate required environment variables
  const nodeEnv = process.env.NODE_ENV || 'development';
  const port = parseInt(process.env.PORT || '3001', 10);
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const apiPrefix = process.env.API_PREFIX || 'api';

  // Validate port is a valid number
  if (isNaN(port) || port < 0 || port > 65535) {
    throw new Error('Invalid PORT environment variable');
  }

  return {
    nodeEnv,
    port,
    frontendUrl,
    apiPrefix,
  };
});
