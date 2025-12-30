import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { ResponseHelper, ApiResponse } from '../common/utils/response.helper';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewStatusDto } from './dto/update-interview-status.dto';

/**
 * Interview Controller
 *
 * Responsibilities:
 * - Accept interview session requests
 * - Validate input via DTOs
 * - Call InterviewService for business logic
 * - Return standardized responses
 *
 * Endpoints:
 * - POST /interviews - Create new interview session
 * - PATCH /interviews/:id/status - Update interview status
 * - GET /interviews/user/:userId - Get user's interviews
 * - GET /interviews/:id - Get specific interview
 *
 * Must NOT:
 * - Contain business logic
 * - Access database directly
 * - Handle WebSocket connections (separate gateway)
 */

@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  /**
   * Create new interview session
   *
   * @param createInterviewDto - Interview creation data
   * @returns Created interview
   */
  @Post()
  async createInterview(
    @Body() createInterviewDto: CreateInterviewDto,
  ): Promise<ApiResponse> {
    const interview =
      await this.interviewService.createInterview(createInterviewDto);
    return ResponseHelper.success(
      'Interview session created successfully',
      interview,
    );
  }

  /**
   * Update interview status
   *
   * @param id - Interview ID
   * @param updateInterviewStatusDto - Status update data
   * @returns Updated interview
   */
  @Patch(':id/status')
  async updateInterviewStatus(
    @Param('id') id: string,
    @Body() updateInterviewStatusDto: UpdateInterviewStatusDto,
  ): Promise<ApiResponse> {
    const interview = await this.interviewService.updateInterviewStatus(
      id,
      updateInterviewStatusDto,
    );
    return ResponseHelper.success(
      'Interview status updated successfully',
      interview,
    );
  }

  /**
   * Get all interviews for a user
   *
   * @param userId - User ID
   * @returns Array of user's interviews
   */
  @Get('user/:userId')
  async getUserInterviews(@Param('userId') userId: string): Promise<ApiResponse> {
    const interviews = await this.interviewService.getUserInterviews(userId);
    return ResponseHelper.success(
      `Retrieved ${interviews.length} interview(s) for user`,
      interviews,
    );
  }

  /**
   * Get specific interview by ID
   *
   * @param id - Interview ID
   * @returns Interview details
   */
  @Get(':id')
  async getInterview(@Param('id') id: string): Promise<ApiResponse> {
    const interview = await this.interviewService.getInterviewById(id);
    return ResponseHelper.success('Interview retrieved successfully', interview);
  }
}

