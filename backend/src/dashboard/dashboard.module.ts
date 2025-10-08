import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service.js';
import { DashboardController } from './dashboard.controller.js';
import { Transaction } from '../transactions/entities/transaction.entity.js';
import { Account } from '../accounts/entities/account.entity.js';
import { Budget } from '../budgets/entities/budget.entity.js';
import { Goal } from '../goals/entities/goal.entity.js';
import { Category } from '../categories/entities/category.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account, Budget, Goal, Category])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService]
})
export class DashboardModule {}

