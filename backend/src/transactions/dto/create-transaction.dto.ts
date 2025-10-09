import { IsEnum, IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID, IsDateString, IsArray, IsBoolean, Min, Length } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type!: TransactionType;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount!: number;

  @IsDateString()
  @IsNotEmpty()
  date!: string;

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

  @IsArray()
  @IsOptional()
  attachments?: string[] | null;

  @IsUUID()
  @IsNotEmpty()
  accountId!: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string | null;

  @IsUUID()
  @IsOptional()
  toAccountId?: string | null;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  recurringFrequency?: string | null;
}

