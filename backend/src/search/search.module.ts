import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service.js';
import { SearchController } from './search.controller.js';
import { Transaction } from '../transactions/entities/transaction.entity.js';
import { Account } from '../accounts/entities/account.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { Budget } from '../budgets/entities/budget.entity.js';
import { Goal } from '../goals/entities/goal.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account, Category, Budget, Goal])],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService]
})
export class SearchModule {}

