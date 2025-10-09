import { PartialType } from '@nestjs/mapped-types';
import { CreateRecurringTransactionDto } from './create-recurring-transaction.dto';

export class UpdateRecurringTransactionDto extends PartialType(CreateRecurringTransactionDto) {}

