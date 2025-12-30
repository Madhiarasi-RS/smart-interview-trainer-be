import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ResponseHelper, ApiResponse } from '../common/utils/response.helper';

/**
 * Users Controller
 *
 * Responsibilities:
 * - Accept user management requests
 * - Validate input via DTOs (class-validator)
 * - Call UsersService for business logic
 * - Return standardized responses
 *
 * Must NOT:
 * - Contain business logic
 * - Access database directly
 * - Handle authentication
 * - Call external services
 *
 * Endpoints:
 * - POST /users - Create new user
 * - GET /users/:id - Get user by ID
 * - PATCH /users/:id - Update user profile
 */

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users
   *
   * Create a new user
   *
   * Request Body:
   * {
   *   "name": "John Doe",
   *   "email": "john@example.com",
   *   "role": "STUDENT",
   *   "selectedDomains": ["JavaScript", "React"]
   * }
   *
   * Response:
   * {
   *   "success": true,
   *   "message": "User created successfully",
   *   "data": { ...user },
   *   "error": {}
   * }
   *
   * @throws ConflictException if email already exists
   */
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<ApiResponse> {
    const user = await this.usersService.createUser(createUserDto);
    return ResponseHelper.success('User created successfully', user);
  }

  /**
   * GET /users/:id
   *
   * Get user by ID
   *
   * Response:
   * {
   *   "success": true,
   *   "message": "User retrieved successfully",
   *   "data": { ...user },
   *   "error": {}
   * }
   *
   * @throws NotFoundException if user not found
   */
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<ApiResponse> {
    const user = await this.usersService.getUserById(id);
    return ResponseHelper.success('User retrieved successfully', user);
  }

  /**
   * PATCH /users/:id
   *
   * Update user profile
   *
   * Request Body (all fields optional):
   * {
   *   "name": "Jane Doe",
   *   "selectedDomains": ["Python", "Django", "FastAPI"]
   * }
   *
   * Response:
   * {
   *   "success": true,
   *   "message": "User profile updated successfully",
   *   "data": { ...updatedUser },
   *   "error": {}
   * }
   *
   * @throws NotFoundException if user not found
   */
  @Patch(':id')
  async updateUserProfile(
    @Param('id') id: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<ApiResponse> {
    const user = await this.usersService.updateUserProfile(id, updateUserProfileDto);
    return ResponseHelper.success('User profile updated successfully', user);
  }
}
