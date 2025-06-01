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
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto, UpdateHabitDto } from './dto/habit.dto';
import {
  CreateHabitProgressDto,
  UpdateHabitProgressDto,
} from './dto/habit-progress.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  create(@Body(ValidationPipe) createHabitDto: CreateHabitDto) {
    return this.habitsService.create(createHabitDto);
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.habitsService.findAll(userId);
  }

  @Get('active')
  getActiveHabits(
    @Query('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.habitsService.getActiveHabits(userId, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('userId') userId: string) {
    return this.habitsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body(ValidationPipe) updateHabitDto: UpdateHabitDto,
  ) {
    return this.habitsService.update(id, userId, updateHabitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('userId') userId: string) {
    return this.habitsService.remove(id, userId);
  }

  // Progress endpoints
  @Post('progress')
  createProgress(
    @Body(ValidationPipe) createProgressDto: CreateHabitProgressDto,
  ) {
    return this.habitsService.createProgress(createProgressDto);
  }

  @Patch(':habitId/progress/:date')
  updateProgress(
    @Param('habitId') habitId: string,
    @Param('date') dateString: string,
    @Body(ValidationPipe) updateProgressDto: UpdateHabitProgressDto,
  ) {
    const date = new Date(dateString);
    return this.habitsService.updateProgress(habitId, date, updateProgressDto);
  }

  @Get(':habitId/progress')
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
