import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service.js';
import { ReportsController } from './reports.controller.js';
import { Transaction } from '../transactions/entities/transaction.entity.js';
import { Account } from '../accounts/entities/account.entity.js';
import { Budget } from '../budgets/entities/budget.entity.js';
import { Category } from '../categories/entities/category.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account, Budget, Category])],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService]
})
export class ReportsModule {}

