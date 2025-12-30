/**
 * Recording Status Enum
 *
 * Defines the completion status of an interview recording
 *
 * Values:
 * - COMPLETED: Recording completed successfully for full interview duration
 * - STOPPED_EARLY: Recording was stopped before interview completion
 */

export enum RecordingStatus {
  COMPLETED = 'COMPLETED',
  STOPPED_EARLY = 'STOPPED_EARLY',
}
