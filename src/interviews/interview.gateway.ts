import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/**
 * Interview Gateway
 *
 * Handles real-time WebSocket communication for interview sessions
 *
 * Responsibilities:
 * - Manage WebSocket connections
 * - Handle real-time events during interviews
 * - Broadcast updates to connected clients
 *
 * Events (Future Implementation):
 * - interview:start - Start interview session
 * - interview:answer - Receive user answer
 * - interview:feedback - Send AI feedback
 * - interview:end - End interview session
 *
 * ARCHITECTURE ONLY - NO LOGIC IMPLEMENTED YET
 */

@WebSocketGateway({
  cors: {
    origin: '*', // TODO: Configure proper CORS in production
  },
})
export class InterviewGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  /**
   * Handle new WebSocket connection
   */
  handleConnection(client: Socket): void {
    // Placeholder: Will handle client connection logic
    console.log(`Client connected: ${client.id}`);
  }

  /**
   * Handle WebSocket disconnection
   */
  handleDisconnect(client: Socket): void {
    // Placeholder: Will handle client disconnection logic
    console.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Handle interview start event
   * TODO: Implement interview initialization logic
   */
  @SubscribeMessage('interview:start')
  handleInterviewStart(client: Socket, payload: Record<string, unknown>): void {
    // Placeholder: Will start interview session
    console.log('Interview start event received', payload);
  }

  /**
   * Handle user answer event
   * TODO: Implement answer processing logic
   */
  @SubscribeMessage('interview:answer')
  handleAnswer(client: Socket, payload: Record<string, unknown>): void {
    // Placeholder: Will process user answer
    console.log('Answer received', payload);
  }

  /**
   * Broadcast feedback to client
   * TODO: Implement feedback delivery logic
   */
  sendFeedback(clientId: string, feedback: Record<string, unknown>): void {
    // Placeholder: Will send AI feedback to client
    this.server.to(clientId).emit('interview:feedback', feedback);
  }
}
