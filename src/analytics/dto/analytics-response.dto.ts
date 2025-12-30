/**
 * Best Interview DTO
 *
 * Represents a high-performing interview session
 */
export interface BestInterviewDto {
  interviewId: string;
  date: string;
  domain: string;
  finalScore: number;
}

/**
 * Filler Word DTO
 *
 * Represents aggregated filler word usage
 */
export interface FillerWordDto {
  word: string;
  count: number;
}

/**
 * Weakness Category DTO
 *
 * Represents a performance category that needs improvement
 */
export interface WeaknessCategoryDto {
  category: 'communication' | 'confidence' | 'relevance' | 'domainFit';
  averageScore: number;
  occurrences: number;
}

/**
 * Improvement Timeline Entry DTO
 *
 * Represents a single interview in the improvement timeline
 */
export interface ImprovementTimelineEntryDto {
  interviewDate: string;
  durationType: '15m' | '30m' | '1hr';
  finalScore: number;
}

/**
 * Analytics Overview Response DTO
 *
 * Comprehensive analytics overview for a user
 *
 * Contains:
 * - Total interviews completed
 * - Average final score
 * - Best performing interviews
 * - Top weaknesses across all sessions
 * - Recent performance trend
 */
export class AnalyticsOverviewResponseDto {
  totalInterviews: number;
  averageFinalScore: number;
  bestInterviews: BestInterviewDto[];
  topWeaknesses: WeaknessCategoryDto[];
  recentTrend: 'improving' | 'declining' | 'stable';
}

/**
 * Filler Words Response DTO
 *
 * Aggregated filler word usage across interviews
 */
export class FillerWordsResponseDto {
  totalFillerWords: number;
  mostCommonWords: FillerWordDto[];
  averageFillerWordsPerInterview: number;
}

/**
 * Improvement Timeline Response DTO
 *
 * Chronological performance data
 */
export class ImprovementTimelineResponseDto {
  timeline: ImprovementTimelineEntryDto[];
  overallTrend: 'improving' | 'declining' | 'stable';
  scoreImprovement: number;
}
