import { IsEnum, IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID, IsDateString, IsArray, IsBoolean, Min, Length } from 'class-validator';
import { TransactionType } from '../../transactions/entities/transaction.entity.js';
import { RecurringFrequency } from '../entities/recurring-transaction.entity.js';

export class CreateRecurringTransactionDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name!: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type!: TransactionType;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount!: number;

  @IsEnum(RecurringFrequency)
  @IsNotEmpty()
  frequency!: RecurringFrequency;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsOptional()
  endDate?: string | null;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsString()
  @IsOptional()
  notes?: string | null;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  payee?: string | null;

  @IsArray()
  @IsOptional()
  tags?: string[] | null;

  @IsNumber()
  @IsOptional()
  @Min(1)
  maxOccurrences?: number | null;

  @IsBoolean()
  @IsOptional()
  autoCreate?: boolean;

  @IsBoolean()
  @IsOptional()
  notifyBeforeCreation?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(1)
  notifyDaysBefore?: number;

  @IsUUID()
  @IsNotEmpty()
  accountId!: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string | null;

  @IsUUID()
  @IsOptional()
  toAccountId?: string | null;
}

