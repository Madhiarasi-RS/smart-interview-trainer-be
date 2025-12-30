import { registerAs } from '@nestjs/config';

/**
 * Database Configuration
 * 
 * Centralized configuration for MongoDB connection
 * All database-related environment variables managed here
 * 
 * NO direct process.env usage outside this file
 */

export interface DatabaseConfig {
  mongoUri: string;
  mongoOptions: {
    retryAttempts: number;
    retryDelay: number;
  };
}

export default registerAs('database', (): DatabaseConfig => {
  // Get MongoDB URI from environment
  const mongoUri = process.env.MONGO_URI;

  // Validate that MONGO_URI is provided
  if (!mongoUri || mongoUri.trim() === '') {
    throw new Error(
      'MONGO_URI environment variable is required but not provided. ' +
        'Please set MONGO_URI in your .env file.',
    );
  }

  return {
    mongoUri,
    mongoOptions: {
      retryAttempts: 3,
      retryDelay: 1000,
    },
  };
});
