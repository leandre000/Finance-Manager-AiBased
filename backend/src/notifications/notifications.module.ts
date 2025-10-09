import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from './entities/notification.entity';
import { Budget } from '../budgets/entities/budget.entity';
import { Goal } from '../goals/entities/goal.entity';
import { Account } from '../accounts/entities/account.entity';
import { RecurringTransaction } from '../recurring-transactions/entities/recurring-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Budget, Goal, Account, RecurringTransaction])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule {}

