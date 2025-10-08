import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service.js';
import { NotificationsController } from './notifications.controller.js';
import { Notification } from './entities/notification.entity.js';
import { Budget } from '../budgets/entities/budget.entity.js';
import { Goal } from '../goals/entities/goal.entity.js';
import { Account } from '../accounts/entities/account.entity.js';
import { RecurringTransaction } from '../recurring-transactions/entities/recurring-transaction.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Budget, Goal, Account, RecurringTransaction])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule {}

