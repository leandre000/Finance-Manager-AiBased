import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Notification, NotificationType, NotificationPriority } from './entities/notification.entity';
import { Budget } from '../budgets/entities/budget.entity';
import { Goal, GoalStatus } from '../goals/entities/goal.entity';
import { Account } from '../accounts/entities/account.entity';
import { RecurringTransaction, RecurringStatus } from '../recurring-transactions/entities/recurring-transaction.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(RecurringTransaction)
    private readonly recurringRepository: Repository<RecurringTransaction>
  ) {}

  async create(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    priority: NotificationPriority = NotificationPriority.MEDIUM,
    data?: any,
    actionUrl?: string,
    actionLabel?: string
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId,
      type,
      title,
      message,
      priority,
      data,
      actionUrl,
      actionLabel,
      isActionable: !!actionUrl
    });

    return await this.notificationRepository.save(notification);
  }

  async findAll(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    const where: any = { userId };

    if (unreadOnly) {
      where.isRead = false;
    }

    return await this.notificationRepository.find({
      where,
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string, userId: string): Promise<Notification | null> {
    return await this.notificationRepository.findOne({
      where: { id, userId }
    });
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId }
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.isRead = true;
    notification.readAt = new Date();

    return await this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.notificationRepository.delete({ id, userId });
  }

  async deleteAll(userId: string): Promise<void> {
    await this.notificationRepository.delete({ userId });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationRepository.count({
      where: { userId, isRead: false }
    });
  }

  // Automated notification generation
  async checkBudgetAlerts(): Promise<number> {
    const budgets = await this.budgetRepository.find({
      where: { isActive: true },
      relations: ['category']
    });

    let alertCount = 0;

    for (const budget of budgets) {
      const percentage = (Number(budget.spent) / Number(budget.amount)) * 100;

      // 80% warning
      if (percentage >= 80 && percentage < 100) {
        await this.create(
          budget.userId,
          NotificationType.BUDGET_ALERT,
          `Budget Warning: ${budget.name}`,
          `You've used ${Math.round(percentage)}% of your ${budget.name} budget. ${this.formatCurrency(Number(budget.amount) - Number(budget.spent))} remaining.`,
          NotificationPriority.MEDIUM,
          { budgetId: budget.id, percentage, remaining: Number(budget.amount) - Number(budget.spent) },
          `/budgets/${budget.id}`,
          'View Budget'
        );
        alertCount++;
      }

      // Budget exceeded
      if (percentage >= 100) {
        await this.create(
          budget.userId,
          NotificationType.BUDGET_EXCEEDED,
          `Budget Exceeded: ${budget.name}`,
          `You've exceeded your ${budget.name} budget by ${this.formatCurrency(Number(budget.spent) - Number(budget.amount))}!`,
          NotificationPriority.HIGH,
          { budgetId: budget.id, percentage, overAmount: Number(budget.spent) - Number(budget.amount) },
          `/budgets/${budget.id}`,
          'View Budget'
        );
        alertCount++;
      }
    }

    return alertCount;
  }

  async checkGoalMilestones(): Promise<number> {
    const goals = await this.goalRepository.find({
      where: { status: GoalStatus.IN_PROGRESS }
    });

    let alertCount = 0;

    for (const goal of goals) {
      const percentage = (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100;
      const milestones = [25, 50, 75, 100];

      for (const milestone of milestones) {
        if (percentage >= milestone && percentage < milestone + 5) {
          const type = milestone === 100 ? NotificationType.GOAL_COMPLETED : NotificationType.GOAL_MILESTONE;
          const priority = milestone === 100 ? NotificationPriority.HIGH : NotificationPriority.MEDIUM;

          await this.create(
            goal.userId,
            type,
            milestone === 100 ? `🎉 Goal Achieved: ${goal.name}` : `Milestone Reached: ${goal.name}`,
            milestone === 100
              ? `Congratulations! You've reached your goal of ${this.formatCurrency(Number(goal.targetAmount))}!`
              : `Great progress! You're ${milestone}% of the way to your goal. Keep it up!`,
            priority,
            { goalId: goal.id, percentage, milestone },
            `/goals/${goal.id}`,
            'View Goal'
          );
          alertCount++;
        }
      }
    }

    return alertCount;
  }

  async checkLowBalance(): Promise<number> {
    const accounts = await this.accountRepository.find({
      where: { isActive: true }
    });

    let alertCount = 0;

    for (const account of accounts) {
      const balance = Number(account.balance);

      // Low balance warning (below $100 or negative)
      if (balance < 100 && balance >= 0) {
        await this.create(
          account.userId,
          NotificationType.LOW_BALANCE,
          `Low Balance: ${account.name}`,
          `Your ${account.name} balance is low: ${this.formatCurrency(balance)}`,
          NotificationPriority.MEDIUM,
          { accountId: account.id, balance },
          `/accounts/${account.id}`,
          'View Account'
        );
        alertCount++;
      } else if (balance < 0) {
        await this.create(
          account.userId,
          NotificationType.LOW_BALANCE,
          `Negative Balance: ${account.name}`,
          `Your ${account.name} has a negative balance: ${this.formatCurrency(balance)}`,
          NotificationPriority.HIGH,
          { accountId: account.id, balance },
          `/accounts/${account.id}`,
          'View Account'
        );
        alertCount++;
      }
    }

    return alertCount;
  }

  async checkUpcomingRecurring(): Promise<number> {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const upcoming = await this.recurringRepository.find({
      where: {
        status: RecurringStatus.ACTIVE,
        notifyBeforeCreation: true
      }
    });

    let alertCount = 0;

    for (const recurring of upcoming) {
      const daysUntil = Math.ceil(
        (new Date(recurring.nextOccurrence).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntil <= recurring.notifyDaysBefore && daysUntil > 0) {
        await this.create(
          recurring.userId,
          NotificationType.RECURRING_UPCOMING,
          `Upcoming: ${recurring.name}`,
          `${recurring.name} will occur in ${daysUntil} day(s) - ${this.formatCurrency(Number(recurring.amount))}`,
          NotificationPriority.LOW,
          { recurringId: recurring.id, daysUntil, amount: Number(recurring.amount) },
          `/recurring-transactions/${recurring.id}`,
          'View Details'
        );
        alertCount++;
      }
    }

    return alertCount;
  }

  async runAllChecks(): Promise<{ budgets: number; goals: number; balance: number; recurring: number }> {
    const [budgets, goals, balance, recurring] = await Promise.all([
      this.checkBudgetAlerts(),
      this.checkGoalMilestones(),
      this.checkLowBalance(),
      this.checkUpcomingRecurring()
    ]);

    return { budgets, goals, balance, recurring };
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}

