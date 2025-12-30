import { registerAs } from '@nestjs/config';

/**
 * Gemini AI Configuration
 *
 * Centralized configuration for Gemini AI integration
 * All environment variables are validated and typed here
 *
 * NO direct process.env usage outside this file
 */

export interface GeminiConfig {
  apiKey: string;
}

export default registerAs('gemini', (): GeminiConfig => {
  const apiKey = process.env.GEMINI_API_KEY || '';

  // Log warning if API key is not configured
  if (!apiKey) {
    console.warn(
      'WARNING: GEMINI_API_KEY not configured - Gemini integration will use mock responses',
    );
  }

  return {
    apiKey,
  };
});
