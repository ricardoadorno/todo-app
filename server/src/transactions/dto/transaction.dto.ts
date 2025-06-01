import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsDecimal,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum Recurrence {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @Transform(({ value }) => new Decimal(value))
  amount: Decimal;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsEnum(Recurrence)
  recurrenceInterval?: Recurrence;

  @IsString()
  userId: string;
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @Transform(({ value }) => new Decimal(value))
  amount?: Decimal;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsEnum(Recurrence)
  recurrenceInterval?: Recurrence;
}
