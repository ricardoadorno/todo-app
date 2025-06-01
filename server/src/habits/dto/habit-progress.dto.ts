import { IsString, IsEnum, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export enum HabitProgressStatus {
  DONE = 'DONE',
  SKIPPED = 'SKIPPED',
  MISSED = 'MISSED',
}

export class CreateHabitProgressDto {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsEnum(HabitProgressStatus)
  status: HabitProgressStatus;

  @IsString()
  habitId: string;
}

export class UpdateHabitProgressDto {
  @IsOptional()
  @IsEnum(HabitProgressStatus)
  status?: HabitProgressStatus;
}
