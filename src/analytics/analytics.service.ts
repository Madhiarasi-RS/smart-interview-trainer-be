import { Injectable, Logger } from '@nestjs/common';
import {
  AnalyticsOverviewResponseDto,
  FillerWordsResponseDto,
  ImprovementTimelineResponseDto,
  BestInterviewDto,
  FillerWordDto,
  WeaknessCategoryDto,
  ImprovementTimelineEntryDto,
} from './dto/analytics-response.dto';

/**
 * Analytics Service
 *
 * Responsibilities:
 * - Aggregate interview, scorecard, and feedback data
 * - Compute analytics metrics (best interviews, weaknesses, trends)
 * - Return structured analytics results
 *
 * Business Logic:
 * - Best performing interviews (top N by final score)
 * - Common filler words aggregation
 * - Top weaknesses identification (lowest scoring categories)
 * - Improvement timeline (chronological performance)
 * - Trend analysis (improving/declining/stable)
 *
 * STUB IMPLEMENTATION:
 * - Uses mock/placeholder data
 * - NO real database access yet
 * - NO external AI calls
 * - Ready for repository integration later
 *
 * Future Enhancements:
 * - MongoDB aggregation pipelines
 * - InterviewRepository and ScorecardRepository integration
 * - Advanced trend analysis with ML
 * - Comparative analytics across users
 */

interface MockInterview {
  interviewId: string;
  date: string;
  domain: string;
  duration: number;
  finalScore: number;
  communicationScore: number;
  confidenceScore: number;
  relevanceScore: number;
  domainFitScore: number;
  fillerWordCount: number;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  /**
   * Generate mock interview data for testing
   * Future: Replace with database queries
   */
  private getMockInterviews(): MockInterview[] {
    return [
      {
        interviewId: 'int_001',
        date: '2025-12-20T10:00:00.000Z',
        domain: 'FULLSTACK',
        duration: 30,
        finalScore: 35.5,
        communicationScore: 8.5,
        confidenceScore: 9.0,
        relevanceScore: 9.0,
        domainFitScore: 9.0,
        fillerWordCount: 8,
      },
      {
        interviewId: 'int_002',
        date: '2025-12-22T14:00:00.000Z',
        domain: 'MERN',
        duration: 15,
        finalScore: 28.0,
        communicationScore: 7.0,
        confidenceScore: 7.0,
        relevanceScore: 7.0,
        domainFitScore: 7.0,
        fillerWordCount: 15,
      },
      {
        interviewId: 'int_003',
        date: '2025-12-25T09:00:00.000Z',
        domain: 'CLOUD',
        duration: 60,
        finalScore: 32.0,
        communicationScore: 8.0,
        confidenceScore: 8.0,
        relevanceScore: 8.0,
        domainFitScore: 8.0,
        fillerWordCount: 12,
      },
      {
        interviewId: 'int_004',
        date: '2025-12-28T11:00:00.000Z',
        domain: 'FULLSTACK',
        duration: 30,
        finalScore: 38.0,
        communicationScore: 9.5,
        confidenceScore: 9.5,
        relevanceScore: 9.5,
        domainFitScore: 9.5,
        fillerWordCount: 5,
      },
      {
        interviewId: 'int_005',
        date: '2025-12-29T15:00:00.000Z',
        domain: 'QA',
        duration: 15,
        finalScore: 25.0,
        communicationScore: 6.0,
        confidenceScore: 6.5,
        relevanceScore: 6.0,
        domainFitScore: 6.5,
        fillerWordCount: 20,
      },
    ];
  }

  /**
   * Get analytics overview
   *
   * Aggregates:
   * - Total interviews
   * - Average final score
   * - Best performing interviews (top 3)
   * - Top weaknesses (lowest 2 categories)
   * - Recent trend
   *
   * @param userId - User ID (placeholder for authentication)
   * @returns Analytics overview
   */
  async getAnalyticsOverview(
    userId: string,
  ): Promise<AnalyticsOverviewResponseDto> {
    this.logger.log(`Generating analytics overview for user: ${userId}`);

    const interviews = this.getMockInterviews();

    const totalInterviews = interviews.length;
    const averageFinalScore = this.calculateAverageFinalScore(interviews);
    const bestInterviews = this.getBestInterviews(interviews, 3);
    const topWeaknesses = this.getTopWeaknesses(interviews, 2);
    const recentTrend = this.calculateRecentTrend(interviews);

    this.logger.log(
      `Analytics overview generated: ${totalInterviews} interviews, avg score: ${averageFinalScore}`,
    );

    return {
      totalInterviews,
      averageFinalScore: this.roundToTwoDecimals(averageFinalScore),
      bestInterviews,
      topWeaknesses,
      recentTrend,
    };
  }

  /**
   * Get filler words analytics
   *
   * Aggregates filler word usage across all interviews
   *
   * @param userId - User ID (placeholder for authentication)
   * @returns Filler words analytics
   */
  async getFillerWordsAnalytics(
    userId: string,
  ): Promise<FillerWordsResponseDto> {
    this.logger.log(`Generating filler words analytics for user: ${userId}`);

    const interviews = this.getMockInterviews();

    const totalFillerWords = interviews.reduce(
      (sum, interview) => sum + interview.fillerWordCount,
      0,
    );

    const averageFillerWordsPerInterview =
      totalFillerWords / interviews.length;

    const mostCommonWords = this.getMockFillerWords();

    this.logger.log(
      `Filler words analytics generated: ${totalFillerWords} total, avg: ${averageFillerWordsPerInterview}`,
    );

    return {
      totalFillerWords,
      mostCommonWords,
      averageFillerWordsPerInterview: this.roundToTwoDecimals(
        averageFillerWordsPerInterview,
      ),
    };
  }

  /**
   * Get improvement timeline
   *
   * Returns chronological performance data with trend analysis
   *
   * @param userId - User ID (placeholder for authentication)
   * @returns Improvement timeline
   */
  async getImprovementTimeline(
    userId: string,
  ): Promise<ImprovementTimelineResponseDto> {
    this.logger.log(`Generating improvement timeline for user: ${userId}`);

    const interviews = this.getMockInterviews();

    const timeline: ImprovementTimelineEntryDto[] = interviews
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((interview) => ({
        interviewDate: interview.date,
        durationType: this.getDurationType(interview.duration),
        finalScore: interview.finalScore,
      }));

    const overallTrend = this.calculateOverallTrend(interviews);
    const scoreImprovement = this.calculateScoreImprovement(interviews);

    this.logger.log(
      `Improvement timeline generated: ${timeline.length} entries, trend: ${overallTrend}`,
    );

    return {
      timeline,
      overallTrend,
      scoreImprovement: this.roundToTwoDecimals(scoreImprovement),
    };
  }

  /**
   * Calculate average final score across interviews
   */
  private calculateAverageFinalScore(interviews: MockInterview[]): number {
    const sum = interviews.reduce(
      (total, interview) => total + interview.finalScore,
      0,
    );
    return sum / interviews.length;
  }

  /**
   * Get best performing interviews
   *
   * @param interviews - All interviews
   * @param topN - Number of top interviews to return
   * @returns Top N interviews by final score
   */
  private getBestInterviews(
    interviews: MockInterview[],
    topN: number,
  ): BestInterviewDto[] {
    return interviews
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, topN)
      .map((interview) => ({
        interviewId: interview.interviewId,
        date: interview.date,
        domain: interview.domain,
        finalScore: interview.finalScore,
      }));
  }

  /**
   * Identify top weaknesses (lowest scoring categories)
   *
   * @param interviews - All interviews
   * @param topN - Number of weaknesses to return
   * @returns Top N weaknesses
   */
  private getTopWeaknesses(
    interviews: MockInterview[],
    topN: number,
  ): WeaknessCategoryDto[] {
    const categories = ['communication', 'confidence', 'relevance', 'domainFit'] as const;

    const categoryScores = categories.map((category) => {
      const scoreKey = `${category}Score` as keyof MockInterview;
      const scores = interviews.map((i) => i[scoreKey] as number);
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;

      return {
        category,
        averageScore: this.roundToTwoDecimals(average),
        occurrences: interviews.length,
      };
    });

    return categoryScores
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, topN);
  }

  /**
   * Calculate recent trend (last 3 interviews)
   */
  private calculateRecentTrend(
    interviews: MockInterview[],
  ): 'improving' | 'declining' | 'stable' {
    if (interviews.length < 2) return 'stable';

    const sorted = [...interviews].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const recent = sorted.slice(0, Math.min(3, sorted.length));

    if (recent.length < 2) return 'stable';

    const firstScore = recent[recent.length - 1].finalScore;
    const lastScore = recent[0].finalScore;
    const diff = lastScore - firstScore;

    if (diff > 2) return 'improving';
    if (diff < -2) return 'declining';
    return 'stable';
  }

  /**
   * Calculate overall trend across all interviews
   */
  private calculateOverallTrend(
    interviews: MockInterview[],
  ): 'improving' | 'declining' | 'stable' {
    if (interviews.length < 2) return 'stable';

    const sorted = [...interviews].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const firstScore = sorted[0].finalScore;
    const lastScore = sorted[sorted.length - 1].finalScore;
    const diff = lastScore - firstScore;

    if (diff > 3) return 'improving';
    if (diff < -3) return 'declining';
    return 'stable';
  }

  /**
   * Calculate score improvement (last vs first interview)
   */
  private calculateScoreImprovement(interviews: MockInterview[]): number {
    if (interviews.length < 2) return 0;

    const sorted = [...interviews].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return sorted[sorted.length - 1].finalScore - sorted[0].finalScore;
  }

  /**
   * Get mock filler words data
   * Future: Aggregate from actual interview transcripts
   */
  private getMockFillerWords(): FillerWordDto[] {
    return [
      { word: 'um', count: 25 },
      { word: 'uh', count: 18 },
      { word: 'like', count: 12 },
      { word: 'you know', count: 8 },
      { word: 'actually', count: 7 },
    ];
  }

  /**
   * Get duration type string
   */
  private getDurationType(duration: number): '15m' | '30m' | '1hr' {
    if (duration === 15) return '15m';
    if (duration === 30) return '30m';
    return '1hr';
  }

  /**
   * Round number to two decimal places
   */
  private roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }
}

