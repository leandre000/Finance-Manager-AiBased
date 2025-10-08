import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecurringTransactionsService } from './recurring-transactions.service.js';
import { RecurringTransactionsController } from './recurring-transactions.controller.js';
import { RecurringTransaction } from './entities/recurring-transaction.entity.js';
import { TransactionsModule } from '../transactions/transactions.module.js';
import { AccountsModule } from '../accounts/accounts.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecurringTransaction]),
    TransactionsModule,
    AccountsModule
  ],
  controllers: [RecurringTransactionsController],
  providers: [RecurringTransactionsService],
  exports: [RecurringTransactionsService]
})
export class RecurringTransactionsModule {}

