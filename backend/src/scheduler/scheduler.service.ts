import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RecurringTransactionsService } from '../recurring-transactions/recurring-transactions.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly recurringTransactionsService: RecurringTransactionsService,
    private readonly notificationsService: NotificationsService
  ) {}

  // Run every day at 1:00 AM to process recurring transactions
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async processRecurringTransactions() {
    this.logger.log('Processing recurring transactions...');
    
    try {
      const count = await this.recurringTransactionsService.processRecurringTransactions();
      this.logger.log(`Processed ${count} recurring transactions`);
    } catch (error) {
      this.logger.error('Error processing recurring transactions:', error);
    }
  }

  // Run every day at 2:00 AM to check budget alerts
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async checkBudgetAlerts() {
    this.logger.log('Checking budget alerts...');
    
    try {
      const count = await this.notificationsService.checkBudgetAlerts();
      this.logger.log(`Generated ${count} budget alerts`);
    } catch (error) {
      this.logger.error('Error checking budget alerts:', error);
    }
  }

  // Run every day at 3:00 AM to check goal milestones
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async checkGoalMilestones() {
    this.logger.log('Checking goal milestones...');
    
    try {
      const count = await this.notificationsService.checkGoalMilestones();
      this.logger.log(`Generated ${count} goal milestone notifications`);
    } catch (error) {
      this.logger.error('Error checking goal milestones:', error);
    }
  }

  // Run every day at 4:00 AM to check low balance
  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async checkLowBalance() {
    this.logger.log('Checking low balance...');
    
    try {
      const count = await this.notificationsService.checkLowBalance();
      this.logger.log(`Generated ${count} low balance alerts`);
    } catch (error) {
      this.logger.error('Error checking low balance:', error);
    }
  }

  // Run every day at 5:00 AM to check upcoming recurring transactions
  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async checkUpcomingRecurring() {
    this.logger.log('Checking upcoming recurring transactions...');
    
    try {
      const count = await this.notificationsService.checkUpcomingRecurring();
      this.logger.log(`Generated ${count} upcoming recurring notifications`);
    } catch (error) {
      this.logger.error('Error checking upcoming recurring transactions:', error);
    }
  }

  // Run all notification checks at 6:00 AM daily
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async runAllNotificationChecks() {
    this.logger.log('Running all notification checks...');
    
    try {
      const results = await this.notificationsService.runAllChecks();
      this.logger.log('Notification check results:', results);
    } catch (error) {
      this.logger.error('Error running all notification checks:', error);
    }
  }

  // Run every hour to cleanup old read notifications (older than 30 days)
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupOldNotifications() {
    this.logger.debug('Cleaning up old notifications...');
    
    // This would require adding a cleanup method to NotificationsService
    // For now, just log that we would do this
    this.logger.debug('Old notification cleanup would run here');
  }
}

