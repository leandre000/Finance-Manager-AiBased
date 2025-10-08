import { IsEnum, IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, Length, Min } from 'class-validator';
import { AccountType } from '../entities/account.entity.js';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name!: string;

  @IsEnum(AccountType)
  @IsNotEmpty()
  type!: AccountType;

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  creditLimit?: number | null;

  @IsString()
  @IsOptional()
  @Length(3, 3)
  currency?: string;

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

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  includeInTotal?: boolean;
}

