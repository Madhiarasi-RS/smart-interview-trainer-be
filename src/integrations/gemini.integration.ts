import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Gemini Integration Wrapper
 *
 * Responsibilities:
 * - Read GEMINI_API_KEY from ConfigService
 * - Expose generateQuestions method
 * - Isolate Gemini SDK from business logic
 *
 * STUB IMPLEMENTATION:
 * - NO real Gemini API calls yet
 * - Returns mock questions for testing
 * - Production-ready structure for future integration
 *
 * NO business logic:
 * - Does NOT determine question count
 * - Does NOT build prompts
 * - Does NOT validate inputs
 * - Pure integration layer only
 */

@Injectable()
export class GeminiIntegration {
  private readonly logger = new Logger(GeminiIntegration.name);
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('gemini.apiKey') ?? '';

    if (!this.apiKey) {
      this.logger.warn(
        'GEMINI_API_KEY not configured - using mock responses only',
      );
    } else {
      this.logger.log('Gemini integration initialized (STUB mode)');
    }
  }

  /**
   * Generate questions using Gemini API
   *
   * STUB IMPLEMENTATION:
   * - Returns mock questions for now
   * - Future: Will call actual Gemini API
   *
   * @param prompt - Complete prompt text for question generation
   * @returns Array of question strings
   */
  async generateQuestions(prompt: string): Promise<string[]> {
    this.logger.log('Generating questions (STUB mode)');
    this.logger.debug(`Prompt: ${prompt.substring(0, 100)}...`);

    // Simulate API call delay
    await this.simulateApiDelay();

    // TODO: Replace with actual Gemini API call
    // Example structure for future implementation:
    // const response = await this.geminiClient.generateContent(prompt);
    // return this.parseQuestionsFromResponse(response);

    return this.getMockQuestions();
  }

  /**
   * Simulate API call delay
   * Mimics real API latency for realistic testing
   */
  private async simulateApiDelay(): Promise<void> {
    const delay = Math.random() * 500 + 200; // 200-700ms
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Return mock questions for STUB implementation
   *
   * @returns Array of mock question strings
   */
  private getMockQuestions(): string[] {
    return [
      'What is the difference between let, const, and var in JavaScript?',
      'Explain the concept of closures in JavaScript with an example.',
      'What are the main differences between REST and GraphQL APIs?',
      'Describe the SOLID principles in object-oriented programming.',
      'How does authentication differ from authorization?',
      'What is the purpose of middleware in Express.js?',
      'Explain the concept of virtual DOM in React.',
      'What are the benefits of using TypeScript over JavaScript?',
      'Describe the differences between SQL and NoSQL databases.',
      'What is the CAP theorem and how does it apply to distributed systems?',
      'Explain the concept of dependency injection.',
      'What are the main HTTP methods and when would you use each?',
      'Describe the differences between synchronous and asynchronous programming.',
      'What is the purpose of a load balancer in web architecture?',
      'Explain the concept of microservices architecture.',
      'What are the benefits of using Docker containers?',
      'Describe the differences between unit tests, integration tests, and e2e tests.',
      'What is CORS and why is it important?',
      'Explain the concept of JWT tokens for authentication.',
      'What are the main differences between TCP and UDP protocols?',
      'Describe the MVC design pattern.',
      'What is the purpose of indexing in databases?',
      'Explain the concept of event-driven architecture.',
      'What are the main differences between HTTP/1.1 and HTTP/2?',
      'Describe the concept of caching and cache invalidation strategies.',
      'What is the purpose of API rate limiting?',
      'Explain the concept of database transactions and ACID properties.',
      'What are the benefits of using message queues in distributed systems?',
      'Describe the differences between monolithic and microservices architectures.',
      'What is the purpose of CI/CD pipelines in software development?',
    ];
  }
}
