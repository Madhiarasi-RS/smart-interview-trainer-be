import { Injectable, Logger } from '@nestjs/common';
import { GeminiIntegration } from '../integrations/gemini.integration';
import { GenerateQuestionsDto } from './dto/generate-questions.dto';
import { QuestionDomain } from './enums/question-domain.enum';
import { QuestionDifficulty } from './enums/question-difficulty.enum';

/**
 * Question Service
 *
 * Responsibilities:
 * - Generate interview questions based on domain, difficulty, duration
 * - Build prompts for Gemini AI integration
 * - Determine question count based on duration
 * - Return structured question list
 *
 * Business Logic:
 * - Duration → Question count mapping:
 *   - 15 min → 15 MCQ questions
 *   - 30 min → 15-20 descriptive questions
 *   - 60 min → 25-30 descriptive questions
 * - Prompt building with domain and difficulty context
 * - Call Gemini integration for AI generation
 *
 * NO:
 * - Direct Gemini SDK calls (use GeminiIntegration)
 * - Hardcoded API keys
 * - Controller logic
 * - Data persistence (future: QuestionRepository)
 */

export interface GeneratedQuestion {
  question: string;
  order: number;
}

export interface GeneratedQuestionsResponse {
  domain: QuestionDomain;
  difficulty: QuestionDifficulty;
  duration: number;
  questionCount: number;
  questionType: 'MCQ' | 'DESCRIPTIVE';
  questions: GeneratedQuestion[];
}

@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);

  constructor(private readonly geminiIntegration: GeminiIntegration) {}

  /**
   * Generate questions for interview
   *
   * @param generateQuestionsDto - Question generation parameters
   * @returns Structured list of generated questions
   */
  async generateQuestions(
    generateQuestionsDto: GenerateQuestionsDto,
  ): Promise<GeneratedQuestionsResponse> {
    const { domain, difficulty, duration } = generateQuestionsDto;

    this.logger.log(
      `Generating questions: domain=${domain}, difficulty=${difficulty}, duration=${duration}`,
    );

    // Determine question count and type based on duration
    const { questionCount, questionType } =
      this.getQuestionCountAndType(duration);

    // Build prompt for Gemini
    const prompt = this.buildPrompt(domain, difficulty, questionCount, questionType);

    // Call Gemini integration to generate questions
    const rawQuestions = await this.geminiIntegration.generateQuestions(prompt);

    // Structure response
    const questions: GeneratedQuestion[] = rawQuestions
      .slice(0, questionCount)
      .map((question, index) => ({
        question,
        order: index + 1,
      }));

    this.logger.log(
      `Generated ${questions.length} ${questionType} questions for ${domain}`,
    );

    return {
      domain,
      difficulty,
      duration,
      questionCount: questions.length,
      questionType,
      questions,
    };
  }

  /**
   * Determine question count and type based on duration
   *
   * Mapping:
   * - 15 min → 15 MCQ questions
   * - 30 min → 15-20 descriptive questions (using 18 as middle value)
   * - 60 min → 25-30 descriptive questions (using 28 as middle value)
   *
   * @param duration - Interview duration in minutes
   * @returns Question count and type
   */
  private getQuestionCountAndType(duration: number): {
    questionCount: number;
    questionType: 'MCQ' | 'DESCRIPTIVE';
  } {
    switch (duration) {
      case 15:
        return { questionCount: 15, questionType: 'MCQ' };
      case 30:
        return { questionCount: 18, questionType: 'DESCRIPTIVE' };
      case 60:
        return { questionCount: 28, questionType: 'DESCRIPTIVE' };
      default:
        this.logger.warn(`Unexpected duration: ${duration}, defaulting to 15 MCQ`);
        return { questionCount: 15, questionType: 'MCQ' };
    }
  }

  /**
   * Build prompt for Gemini AI
   *
   * Creates detailed prompt with:
   * - Domain context
   * - Difficulty level
   * - Question count
   * - Question type (MCQ vs Descriptive)
   *
   * @param domain - Technical domain
   * @param difficulty - Question difficulty
   * @param questionCount - Number of questions to generate
   * @param questionType - MCQ or DESCRIPTIVE
   * @returns Complete prompt string
   */
  private buildPrompt(
    domain: QuestionDomain,
    difficulty: QuestionDifficulty,
    questionCount: number,
    questionType: 'MCQ' | 'DESCRIPTIVE',
  ): string {
    const domainContext = this.getDomainContext(domain);
    const difficultyContext = this.getDifficultyContext(difficulty);

    const prompt = `
You are an expert technical interviewer specializing in ${domainContext}.

Generate exactly ${questionCount} ${questionType === 'MCQ' ? 'multiple-choice' : 'descriptive'} interview questions.

Difficulty Level: ${difficultyContext}

Requirements:
- Questions should be relevant to ${domainContext}
- Difficulty level: ${difficulty}
${questionType === 'MCQ' ? '- Include 4 options (A, B, C, D) with one correct answer' : '- Questions should be open-ended and require detailed explanations'}
- Cover a diverse range of topics within the domain
- Questions should be practical and realistic
- Avoid overly theoretical or trick questions

Format:
${questionType === 'MCQ' ? '- Each question should include the question text and 4 options' : '- Each question should be clear and concise'}
- Number each question from 1 to ${questionCount}

Domain Focus: ${domainContext}
    `.trim();

    return prompt;
  }

  /**
   * Get domain context description
   *
   * @param domain - Question domain
   * @returns Domain context description for prompt
   */
  private getDomainContext(domain: QuestionDomain): string {
    const domainContextMap: Record<QuestionDomain, string> = {
      [QuestionDomain.FULLSTACK]:
        'Full-stack development including frontend (React, Angular, Vue), backend (Node.js, Python, Java), and databases',
      [QuestionDomain.CLOUD]:
        'Cloud computing including AWS, Azure, GCP, containerization, orchestration, and cloud architecture',
      [QuestionDomain.MERN]:
        'MERN stack (MongoDB, Express.js, React, Node.js) development and related technologies',
      [QuestionDomain.UI_UX]:
        'User interface and user experience design including design principles, prototyping, accessibility, and usability',
      [QuestionDomain.QA]:
        'Quality assurance and testing including test automation, manual testing, test strategies, and testing frameworks',
      [QuestionDomain.HR]:
        'Human resources and behavioral questions including communication, teamwork, conflict resolution, and leadership',
    };

    return domainContextMap[domain];
  }

  /**
   * Get difficulty context description
   *
   * @param difficulty - Question difficulty
   * @returns Difficulty context description for prompt
   */
  private getDifficultyContext(difficulty: QuestionDifficulty): string {
    const difficultyContextMap: Record<QuestionDifficulty, string> = {
      [QuestionDifficulty.EASY]:
        'Basic concepts and fundamentals suitable for entry-level candidates',
      [QuestionDifficulty.MEDIUM]:
        'Intermediate concepts and practical scenarios for mid-level candidates',
      [QuestionDifficulty.HARD]:
        'Advanced concepts and complex problem-solving for senior-level candidates',
    };

    return difficultyContextMap[difficulty];
  }

  /**
   * Save custom question template
   * TODO: Implement template storage
   */
  async saveTemplate(
    template: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    // Placeholder: Will save template to MongoDB
    return Promise.resolve({
      message: 'Template save logic to be implemented',
      template,
    });
  }
}
