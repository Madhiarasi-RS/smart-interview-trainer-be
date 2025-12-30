/**
 * Scorecard Response DTO
 *
 * Represents the computed scorecard output
 *
 * Score Components:
 * - communicationScore: Average of confidence, speaking pace, eye contact (0-10)
 * - domainFitScore: Technical correctness score (0-10)
 * - confidenceScore: Confidence level score (0-10)
 * - answerRelevanceScore: Answer relevance score (0-10)
 * - finalScore: Sum of all four scores (0-40, max 40)
 *
 * Additional Metrics:
 * - fillerWordCount: Number of filler words detected
 *
 * Feedback:
 * - strengths: Array of identified strengths
 * - weaknesses: Array of identified weaknesses
 * - improvementSuggestions: Array of actionable suggestions
 *
 * Metadata:
 * - scorecardId: Unique identifier for this scorecard
 * - interviewId: Reference to interview session
 * - userId: Reference to user
 * - createdAt: Timestamp of scorecard generation
 */

export class ScorecardResponseDto {
  scorecardId: string;
  interviewId: string;
  userId: string;

  // Core Scores (0-10 each)
  communicationScore: number;
  domainFitScore: number;
  confidenceScore: number;
  answerRelevanceScore: number;

  // Metrics
  fillerWordCount: number;

  // Final Score (0-40)
  finalScore: number;

  // Feedback
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];

  // Metadata
  createdAt: string;
}
