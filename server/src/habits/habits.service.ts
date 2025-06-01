import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto, UpdateHabitDto } from './dto/habit.dto';
import {
  CreateHabitProgressDto,
  UpdateHabitProgressDto,
} from './dto/habit-progress.dto';
import { Habit, HabitDayProgress } from '@prisma/client';

@Injectable()
export class HabitsService {
  constructor(private prisma: PrismaService) {}

  async create(createHabitDto: CreateHabitDto): Promise<Habit> {
    return this.prisma.habit.create({
      data: createHabitDto,
    });
  }

  async findAll(userId: string): Promise<Habit[]> {
    return this.prisma.habit.findMany({
      where: { userId },
      include: {
        progress: {
          orderBy: { date: 'desc' },
          take: 30, // Last 30 days
        },
      },
    });
  }

  async findOne(id: string, userId: string): Promise<Habit> {
    const habit = await this.prisma.habit.findFirst({
      where: { id, userId },
      include: {
        progress: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${id} not found`);
    }

    return habit;
  }

  async update(
    id: string,
    userId: string,
    updateHabitDto: UpdateHabitDto,
  ): Promise<Habit> {
    await this.findOne(id, userId); // Check if habit exists and belongs to user

    return this.prisma.habit.update({
      where: { id },
      data: updateHabitDto,
    });
  }

  async remove(id: string, userId: string): Promise<Habit> {
    await this.findOne(id, userId); // Check if habit exists and belongs to user

    return this.prisma.habit.delete({
      where: { id },
    });
  }

  // Habit Progress Methods
  async createProgress(
    createProgressDto: CreateHabitProgressDto,
  ): Promise<HabitDayProgress> {
    // Check if progress for this date already exists
    const existingProgress = await this.prisma.habitDayProgress.findUnique({
      where: {
        habitId_date: {
          habitId: createProgressDto.habitId,
          date: createProgressDto.date,
        },
      },
    });

    if (existingProgress) {
      // Update existing progress
      return this.prisma.habitDayProgress.update({
        where: {
          habitId_date: {
            habitId: createProgressDto.habitId,
            date: createProgressDto.date,
          },
        },
        data: {
          status: createProgressDto.status,
        },
      });
    }

    // Create new progress
    const progress = await this.prisma.habitDayProgress.create({
      data: createProgressDto,
    });

    // Update streak if completed
    if (createProgressDto.status === 'DONE') {
      await this.updateStreak(createProgressDto.habitId);
    }

    return progress;
  }

  async updateProgress(
    habitId: string,
    date: Date,
    updateProgressDto: UpdateHabitProgressDto,
  ): Promise<HabitDayProgress> {
    const progress = await this.prisma.habitDayProgress.update({
      where: {
        habitId_date: {
          habitId,
          date,
        },
      },
      data: updateProgressDto,
    });

    // Update streak
    await this.updateStreak(habitId);

    return progress;
  }

  async getProgressByDateRange(
    habitId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<HabitDayProgress[]> {
    return this.prisma.habitDayProgress.findMany({
      where: {
        habitId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  private async updateStreak(habitId: string): Promise<void> {
    // Get all progress for this habit, ordered by date desc
    const progressList = await this.prisma.habitDayProgress.findMany({
      where: { habitId },
      orderBy: { date: 'desc' },
    });

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate current streak
    for (const progress of progressList) {
      const progressDate = new Date(progress.date);
      progressDate.setHours(0, 0, 0, 0);

      if (progress.status === 'DONE') {
        streak++;
      } else {
        break;
      }
    }

    // Update habit streak
    await this.prisma.habit.update({
      where: { id: habitId },
      data: { streak },
    });
  }

  async getActiveHabits(userId: string, limit: number = 10): Promise<Habit[]> {
    return this.prisma.habit.findMany({
      where: { userId },
      orderBy: { streak: 'desc' },
      take: limit,
      include: {
        progress: {
          where: {
            date: {
              gte: new Date(new Date().setDate(new Date().getDate() - 7)), // Last 7 days
            },
          },
          orderBy: { date: 'desc' },
        },
      },
    });
  }
}
