import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

/**
 * Users Service
 *
 * Responsibilities:
 * - CRUD operations for user entities
 * - User profile management
 * - Domain preference management
 * - Interview history reference management
 *
 * NO authentication logic
 * NO interview business logic
 * NO scorecard logic
 *
 * Business Logic:
 * - Create user with validation
 * - Update user profile (name, domains)
 * - Retrieve user by ID
 * - Manage interview ID references
 */

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Create a new user
   *
   * Business Rules:
   * - Email must be unique
   * - Name is required
   * - Role defaults to STUDENT
   * - selectedDomains defaults to empty array
   *
   * @param createUserDto - User creation data
   * @returns Created user document
   * @throws ConflictException if email already exists
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);

    try {
      const newUser = new this.userModel({
        ...createUserDto,
        interviewIds: [],
      });

      const savedUser = await newUser.save();
      this.logger.log(`User created successfully: ${savedUser._id}`);

      return savedUser;
    } catch (error) {
      // Handle duplicate email error
      if ((error as { code?: number }).code === 11000) {
        this.logger.warn(`Duplicate email attempted: ${createUserDto.email}`);
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Get user by ID
   *
   * @param id - User ID
   * @returns User document
   * @throws NotFoundException if user not found
   */
  async getUserById(id: string): Promise<UserDocument> {
    this.logger.log(`Fetching user by ID: ${id}`);

    const user = await this.userModel.findById(id).exec();

    if (!user) {
      this.logger.warn(`User not found: ${id}`);
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Get user by email
   *
   * @param email - User email
   * @returns User document or null
   */
  async getUserByEmail(email: string): Promise<UserDocument | null> {
    this.logger.log(`Fetching user by email: ${email}`);
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Update user profile
   *
   * Business Rules:
   * - Only name and selectedDomains can be updated
   * - Email is immutable
   * - Role is immutable
   *
   * @param id - User ID
   * @param updateUserProfileDto - Profile update data
   * @returns Updated user document
   * @throws NotFoundException if user not found
   */
  async updateUserProfile(
    id: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<UserDocument> {
    this.logger.log(`Updating user profile: ${id}`);

    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: updateUserProfileDto },
        { new: true, runValidators: true },
      )
      .exec();

    if (!user) {
      this.logger.warn(`User not found for update: ${id}`);
      throw new NotFoundException('User not found');
    }

    this.logger.log(`User profile updated successfully: ${id}`);
    return user;
  }

  /**
   * Add interview ID to user's interview history
   *
   * Internal method for interview module integration
   *
   * @param userId - User ID
   * @param interviewId - Interview ID to add
   * @throws NotFoundException if user not found
   */
  async addInterviewId(userId: string, interviewId: string): Promise<void> {
    this.logger.log(`Adding interview ${interviewId} to user ${userId}`);

    const result = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { interviewIds: interviewId } },
        { new: true },
      )
      .exec();

    if (!result) {
      throw new NotFoundException('User not found');
    }

    this.logger.log(`Interview ID added to user ${userId}`);
  }
}
