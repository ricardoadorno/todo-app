import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsInt,
  Min,
  IsISO8601,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MeasurementType {
  WEIGHT = 'WEIGHT',
  BLOOD_PRESSURE = 'BLOOD_PRESSURE',
  HEART_RATE = 'HEART_RATE',
  SLEEP_HOURS = 'SLEEP_HOURS',
  WATER_INTAKE = 'WATER_INTAKE',
  OTHER = 'OTHER',
}

// DTOs para HealthMeasurement
export class CreateHealthMeasurementDto {
  @ApiProperty({ enum: MeasurementType, description: 'Tipo de medição' })
  @IsEnum(MeasurementType)
  type: MeasurementType;

  @ApiProperty({ description: 'Valor da medição' })
  @IsString()
  value: string;

  @ApiPropertyOptional({ description: 'Unidade de medida' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ description: 'Data da medição' })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'ID do usuário' })
  @IsString()
  userId: string;
}

export class UpdateHealthMeasurementDto {
  @ApiPropertyOptional({
    enum: MeasurementType,
    description: 'Tipo de medição',
  })
  @IsEnum(MeasurementType)
  @IsOptional()
  type?: MeasurementType;

  @ApiPropertyOptional({ description: 'Valor da medição' })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiPropertyOptional({ description: 'Unidade de medida' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({ description: 'Data da medição' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  date?: Date;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsString()
  @IsOptional()
  notes?: string;
}

// DTOs para Exercise
export class CreateExerciseDto {
  @ApiProperty({ description: 'Nome do exercício' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Duração em minutos' })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiPropertyOptional({ description: 'Calorias queimadas' })
  @IsInt()
  @Min(0)
  @IsOptional()
  caloriesBurned?: number;

  @ApiProperty({ description: 'Data do exercício' })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'ID do usuário' })
  @IsString()
  userId: string;
}

export class UpdateExerciseDto {
  @ApiPropertyOptional({ description: 'Nome do exercício' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Duração em minutos' })
  @IsInt()
  @Min(1)
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional({ description: 'Calorias queimadas' })
  @IsInt()
  @Min(0)
  @IsOptional()
  caloriesBurned?: number;

  @ApiPropertyOptional({ description: 'Data do exercício' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  date?: Date;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsString()
  @IsOptional()
  notes?: string;
}

// DTOs para DietPlan
export class CreateDietPlanDto {
  @ApiProperty({ description: 'Conteúdo do plano de dieta (markdown)' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Data de início' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiPropertyOptional({ description: 'Data de término' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'ID do usuário' })
  @IsString()
  userId: string;
}

export class UpdateDietPlanDto {
  @ApiPropertyOptional({ description: 'Conteúdo do plano de dieta (markdown)' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Data de início' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Data de término' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsString()
  @IsOptional()
  notes?: string;
}

// DTOs para WorkoutPlan
export class CreateWorkoutPlanDto {
  @ApiProperty({ description: 'Conteúdo do plano de treino (markdown)' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Data de início' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiPropertyOptional({ description: 'Data de término' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'ID do usuário' })
  @IsString()
  userId: string;
}

export class UpdateWorkoutPlanDto {
  @ApiPropertyOptional({
    description: 'Conteúdo do plano de treino (markdown)',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Data de início' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Data de término' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsString()
  @IsOptional()
  notes?: string;
}

// Resposta da API com todos os dados de saúde
export class HealthDataResponse {
  @ApiProperty({ description: 'Medições de saúde', type: [Object] })
  measurements: any[];

  @ApiProperty({ description: 'Exercícios', type: [Object] })
  exercises: any[];

  @ApiProperty({
    description: 'Plano de dieta atual',
    type: Object,
    required: false,
  })
  currentDietPlan?: any;

  @ApiProperty({
    description: 'Plano de treino atual',
    type: Object,
    required: false,
  })
  currentWorkoutPlan?: any;
}
