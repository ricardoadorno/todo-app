import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsDecimal,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

export enum InvestmentType {
  STOCK = 'STOCK',
  CRYPTO = 'CRYPTO',
  FUND = 'FUND',
  REAL_ESTATE = 'REAL_ESTATE',
  OTHER = 'OTHER',
}

export class CreateInvestmentDto {
  @IsString()
  name: string;

  @IsEnum(InvestmentType)
  type: InvestmentType;

  @IsOptional()
  @Transform(({ value }) => (value ? new Decimal(value) : undefined))
  quantity?: Decimal;

  @IsOptional()
  @Transform(({ value }) => (value ? new Decimal(value) : undefined))
  purchasePrice?: Decimal;

  @Transform(({ value }) => new Decimal(value))
  currentValue: Decimal;

  @IsDate()
  @Type(() => Date)
  purchaseDate: Date;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  userId: string;
}

export class UpdateInvestmentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(InvestmentType)
  type?: InvestmentType;

  @IsOptional()
  @Transform(({ value }) => (value ? new Decimal(value) : undefined))
  quantity?: Decimal;

  @IsOptional()
  @Transform(({ value }) => (value ? new Decimal(value) : undefined))
  purchasePrice?: Decimal;

  @IsOptional()
  @Transform(({ value }) => (value ? new Decimal(value) : undefined))
  currentValue?: Decimal;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  purchaseDate?: Date;

  @IsOptional()
  @IsString()
  notes?: string;
}
