import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsDecimal,
  IsArray,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

export enum GoalCategory {
  PERSONAL = 'PERSONAL',
  FINANCIAL = 'FINANCIAL',
  HEALTH = 'HEALTH',
  CAREER = 'CAREER',
  LEARNING = 'LEARNING',
  OTHER = 'OTHER',
}

export enum GoalStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}

export class CreateSubTaskDto {
  @IsString()
  name: string;
}

export class CreateGoalDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(GoalCategory)
  category: GoalCategory;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  targetDate?: Date;

  @IsOptional()
  @Transform(({ value }) => (value ? new Decimal(value) : undefined))
  currentValue?: Decimal;

  @IsOptional()
  @Transform(({ value }) => (value ? new Decimal(value) : undefined))
  targetValue?: Decimal;

  @IsString()
  userId: string;

  @IsOptional()
  @IsArray()
  @Type(() => CreateSubTaskDto)
  subTasks?: CreateSubTaskDto[];
}

export class UpdateGoalDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(GoalCategory)
  category?: GoalCategory;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  targetDate?: Date;

  @IsOptional()
  @IsEnum(GoalStatus)
  status?: GoalStatus;

  @IsOptional()
  @Transform(({ value }) => (value ? new Decimal(value) : undefined))
  currentValue?: Decimal;

  @IsOptional()
  @Transform(({ value }) => (value ? new Decimal(value) : undefined))
  targetValue?: Decimal;
}
