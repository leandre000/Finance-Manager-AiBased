import { IsEnum, IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID, IsDateString, IsArray, Min, Length } from 'class-validator';
import { GoalStatus } from '../entities/goal.entity.js';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  targetAmount!: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  currentAmount?: number;

  @IsDateString()
  @IsOptional()
  targetDate?: string | null;

  @IsEnum(GoalStatus)
  @IsOptional()
  status?: GoalStatus;

  @IsString()
  @IsOptional()
  @Length(7, 7)
  color?: string | null;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  icon?: string | null;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsArray()
  @IsOptional()
  milestones?: { amount: number; description: string; achieved: boolean }[] | null;

  @IsUUID()
  @IsOptional()
  accountId?: string | null;
}

