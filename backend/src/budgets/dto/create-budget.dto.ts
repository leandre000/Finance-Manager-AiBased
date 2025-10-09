import { IsEnum, IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID, IsDateString, IsBoolean, Min, Length } from 'class-validator';
import { BudgetPeriod } from '../entities/budget.entity';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount!: number;

  @IsEnum(BudgetPeriod)
  @IsNotEmpty()
  period!: BudgetPeriod;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @IsBoolean()
  @IsOptional()
  rollover?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  notes?: string | null;

  @IsUUID()
  @IsOptional()
  categoryId?: string | null;
}

