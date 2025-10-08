import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service.js';
import { RecurringTransactionsModule } from '../recurring-transactions/recurring-transactions.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    RecurringTransactionsModule,
    NotificationsModule
  ],
  providers: [SchedulerService],
  exports: [SchedulerService]
})
export class SchedulerModule {}

