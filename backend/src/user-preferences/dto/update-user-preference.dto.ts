import { IsString, IsBoolean, IsNumber, IsArray, IsObject, IsOptional, Length, Min } from 'class-validator';

export class UpdateUserPreferenceDto {
  @IsString()
  @IsOptional()
  @Length(3, 3)
  defaultCurrency?: string;

  @IsString()
  @IsOptional()
  @Length(2, 10)
  locale?: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  timezone?: string;

  @IsString()
  @IsOptional()
  @Length(1, 20)
  dateFormat?: string;

  @IsBoolean()
  @IsOptional()
  enableNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  emailNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  pushNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  budgetAlerts?: boolean;

  @IsBoolean()
  @IsOptional()
  goalMilestones?: boolean;

  @IsBoolean()
  @IsOptional()
  lowBalanceAlerts?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  lowBalanceThreshold?: number;

  @IsBoolean()
  @IsOptional()
  recurringReminders?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(1)
  recurringReminderDays?: number;

  @IsBoolean()
  @IsOptional()
  monthlyReports?: boolean;

  @IsBoolean()
  @IsOptional()
  weeklyDigest?: boolean;

  @IsString()
  @IsOptional()
  @Length(1, 10)
  theme?: string;

  @IsArray()
  @IsOptional()
  dashboardWidgets?: string[] | null;

  @IsArray()
  @IsOptional()
  hiddenCategories?: string[] | null;

  @IsObject()
  @IsOptional()
  customSettings?: Record<string, any> | null;
}

