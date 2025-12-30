import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  FeedbackEventDto,
  FeedbackType,
  FeedbackSeverity,
} from './dto/feedback-event.dto';
import { StartInterviewSessionDto } from './dto/start-interview-session.dto';

/**
 * Interview Gateway
 *
 * Handles real-time WebSocket communication for interview sessions
 *
 * Responsibilities:
 * - Manage WebSocket connections and disconnections
 * - Handle interview session start events
 * - Emit simulated real-time feedback to clients
 * - Clean up timers on disconnect
 *
 * Events:
 * Inbound:
 * - "connect" (automatic) - Client connects
 * - "startInterviewSession" - Start interview session with sessionId
 *
 * Outbound:
 * - "connected" - Sent on successful connection
 * - "feedback" - Real-time behavioral feedback during session
 * - "disconnected" - Sent on disconnect
 *
 * NO:
 * - Database access
 * - Real AI integration (using mock feedback)
 * - Authentication (future enhancement)
 * - Business logic (pure WebSocket handling only)
 */

interface ActiveSession {
  sessionId: string;
  clientId: string;
  feedbackTimer: NodeJS.Timeout;
  startTime: Date;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/interview',
})
export class InterviewGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(InterviewGateway.name);
  private activeSessions: Map<string, ActiveSession> = new Map();

  /**
   * Handle new WebSocket connection
   *
   * @param client - Connected Socket.IO client
   */
  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);

    // Emit connected event to client
    client.emit('connected', {
      message: 'Successfully connected to interview session',
    });
  }

  /**
   * Handle WebSocket disconnection
   *
   * @param client - Disconnected Socket.IO client
   */
  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Clean up active session for this client
    this.cleanupClientSession(client.id);

    // Emit disconnected event to client (if still connected)
    client.emit('disconnected', {
      message: 'Disconnected from interview session',
    });
  }

  /**
   * Handle startInterviewSession event
   *
   * Starts simulated feedback emission for the session
   *
   * @param data - Session start payload
   * @param client - Connected Socket.IO client
   */
  @SubscribeMessage('startInterviewSession')
  handleStartInterviewSession(
    @MessageBody() data: StartInterviewSessionDto,
    @ConnectedSocket() client: Socket,
  ): void {
    const { sessionId } = data;

    this.logger.log(
      `Starting interview session: ${sessionId} for client: ${client.id}`,
    );

    // Clean up any existing session for this client
    this.cleanupClientSession(client.id);

    // Start emitting mock feedback at intervals
    const feedbackTimer = this.startMockFeedbackEmission(client, sessionId);

    // Store active session
    this.activeSessions.set(client.id, {
      sessionId,
      clientId: client.id,
      feedbackTimer,
      startTime: new Date(),
    });

    this.logger.log(`Active sessions: ${this.activeSessions.size}`);
  }

  /**
   * Start emitting mock feedback events
   *
   * Simulates real-time behavioral feedback during interview
   *
   * @param client - Connected Socket.IO client
   * @param sessionId - Interview session ID
   * @returns Timer reference for cleanup
   */
  private startMockFeedbackEmission(
    client: Socket,
    sessionId: string,
  ): NodeJS.Timeout {
    let feedbackCount = 0;

    const timer = setInterval(() => {
      feedbackCount++;

      const feedback = this.generateMockFeedback(feedbackCount);

      this.logger.debug(
        `Emitting feedback #${feedbackCount} to session ${sessionId}: ${feedback.type}`,
      );

      client.emit('feedback', feedback);

      // Stop after 10 feedback messages (for testing)
      if (feedbackCount >= 10) {
        this.logger.log(`Max feedback reached for session ${sessionId}`);
        this.cleanupClientSession(client.id);
      }
    }, 5000); // Emit every 5 seconds

    return timer;
  }

  /**
   * Generate mock feedback event
   *
   * Cycles through different feedback types and severities
   *
   * @param count - Feedback sequence number
   * @returns Mock feedback event
   */
  private generateMockFeedback(count: number): FeedbackEventDto {
    const feedbackTypes = [
      FeedbackType.PACE,
      FeedbackType.FILLER,
      FeedbackType.CONFIDENCE,
      FeedbackType.RELEVANCE,
    ];

    const severities = [
      FeedbackSeverity.LOW,
      FeedbackSeverity.MEDIUM,
      FeedbackSeverity.HIGH,
    ];

    const messages: Record<FeedbackType, string[]> = {
      [FeedbackType.PACE]: [
        'Speaking pace is good',
        'Try to slow down a bit',
        'Pace is too fast, take your time',
      ],
      [FeedbackType.FILLER]: [
        'Minimal filler words detected',
        'Moderate use of filler words like "um" and "uh"',
        'High frequency of filler words - practice pausing instead',
      ],
      [FeedbackType.CONFIDENCE]: [
        'Confident tone and delivery',
        'Moderate confidence level',
        'Try to speak with more confidence',
      ],
      [FeedbackType.RELEVANCE]: [
        'Answer is highly relevant',
        'Answer is somewhat relevant but could be more focused',
        'Answer is straying from the question',
      ],
    };

    const type = feedbackTypes[count % feedbackTypes.length];
    const severity = severities[count % severities.length];
    const severityIndex = severities.indexOf(severity);
    const message = messages[type][severityIndex];

    return {
      type,
      message,
      severity,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Clean up active session for a client
   *
   * Clears timers and removes from active sessions map
   *
   * @param clientId - Socket.IO client ID
   */
  private cleanupClientSession(clientId: string): void {
    const session = this.activeSessions.get(clientId);

    if (session) {
      this.logger.log(`Cleaning up session: ${session.sessionId}`);

      // Clear feedback timer
      clearInterval(session.feedbackTimer);

      // Remove from active sessions
      this.activeSessions.delete(clientId);

      this.logger.log(`Active sessions after cleanup: ${this.activeSessions.size}`);
    }
  }
}

