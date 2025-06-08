import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskCategory,
  Priority,
} from './dto/task.dto';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId,
        repetitionsRequired: createTaskDto.repetitionsRequired || 1,
        recurrence: createTaskDto.recurrence || 'NONE',
      },
    });
  }

  async findAll(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(
    id: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    await this.findOne(id, userId); // Check if task exists and belongs to user

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: string, userId: string): Promise<Task> {
    await this.findOne(id, userId); // Check if task exists and belongs to user

    return this.prisma.task.delete({
      where: { id },
    });
  }

  async markCompleted(id: string, userId: string): Promise<Task> {
    const task = await this.findOne(id, userId);

    return this.prisma.task.update({
      where: { id },
      data: {
        repetitionsCompleted: task.repetitionsCompleted + 1,
      },
    });
  }

  async findByCategory(
    userId: string,
    category: TaskCategory,
  ): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId, category },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPriority(userId: string, priority: Priority): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId, priority },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUpcoming(userId: string, limit: number = 10): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        userId,
        dueDate: {
          gte: new Date(),
        },
      },
      orderBy: { dueDate: 'asc' },
      take: limit,
    });
  }
}
