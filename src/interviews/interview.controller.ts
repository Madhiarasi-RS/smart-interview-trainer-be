import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { InterviewService } from './interview.service';
import { ResponseHelper, ApiResponse } from '../common/utils/response.helper';

/**
 * Interview Controller
 *
 * Responsibilities:
 * - Accept interview session requests
 * - Validate input via DTOs
 * - Call InterviewService for business logic
 * - Return standardized responses
 *
 * Must NOT:
 * - Contain business logic
 * - Access database directly
 * - Handle WebSocket connections (use gateway)
 */

@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  /**
   * Create new interview session
   * TODO: Add CreateInterviewDto
   */
  @Post()
  async create(@Body() body: Record<string, unknown>): Promise<ApiResponse> {
    const result = await this.interviewService.create(body);
    return ResponseHelper.success(
      'Interview session created successfully',
      result,
    );
  }

  /**
   * Get all interviews for current user
   * TODO: Add pagination and filtering
   */
  @Get()
  async findAll(): Promise<ApiResponse> {
    const result = await this.interviewService.findAll();
    return ResponseHelper.success('Interviews retrieved successfully', result);
  }

  /**
   * Get specific interview by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse> {
    const result = await this.interviewService.findOne(id);
    return ResponseHelper.success('Interview retrieved successfully', result);
  }

  /**
   * Update interview session
   * TODO: Add UpdateInterviewDto
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ): Promise<ApiResponse> {
    const result = await this.interviewService.update(id, body);
    return ResponseHelper.success('Interview updated successfully', result);
  }

  /**
   * Delete interview session
   */
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse> {
    const result = await this.interviewService.remove(id);
    return ResponseHelper.success('Interview deleted successfully', result);
  }
}
