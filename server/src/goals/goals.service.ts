import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto, UpdateGoalDto } from './dto/goal.dto';
import { Goal, SubTask } from '@prisma/client';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async create(createGoalDto: CreateGoalDto): Promise<Goal> {
    const { subTasks, ...goalData } = createGoalDto;

    return this.prisma.goal.create({
      data: {
        ...goalData,
        subTasks: subTasks
          ? {
              create: subTasks,
            }
          : undefined,
      },
      include: {
        subTasks: true,
      },
    });
  }

  async findAll(userId: string): Promise<Goal[]> {
    return this.prisma.goal.findMany({
      where: { userId },
      include: {
        subTasks: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Goal> {
    const goal = await this.prisma.goal.findFirst({
      where: { id, userId },
      include: {
        subTasks: true,
      },
    });

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    return goal;
  }

  async update(
    id: string,
    userId: string,
    updateGoalDto: UpdateGoalDto,
  ): Promise<Goal> {
    await this.findOne(id, userId); // Check if goal exists and belongs to user

    return this.prisma.goal.update({
      where: { id },
      data: updateGoalDto,
      include: {
        subTasks: true,
      },
    });
  }

  async remove(id: string, userId: string): Promise<Goal> {
    await this.findOne(id, userId); // Check if goal exists and belongs to user

    return this.prisma.goal.delete({
      where: { id },
      include: {
        subTasks: true,
      },
    });
  }

  async findByCategory(userId: string, category: string): Promise<Goal[]> {
    return this.prisma.goal.findMany({
      where: { userId, category: category as any },
      include: {
        subTasks: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStatus(userId: string, status: string): Promise<Goal[]> {
    return this.prisma.goal.findMany({
      where: { userId, status: status as any },
      include: {
        subTasks: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInProgress(userId: string, limit: number = 10): Promise<Goal[]> {
    return this.prisma.goal.findMany({
      where: {
        userId,
        status: 'IN_PROGRESS',
      },
      include: {
        subTasks: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });
  }

  async updateProgress(
    id: string,
    userId: string,
    currentValue: number,
  ): Promise<Goal> {
    await this.findOne(id, userId); // Check if goal exists and belongs to user

    const goal = await this.prisma.goal.update({
      where: { id },
      data: {
        currentValue,
        status: 'IN_PROGRESS',
      },
      include: {
        subTasks: true,
      },
    });

    // Auto-complete goal if target is reached
    if (
      goal.targetValue &&
      goal.currentValue &&
      goal.currentValue >= goal.targetValue
    ) {
      return this.prisma.goal.update({
        where: { id },
        data: {
          status: 'COMPLETED',
        },
        include: {
          subTasks: true,
        },
      });
    }

    return goal;
  }

  // SubTask methods
  async addSubTask(
    goalId: string,
    userId: string,
    name: string,
  ): Promise<SubTask> {
    await this.findOne(goalId, userId); // Check if goal exists and belongs to user

    return this.prisma.subTask.create({
      data: {
        name,
        goalId,
      },
    });
  }

  async toggleSubTask(subTaskId: string, userId: string): Promise<SubTask> {
    const subTask = await this.prisma.subTask.findUnique({
      where: { id: subTaskId },
      include: { goal: true },
    });

    if (!subTask || subTask.goal.userId !== userId) {
      throw new NotFoundException(`SubTask with ID ${subTaskId} not found`);
    }

    return this.prisma.subTask.update({
      where: { id: subTaskId },
      data: {
        completed: !subTask.completed,
      },
    });
  }

  async removeSubTask(subTaskId: string, userId: string): Promise<SubTask> {
    const subTask = await this.prisma.subTask.findUnique({
      where: { id: subTaskId },
      include: { goal: true },
    });

    if (!subTask || subTask.goal.userId !== userId) {
      throw new NotFoundException(`SubTask with ID ${subTaskId} not found`);
    }

    return this.prisma.subTask.delete({
      where: { id: subTaskId },
    });
  }
}
