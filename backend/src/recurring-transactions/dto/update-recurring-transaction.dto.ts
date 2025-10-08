import { PartialType } from '@nestjs/mapped-types';
import { CreateRecurringTransactionDto } from './create-recurring-transaction.dto.js';

export class UpdateRecurringTransactionDto extends PartialType(CreateRecurringTransactionDto) {}

