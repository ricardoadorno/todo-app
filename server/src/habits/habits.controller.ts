import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { HabitsService } from './habits.service';
import { CreateHabitDto, UpdateHabitDto } from './dto/habit.dto';
import {
  CreateHabitProgressDto,
  UpdateHabitProgressDto,
} from './dto/habit-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserId } from '../auth/decorators/user.decorator';

@ApiTags('habits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new habit' })
  @ApiResponse({
    status: 201,
    description: 'The habit has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(
    @Body(ValidationPipe) createHabitDto: CreateHabitDto,
    @UserId() userId: string,
  ) {
    return this.habitsService.create({ ...createHabitDto, userId });
  }

  @Get()
  @ApiOperation({ summary: 'Get all habits for a user' })
  @ApiResponse({ status: 200, description: 'Returns all habits for the user' })
  findAll(@UserId() userId: string) {
    return this.habitsService.findAll(userId);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active habits for a user' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of habits to return',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns active habits for the user',
  })
  getActiveHabits(@UserId() userId: string, @Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.habitsService.getActiveHabits(userId, limitNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a habit by ID' })
  @ApiParam({ name: 'id', description: 'Habit ID' })
  @ApiResponse({ status: 200, description: 'Returns the habit' })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  findOne(@Param('id') id: string, @UserId() userId: string) {
    return this.habitsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a habit' })
  @ApiParam({ name: 'id', description: 'Habit ID' })
  @ApiResponse({
    status: 200,
    description: 'The habit has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  update(
    @Param('id') id: string,
    @UserId() userId: string,
    @Body(ValidationPipe) updateHabitDto: UpdateHabitDto,
  ) {
    return this.habitsService.update(id, userId, updateHabitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a habit' })
  @ApiParam({ name: 'id', description: 'Habit ID' })
  @ApiResponse({
    status: 200,
    description: 'The habit has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  remove(@Param('id') id: string, @UserId() userId: string) {
    return this.habitsService.remove(id, userId);
  }

  // Progress endpoints
  @Post('progress')
  @ApiOperation({ summary: 'Create habit progress' })
  @ApiResponse({
    status: 201,
    description: 'The habit progress has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  createProgress(
    @Body(ValidationPipe) createProgressDto: CreateHabitProgressDto,
  ) {
    return this.habitsService.createProgress(createProgressDto);
  }

  @Patch(':habitId/progress/:date')
  @ApiOperation({ summary: 'Update habit progress for a specific date' })
  @ApiParam({ name: 'habitId', description: 'Habit ID' })
  @ApiParam({ name: 'date', description: 'Date (YYYY-MM-DD format)' })
  @ApiResponse({
    status: 200,
    description: 'The habit progress has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  updateProgress(
    @Param('habitId') habitId: string,
    @Param('date') dateString: string,
    @Body(ValidationPipe) updateProgressDto: UpdateHabitProgressDto,
  ) {
    const date = new Date(dateString);
    return this.habitsService.updateProgress(habitId, date, updateProgressDto);
  }

  @Get(':habitId/progress')
  @ApiOperation({ summary: 'Get habit progress for a date range' })
  @ApiParam({ name: 'habitId', description: 'Habit ID' })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({
    status: 200,
    description: 'Returns habit progress for the specified date range',
  })
  getProgressByDateRange(
    @Param('habitId') habitId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.habitsService.getProgressByDateRange(
      habitId,
      new Date(startDate),
      new Date(endDate),
    );
  }
}
