import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Priority {
  URGENT_IMPORTANT = 'URGENT_IMPORTANT',
  IMPORTANT_NOT_URGENT = 'IMPORTANT_NOT_URGENT',
  URGENT_NOT_IMPORTANT = 'URGENT_NOT_IMPORTANT',
  NOT_URGENT_NOT_IMPORTANT = 'NOT_URGENT_NOT_IMPORTANT',
}

export enum TaskCategory {
  FINANCIAL = 'FINANCIAL',
  HEALTH = 'HEALTH',
  PERSONAL = 'PERSONAL',
  WORK = 'WORK',
  LEARNING = 'LEARNING',
  HOME = 'HOME',
  OTHER = 'OTHER',
}

export enum Recurrence {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export class CreateTaskDto {
  @ApiProperty({
    description: 'The name of the task',
    example: 'Complete project proposal',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the task',
    example: 'Write a complete proposal including budget and timeline',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Task priority based on Eisenhower matrix',
    enum: Priority,
    example: Priority.IMPORTANT_NOT_URGENT,
  })
  @IsEnum(Priority)
  priority: Priority;

  @ApiPropertyOptional({
    description: 'The due date for the task',
    example: '2025-06-10T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @ApiPropertyOptional({
    description: 'Number of repetitions required to complete this task',
    minimum: 1,
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  repetitionsRequired?: number;

  @ApiProperty({
    description: 'The category this task belongs to',
    enum: TaskCategory,
    example: TaskCategory.WORK,
  })
  @IsEnum(TaskCategory)
  category: TaskCategory;

  @ApiPropertyOptional({
    description: 'Task recurrence pattern',
    enum: Recurrence,
    example: Recurrence.WEEKLY,
  })
  @IsOptional()
  @IsEnum(Recurrence)
  recurrence?: Recurrence;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'The name of the task',
    example: 'Complete project proposal',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the task',
    example: 'Write a complete proposal including budget and timeline',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Task priority based on Eisenhower matrix',
    enum: Priority,
    example: Priority.IMPORTANT_NOT_URGENT,
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({
    description: 'The due date for the task',
    example: '2025-06-10T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @ApiPropertyOptional({
    description: 'Number of repetitions completed',
    minimum: 0,
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  repetitionsCompleted?: number;

  @ApiPropertyOptional({
    description: 'Number of repetitions required to complete this task',
    minimum: 1,
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  repetitionsRequired?: number;

  @ApiPropertyOptional({
    description: 'The category this task belongs to',
    enum: TaskCategory,
    example: TaskCategory.WORK,
  })
  @IsOptional()
  @IsEnum(TaskCategory)
  category?: TaskCategory;

  @ApiPropertyOptional({
    description: 'Task recurrence pattern',
    enum: Recurrence,
    example: Recurrence.WEEKLY,
  })
  @IsOptional()
  @IsEnum(Recurrence)
  recurrence?: Recurrence;
}
