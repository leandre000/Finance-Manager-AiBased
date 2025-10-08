import { PartialType } from '@nestjs/mapped-types';
import { CreateBudgetDto } from './create-budget.dto.js';

export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {}

