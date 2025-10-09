import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction, TransactionType } from '../transactions/entities/transaction.entity';
import { Account } from '../accounts/entities/account.entity';
import { Budget } from '../budgets/entities/budget.entity';
import { Goal, GoalStatus } from '../goals/entities/goal.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async getOverview(userId: string) {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Get total balance
    const accounts = await this.accountRepository.find({
      where: { userId, isActive: true, includeInTotal: true }
    });
    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

    // Get this month's transactions
    const monthTransactions = await this.transactionRepository.find({
      where: {
        userId,
        date: Between(startOfMonth, endOfMonth)
      }
    });

    const monthIncome = monthTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const monthExpenses = monthTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Get active budgets
    const activeBudgets = await this.budgetRepository.find({
      where: { userId, isActive: true }
    });

    const totalBudget = activeBudgets.reduce((sum, b) => sum + Number(b.amount), 0);
    const totalSpent = activeBudgets.reduce((sum, b) => sum + Number(b.spent), 0);

    // Get active goals
    const activeGoals = await this.goalRepository.find({
      where: { userId, status: GoalStatus.IN_PROGRESS }
    });

    const totalGoalTarget = activeGoals.reduce((sum, g) => sum + Number(g.targetAmount), 0);
    const totalGoalCurrent = activeGoals.reduce((sum, g) => sum + Number(g.currentAmount), 0);

    // Get account count
    const accountCount = accounts.length;

    return {
      totalBalance: Math.round(totalBalance * 100) / 100,
      accountCount,
      thisMonth: {
        income: Math.round(monthIncome * 100) / 100,
        expenses: Math.round(monthExpenses * 100) / 100,
        netIncome: Math.round((monthIncome - monthExpenses) * 100) / 100,
        transactionCount: monthTransactions.length
      },
      budgets: {
        total: Math.round(totalBudget * 100) / 100,
        spent: Math.round(totalSpent * 100) / 100,
        remaining: Math.round((totalBudget - totalSpent) * 100) / 100,
        percentage: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 10000) / 100 : 0,
        count: activeBudgets.length
      },
      goals: {
        target: Math.round(totalGoalTarget * 100) / 100,
        current: Math.round(totalGoalCurrent * 100) / 100,
        remaining: Math.round((totalGoalTarget - totalGoalCurrent) * 100) / 100,
        percentage: totalGoalTarget > 0 ? Math.round((totalGoalCurrent / totalGoalTarget) * 10000) / 100 : 0,
        count: activeGoals.length
      }
    };
  }

  async getCashFlow(userId: string, months: number = 6) {
    const result = [];
    const today = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

      const transactions = await this.transactionRepository.find({
        where: {
          userId,
          date: Between(startOfMonth, endOfMonth)
        }
      });

      const income = transactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expenses = transactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      result.push({
        month: monthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        income: Math.round(income * 100) / 100,
        expenses: Math.round(expenses * 100) / 100,
        netIncome: Math.round((income - expenses) * 100) / 100
      });
    }

    return result;
  }

  async getSpendingByCategory(userId: string, startDate: Date, endDate: Date) {
    const transactions = await this.transactionRepository.find({
      where: {
        userId,
        type: TransactionType.EXPENSE,
        date: Between(startDate, endDate)
      },
      relations: ['category']
    });

    const categoryMap = new Map<string, { name: string; amount: number; count: number; color: string; icon: string }>();

    for (const transaction of transactions) {
      const categoryId = transaction.categoryId || 'uncategorized';
      const categoryName = transaction.category?.name || 'Uncategorized';
      const categoryColor = transaction.category?.color || '#8D99AE';
      const categoryIcon = transaction.category?.icon || '📦';

      if (categoryMap.has(categoryId)) {
        const existing = categoryMap.get(categoryId)!;
        existing.amount += Number(transaction.amount);
        existing.count += 1;
      } else {
        categoryMap.set(categoryId, {
          name: categoryName,
          amount: Number(transaction.amount),
          count: 1,
          color: categoryColor,
          icon: categoryIcon
        });
      }
    }

    const result = Array.from(categoryMap.values())
      .map(item => ({
        ...item,
        amount: Math.round(item.amount * 100) / 100
      }))
      .sort((a, b) => b.amount - a.amount);

    const total = result.reduce((sum, item) => sum + item.amount, 0);

    return {
      categories: result.map(item => ({
        ...item,
        percentage: total > 0 ? Math.round((item.amount / total) * 10000) / 100 : 0
      })),
      total: Math.round(total * 100) / 100
    };
  }

  async getIncomeByCategory(userId: string, startDate: Date, endDate: Date) {
    const transactions = await this.transactionRepository.find({
      where: {
        userId,
        type: TransactionType.INCOME,
        date: Between(startDate, endDate)
      },
      relations: ['category']
    });

    const categoryMap = new Map<string, { name: string; amount: number; count: number; color: string; icon: string }>();

    for (const transaction of transactions) {
      const categoryId = transaction.categoryId || 'uncategorized';
      const categoryName = transaction.category?.name || 'Uncategorized';
      const categoryColor = transaction.category?.color || '#3A86FF';
      const categoryIcon = transaction.category?.icon || '💵';

      if (categoryMap.has(categoryId)) {
        const existing = categoryMap.get(categoryId)!;
        existing.amount += Number(transaction.amount);
        existing.count += 1;
      } else {
        categoryMap.set(categoryId, {
          name: categoryName,
          amount: Number(transaction.amount),
          count: 1,
          color: categoryColor,
          icon: categoryIcon
        });
      }
    }

    const result = Array.from(categoryMap.values())
      .map(item => ({
        ...item,
        amount: Math.round(item.amount * 100) / 100
      }))
      .sort((a, b) => b.amount - a.amount);

    const total = result.reduce((sum, item) => sum + item.amount, 0);

    return {
      categories: result.map(item => ({
        ...item,
        percentage: total > 0 ? Math.round((item.amount / total) * 10000) / 100 : 0
      })),
      total: Math.round(total * 100) / 100
    };
  }

  async getRecentTransactions(userId: string, limit: number = 10) {
    return await this.transactionRepository.find({
      where: { userId },
      relations: ['account', 'category'],
      order: { date: 'DESC', createdAt: 'DESC' },
      take: limit
    });
  }

  async getAccountsOverview(userId: string) {
    const accounts = await this.accountRepository.find({
      where: { userId, isActive: true },
      order: { balance: 'DESC' }
    });

    const total = accounts
      .filter(acc => acc.includeInTotal)
      .reduce((sum, acc) => sum + Number(acc.balance), 0);

    return {
      accounts: accounts.map(acc => ({
        id: acc.id,
        name: acc.name,
        type: acc.type,
        balance: Math.round(Number(acc.balance) * 100) / 100,
        currency: acc.currency,
        color: acc.color,
        icon: acc.icon,
        percentage: total > 0 ? Math.round((Number(acc.balance) / total) * 10000) / 100 : 0
      })),
      total: Math.round(total * 100) / 100,
      count: accounts.length
    };
  }

  async getBudgetStatus(userId: string) {
    const budgets = await this.budgetRepository.find({
      where: { userId, isActive: true },
      relations: ['category'],
      order: { endDate: 'ASC' }
    });

    return budgets.map(budget => {
      const percentage = Number(budget.amount) > 0 
        ? Math.round((Number(budget.spent) / Number(budget.amount)) * 10000) / 100 
        : 0;
      const remaining = Number(budget.amount) - Number(budget.spent);

      return {
        id: budget.id,
        name: budget.name,
        category: budget.category?.name || null,
        categoryIcon: budget.category?.icon || null,
        categoryColor: budget.category?.color || null,
        amount: Math.round(Number(budget.amount) * 100) / 100,
        spent: Math.round(Number(budget.spent) * 100) / 100,
        remaining: Math.round(remaining * 100) / 100,
        percentage,
        period: budget.period,
        startDate: budget.startDate,
        endDate: budget.endDate,
        isOverBudget: remaining < 0
      };
    });
  }

  async getFinancialHealth(userId: string) {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Get accounts
    const accounts = await this.accountRepository.find({
      where: { userId, isActive: true, includeInTotal: true }
    });
    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

    // Get this month's data
    const monthTransactions = await this.transactionRepository.find({
      where: {
        userId,
        date: Between(startOfMonth, endOfMonth)
      }
    });

    const monthIncome = monthTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const monthExpenses = monthTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const savingsRate = monthIncome > 0 ? ((monthIncome - monthExpenses) / monthIncome) * 100 : 0;

    // Calculate financial health score (0-100)
    let score = 0;
    const insights = [];

    // Factor 1: Positive balance (20 points)
    if (totalBalance > 0) {
      score += 20;
      insights.push({ type: 'positive', message: 'You have a positive account balance' });
    } else {
      insights.push({ type: 'warning', message: 'Your account balance is negative' });
    }

    // Factor 2: Savings rate (30 points)
    if (savingsRate > 20) {
      score += 30;
      insights.push({ type: 'positive', message: `Excellent savings rate: ${Math.round(savingsRate)}%` });
    } else if (savingsRate > 10) {
      score += 20;
      insights.push({ type: 'neutral', message: `Good savings rate: ${Math.round(savingsRate)}%` });
    } else if (savingsRate > 0) {
      score += 10;
      insights.push({ type: 'warning', message: `Low savings rate: ${Math.round(savingsRate)}%` });
    } else {
      insights.push({ type: 'negative', message: 'You are spending more than you earn this month' });
    }

    // Factor 3: Budget adherence (25 points)
    const budgets = await this.budgetRepository.find({
      where: { userId, isActive: true }
    });

    if (budgets.length > 0) {
      const overBudgetCount = budgets.filter(b => Number(b.spent) > Number(b.amount)).length;
      const budgetAdherence = ((budgets.length - overBudgetCount) / budgets.length) * 100;

      if (budgetAdherence === 100) {
        score += 25;
        insights.push({ type: 'positive', message: 'All budgets are on track' });
      } else if (budgetAdherence >= 75) {
        score += 18;
        insights.push({ type: 'neutral', message: `${Math.round(budgetAdherence)}% of budgets are on track` });
      } else {
        score += 10;
        insights.push({ type: 'warning', message: `Only ${Math.round(budgetAdherence)}% of budgets are on track` });
      }
    } else {
      score += 12;
      insights.push({ type: 'neutral', message: 'Consider setting up budgets to track spending' });
    }

    // Factor 4: Goals progress (25 points)
    const goals = await this.goalRepository.find({
      where: { userId, status: GoalStatus.IN_PROGRESS }
    });

    if (goals.length > 0) {
      const avgProgress = goals.reduce((sum, g) => {
        return sum + (Number(g.currentAmount) / Number(g.targetAmount));
      }, 0) / goals.length;

      if (avgProgress >= 0.75) {
        score += 25;
        insights.push({ type: 'positive', message: 'Great progress on your goals!' });
      } else if (avgProgress >= 0.5) {
        score += 18;
        insights.push({ type: 'neutral', message: 'Good progress on your goals' });
      } else if (avgProgress >= 0.25) {
        score += 10;
        insights.push({ type: 'neutral', message: 'Keep working toward your goals' });
      } else {
        score += 5;
        insights.push({ type: 'warning', message: 'Limited progress on your goals' });
      }
    } else {
      score += 12;
      insights.push({ type: 'neutral', message: 'Consider setting financial goals' });
    }

    let healthStatus = 'Needs Improvement';
    if (score >= 80) healthStatus = 'Excellent';
    else if (score >= 60) healthStatus = 'Good';
    else if (score >= 40) healthStatus = 'Fair';

    return {
      score: Math.round(score),
      status: healthStatus,
      insights,
      metrics: {
        totalBalance: Math.round(totalBalance * 100) / 100,
        savingsRate: Math.round(savingsRate * 100) / 100,
        monthlyIncome: Math.round(monthIncome * 100) / 100,
        monthlyExpenses: Math.round(monthExpenses * 100) / 100
      }
    };
  }
}

