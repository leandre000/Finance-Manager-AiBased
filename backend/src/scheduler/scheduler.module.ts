import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { RecurringTransactionsModule } from '../recurring-transactions/recurring-transactions.module';
import { NotificationsModule } from '../notifications/notifications.module';

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

