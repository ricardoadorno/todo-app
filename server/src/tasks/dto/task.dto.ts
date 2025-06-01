import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(Priority)
  priority: Priority;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @IsOptional()
  @IsInt()
  @Min(1)
  repetitionsRequired?: number;

  @IsEnum(TaskCategory)
  category: TaskCategory;

  @IsOptional()
  @IsEnum(Recurrence)
  recurrence?: Recurrence;

  @IsString()
  userId: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @IsOptional()
  @IsInt()
  @Min(0)
  repetitionsCompleted?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  repetitionsRequired?: number;

  @IsOptional()
  @IsEnum(TaskCategory)
  category?: TaskCategory;

  @IsOptional()
  @IsEnum(Recurrence)
  recurrence?: Recurrence;
}
