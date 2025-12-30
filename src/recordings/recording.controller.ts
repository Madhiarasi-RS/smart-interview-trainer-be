import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RecordingService } from './recording.service';
import { CreateRecordingDto } from './dto/create-recording.dto';
import { ResponseHelper, ApiResponse } from '../common/utils/response.helper';

/**
 * Recording Controller
 *
 * Responsibilities:
 * - Accept recording metadata submissions
 * - Validate input via DTOs
 * - Call RecordingService for business logic
 * - Return standardized responses
 *
 * Endpoints:
 * - POST /recordings - Submit recording metadata
 * - GET /recordings/:id - Get recording metadata by ID
 * - GET /recordings/interview/:interviewId - Get recordings for interview
 * - GET /recordings/user/:userId - Get recordings for user
 *
 * Must NOT:
 * - Contain business logic (use RecordingService)
 * - Handle file uploads directly
 * - Access database directly
 * - Process media files
 */

@Controller('recordings')
export class RecordingController {
  constructor(private readonly recordingService: RecordingService) {}

  /**
   * Submit recording metadata
   *
   * @param createRecordingDto - Recording metadata
   * @returns Created recording with generated ID
   */
  @Post()
  async createRecording(
    @Body() createRecordingDto: CreateRecordingDto,
  ): Promise<ApiResponse> {
    const recording =
      await this.recordingService.createRecording(createRecordingDto);
    return ResponseHelper.success('Recording metadata stored', recording);
  }

  /**
   * Get recording metadata by ID
   *
   * @param id - Recording ID
   * @returns Recording metadata
   */
  @Get(':id')
  async getRecording(@Param('id') id: string): Promise<ApiResponse> {
    const recording = await this.recordingService.getRecordingById(id);
    return ResponseHelper.success('Recording retrieved successfully', recording);
  }

  /**
   * Get all recordings for an interview
   *
   * @param interviewId - Interview ID
   * @returns Array of recording metadata
   */
  @Get('interview/:interviewId')
  async getRecordingsByInterview(
    @Param('interviewId') interviewId: string,
  ): Promise<ApiResponse> {
    const recordings =
      await this.recordingService.getRecordingsByInterviewId(interviewId);
    return ResponseHelper.success(
      `Retrieved ${recordings.length} recording(s) for interview`,
      recordings,
    );
  }

  /**
   * Get all recordings for a user
   *
   * @param userId - User ID
   * @returns Array of recording metadata
   */
  @Get('user/:userId')
  async getRecordingsByUser(
    @Param('userId') userId: string,
  ): Promise<ApiResponse> {
    const recordings =
      await this.recordingService.getRecordingsByUserId(userId);
    return ResponseHelper.success(
      `Retrieved ${recordings.length} recording(s) for user`,
      recordings,
    );
  }
}
