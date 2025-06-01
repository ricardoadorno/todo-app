import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateHabitDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  userId: string;
}

export class UpdateHabitDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  streak?: number;
}
