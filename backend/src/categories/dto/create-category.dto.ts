import { IsEnum, IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';
import { CategoryType } from '../entities/category.entity.js';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name!: string;

  @IsEnum(CategoryType)
  @IsNotEmpty()
  type!: CategoryType;

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
}

