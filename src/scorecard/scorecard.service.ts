import { Injectable, Logger } from '@nestjs/common';
import { CreateScorecardDto } from './dto/create-scorecard.dto';
import { ScorecardResponseDto } from './dto/scorecard-response.dto';

/**
 * Scorecard Service
 *
 * Responsibilities:
 * - Accept structured AI analysis results
 * - Compute individual score components
 * - Generate final scorecard with feedback
 * - Provide rule-based strengths/weaknesses analysis
 *
 * Score Computation:
 * - Communication Score = avg(confidence, speakingPace, eyeContact)
 * - Domain Fit Score = technicalCorrectness
 * - Confidence Score = confidenceLevel
 * - Answer Relevance Score = answerRelevance
 * - Final Score = sum of all four (max 40)
 *
 * Feedback Generation:
 * - Strengths: Scores ≥ 8
 * - Weaknesses: Scores ≤ 5
 * - Improvement Suggestions: Rule-based on weak areas
 *
 * NO:
 * - Direct Gemini calls (AI output passed as input)
 * - Database access (future: ScorecardRepository)
 * - External SDK calls
 * - File system operations
 */

// Score thresholds for feedback classification
const SCORE_THRESHOLD_STRENGTH = 8;
const SCORE_THRESHOLD_WEAKNESS = 5;
const FILLER_WORD_THRESHOLD_LOW = 5;
const FILLER_WORD_THRESHOLD_HIGH = 15;

@Injectable()
export class ScorecardService {
  private readonly logger = new Logger(ScorecardService.name);
  private scorecardCounter = 0;

  /**
   * Generate scorecard from AI analysis results
   *
   * @param createScorecardDto - Structured AI analysis input
   * @returns Computed scorecard with feedback
   */
  async generateScorecard(
    createScorecardDto: CreateScorecardDto,
  ): Promise<ScorecardResponseDto> {
    this.logger.log(
      `Generating scorecard for interview ${createScorecardDto.interviewId}`,
    );

    // Generate unique scorecard ID
    this.scorecardCounter++;
    const scorecardId = `scorecard_${Date.now()}_${this.scorecardCounter}`;

    // Compute score components
    const communicationScore = this.computeCommunicationScore(
      createScorecardDto.confidenceLevelScore,
      createScorecardDto.speakingPaceScore,
      createScorecardDto.eyeContactScore,
    );

    const domainFitScore = createScorecardDto.technicalCorrectnessScore;
    const confidenceScore = createScorecardDto.confidenceLevelScore;
    const answerRelevanceScore = createScorecardDto.answerRelevanceScore;

    // Compute final score (sum of all four components)
    const finalScore = this.computeFinalScore(
      communicationScore,
      domainFitScore,
      confidenceScore,
      answerRelevanceScore,
    );

    // Generate feedback
    const strengths = this.identifyStrengths(createScorecardDto);
    const weaknesses = this.identifyWeaknesses(createScorecardDto);
    const improvementSuggestions =
      this.generateImprovementSuggestions(createScorecardDto);

    this.logger.log(
      `Scorecard generated: ${scorecardId} | Final Score: ${finalScore}/40`,
    );

    return {
      scorecardId,
      interviewId: createScorecardDto.interviewId,
      userId: createScorecardDto.userId,
      communicationScore: this.roundToTwoDecimals(communicationScore),
      domainFitScore: this.roundToTwoDecimals(domainFitScore),
      confidenceScore: this.roundToTwoDecimals(confidenceScore),
      answerRelevanceScore: this.roundToTwoDecimals(answerRelevanceScore),
      fillerWordCount: createScorecardDto.fillerWordCount,
      finalScore: this.roundToTwoDecimals(finalScore),
      strengths,
      weaknesses,
      improvementSuggestions,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Compute communication score
   *
   * Formula: average(confidenceLevel, speakingPace, eyeContact)
   *
   * @param confidenceLevel - Confidence level score (0-10)
   * @param speakingPace - Speaking pace score (0-10)
   * @param eyeContact - Eye contact score (0-10)
   * @returns Communication score (0-10)
   */
  private computeCommunicationScore(
    confidenceLevel: number,
    speakingPace: number,
    eyeContact: number,
  ): number {
    return (confidenceLevel + speakingPace + eyeContact) / 3;
  }

  /**
   * Compute final score
   *
   * Formula: sum of all four score components
   * Maximum possible: 40 (4 components × 10)
   *
   * @param communication - Communication score (0-10)
   * @param domainFit - Domain fit score (0-10)
   * @param confidence - Confidence score (0-10)
   * @param answerRelevance - Answer relevance score (0-10)
   * @returns Final score (0-40)
   */
  private computeFinalScore(
    communication: number,
    domainFit: number,
    confidence: number,
    answerRelevance: number,
  ): number {
    return communication + domainFit + confidence + answerRelevance;
  }

  /**
   * Identify strengths based on score thresholds
   *
   * Rule: Score ≥ 8 = strength
   *
   * @param dto - AI analysis input
   * @returns Array of strength descriptions
   */
  private identifyStrengths(dto: CreateScorecardDto): string[] {
    const strengths: string[] = [];

    if (dto.contentClarityScore >= SCORE_THRESHOLD_STRENGTH) {
      strengths.push('Excellent content clarity and structure');
    }

    if (dto.answerRelevanceScore >= SCORE_THRESHOLD_STRENGTH) {
      strengths.push('Highly relevant and focused answers');
    }

    if (dto.technicalCorrectnessScore >= SCORE_THRESHOLD_STRENGTH) {
      strengths.push('Strong technical knowledge and accuracy');
    }

    if (dto.confidenceLevelScore >= SCORE_THRESHOLD_STRENGTH) {
      strengths.push('High confidence and strong delivery');
    }

    if (dto.speakingPaceScore >= SCORE_THRESHOLD_STRENGTH) {
      strengths.push('Well-paced communication');
    }

    if (dto.eyeContactScore >= SCORE_THRESHOLD_STRENGTH) {
      strengths.push('Good eye contact and engagement');
    }

    if (dto.fillerWordCount <= FILLER_WORD_THRESHOLD_LOW) {
      strengths.push('Minimal filler words, clear articulation');
    }

    if (strengths.length === 0) {
      strengths.push('Shows potential for improvement across all areas');
    }

    return strengths;
  }

  /**
   * Identify weaknesses based on score thresholds
   *
   * Rule: Score ≤ 5 = weakness
   *
   * @param dto - AI analysis input
   * @returns Array of weakness descriptions
   */
  private identifyWeaknesses(dto: CreateScorecardDto): string[] {
    const weaknesses: string[] = [];

    if (dto.contentClarityScore <= SCORE_THRESHOLD_WEAKNESS) {
      weaknesses.push('Content clarity needs improvement');
    }

    if (dto.answerRelevanceScore <= SCORE_THRESHOLD_WEAKNESS) {
      weaknesses.push('Answers lack focus and relevance');
    }

    if (dto.technicalCorrectnessScore <= SCORE_THRESHOLD_WEAKNESS) {
      weaknesses.push('Technical accuracy needs strengthening');
    }

    if (dto.confidenceLevelScore <= SCORE_THRESHOLD_WEAKNESS) {
      weaknesses.push('Confidence level could be improved');
    }

    if (dto.speakingPaceScore <= SCORE_THRESHOLD_WEAKNESS) {
      weaknesses.push('Speaking pace needs adjustment');
    }

    if (dto.eyeContactScore <= SCORE_THRESHOLD_WEAKNESS) {
      weaknesses.push('Eye contact could be more consistent');
    }

    if (dto.fillerWordCount >= FILLER_WORD_THRESHOLD_HIGH) {
      weaknesses.push('High use of filler words');
    }

    if (weaknesses.length === 0) {
      weaknesses.push('No significant weaknesses identified');
    }

    return weaknesses;
  }

  /**
   * Generate improvement suggestions based on weak areas
   *
   * Rule-based suggestions for scores ≤ 6
   *
   * @param dto - AI analysis input
   * @returns Array of actionable suggestions
   */
  private generateImprovementSuggestions(
    dto: CreateScorecardDto,
  ): string[] {
    const suggestions: string[] = [];

    if (dto.contentClarityScore <= 6) {
      suggestions.push(
        'Practice structuring answers with clear introduction, body, and conclusion',
      );
    }

    if (dto.answerRelevanceScore <= 6) {
      suggestions.push(
        'Focus on directly addressing the question before expanding on details',
      );
    }

    if (dto.technicalCorrectnessScore <= 6) {
      suggestions.push(
        'Review core concepts and practice explaining technical topics clearly',
      );
    }

    if (dto.confidenceLevelScore <= 6) {
      suggestions.push(
        'Build confidence through mock interviews and positive self-talk',
      );
    }

    if (dto.speakingPaceScore <= 6) {
      suggestions.push(
        'Practice speaking at a moderate pace with intentional pauses',
      );
    }

    if (dto.eyeContactScore <= 6) {
      suggestions.push(
        'Maintain eye contact with the camera/interviewer for 3-5 seconds at a time',
      );
    }

    if (dto.fillerWordCount >= FILLER_WORD_THRESHOLD_HIGH) {
      suggestions.push(
        'Practice pausing instead of using filler words like "um" and "uh"',
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        'Continue practicing to maintain your strong performance',
      );
    }

    return suggestions;
  }

  /**
   * Round number to two decimal places
   *
   * @param value - Number to round
   * @returns Rounded number
   */
  private roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }
    });
  }

  /**
   * Get feedback recommendations
   * TODO: Implement feedback generation
   */
  async getFeedback(
    scoreData: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    // Placeholder: Will generate improvement recommendations
    return Promise.resolve({
      message: 'Feedback generation logic to be implemented',
      scoreData,
    });
  }
}
