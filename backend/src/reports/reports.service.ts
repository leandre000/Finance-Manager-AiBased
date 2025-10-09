import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction, TransactionType } from '../transactions/entities/transaction.entity';
import { Account } from '../accounts/entities/account.entity';
import { Budget } from '../budgets/entities/budget.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async getIncomeStatement(userId: string, startDate: Date, endDate: Date) {
    const transactions = await this.transactionRepository.find({
      where: {
        userId,
        date: Between(startDate, endDate)
      },
      relations: ['category']
    });

    // Income breakdown
    const incomeTransactions = transactions.filter(t => t.type === TransactionType.INCOME);
    const incomeByCategory = this.groupByCategory(incomeTransactions);
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

    // Expense breakdown
    const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const expenseByCategory = this.groupByCategory(expenseTransactions);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

    const netIncome = totalIncome - totalExpenses;

    return {
      period: {
        startDate,
        endDate
      },
      income: {
        categories: incomeByCategory,
        total: Math.round(totalIncome * 100) / 100
      },
      expenses: {
        categories: expenseByCategory,
        total: Math.round(totalExpenses * 100) / 100
      },
      netIncome: Math.round(netIncome * 100) / 100,
      savingsRate: totalIncome > 0 ? Math.round((netIncome / totalIncome) * 10000) / 100 : 0
    };
  }

  async getBalanceSheet(userId: string) {
    const accounts = await this.accountRepository.find({
      where: { userId, isActive: true }
    });

    const assets = accounts.filter(acc => 
      acc.type === 'checking' || 
      acc.type === 'savings' || 
      acc.type === 'cash' || 
      acc.type === 'investment'
    );

    const liabilities = accounts.filter(acc => 
      acc.type === 'credit_card' || 
      acc.type === 'loan'
    );

    const totalAssets = assets.reduce((sum, acc) => sum + Number(acc.balance), 0);
    const totalLiabilities = liabilities.reduce((sum, acc) => sum + Math.abs(Number(acc.balance)), 0);
    const netWorth = totalAssets - totalLiabilities;

    return {
      assets: {
        accounts: assets.map(acc => ({
          id: acc.id,
          name: acc.name,
          type: acc.type,
          balance: Math.round(Number(acc.balance) * 100) / 100,
          currency: acc.currency
        })),
        total: Math.round(totalAssets * 100) / 100
      },
      liabilities: {
        accounts: liabilities.map(acc => ({
          id: acc.id,
          name: acc.name,
          type: acc.type,
          balance: Math.round(Math.abs(Number(acc.balance)) * 100) / 100,
          currency: acc.currency
        })),
        total: Math.round(totalLiabilities * 100) / 100
      },
      netWorth: Math.round(netWorth * 100) / 100
    };
  }

  async getCashFlowReport(userId: string, startDate: Date, endDate: Date) {
    const transactions = await this.transactionRepository.find({
      where: {
        userId,
        date: Between(startDate, endDate)
      },
      relations: ['category', 'account']
    });

    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const transfers = transactions
      .filter(t => t.type === TransactionType.TRANSFER)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netCashFlow = income - expenses;

    // Get account balances at start and end
    const accounts = await this.accountRepository.find({
      where: { userId, isActive: true }
    });

    const currentBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

    return {
      period: {
        startDate,
        endDate
      },
      cashInflow: Math.round(income * 100) / 100,
      cashOutflow: Math.round(expenses * 100) / 100,
      transfers: Math.round(transfers * 100) / 100,
      netCashFlow: Math.round(netCashFlow * 100) / 100,
      currentBalance: Math.round(currentBalance * 100) / 100
    };
  }

  async getBudgetReport(userId: string) {
    const budgets = await this.budgetRepository.find({
      where: { userId, isActive: true },
      relations: ['category']
    });

    const budgetDetails = budgets.map(budget => {
      const amount = Number(budget.amount);
      const spent = Number(budget.spent);
      const remaining = amount - spent;
      const percentage = amount > 0 ? (spent / amount) * 100 : 0;

      return {
        id: budget.id,
        name: budget.name,
        category: budget.category?.name || null,
        period: budget.period,
        startDate: budget.startDate,
        endDate: budget.endDate,
        amount: Math.round(amount * 100) / 100,
        spent: Math.round(spent * 100) / 100,
        remaining: Math.round(remaining * 100) / 100,
        percentage: Math.round(percentage * 100) / 100,
        status: percentage < 80 ? 'on-track' : percentage < 100 ? 'near-limit' : 'over-budget'
      };
    });

    const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0);
    const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent), 0);
    const overBudgetCount = budgetDetails.filter(b => b.status === 'over-budget').length;

    return {
      budgets: budgetDetails,
      summary: {
        totalBudget: Math.round(totalBudget * 100) / 100,
        totalSpent: Math.round(totalSpent * 100) / 100,
        totalRemaining: Math.round((totalBudget - totalSpent) * 100) / 100,
        percentage: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 10000) / 100 : 0,
        overBudgetCount,
        totalBudgetCount: budgets.length
      }
    };
  }

  async getMonthlyComparison(userId: string, months: number = 6) {
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

      const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

      result.push({
        month: monthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
        income: Math.round(income * 100) / 100,
        expenses: Math.round(expenses * 100) / 100,
        netIncome: Math.round((income - expenses) * 100) / 100,
        savingsRate: Math.round(savingsRate * 100) / 100,
        transactionCount: transactions.length
      });
    }

    // Calculate averages
    const avgIncome = result.reduce((sum, m) => sum + m.income, 0) / result.length;
    const avgExpenses = result.reduce((sum, m) => sum + m.expenses, 0) / result.length;
    const avgSavingsRate = result.reduce((sum, m) => sum + m.savingsRate, 0) / result.length;

    return {
      months: result,
      averages: {
        income: Math.round(avgIncome * 100) / 100,
        expenses: Math.round(avgExpenses * 100) / 100,
        netIncome: Math.round((avgIncome - avgExpenses) * 100) / 100,
        savingsRate: Math.round(avgSavingsRate * 100) / 100
      }
    };
  }

  async getTransactionExport(userId: string, startDate: Date, endDate: Date) {
    const transactions = await this.transactionRepository.find({
      where: {
        userId,
        date: Between(startDate, endDate)
      },
      relations: ['account', 'category', 'toAccount'],
      order: { date: 'DESC' }
    });

    return transactions.map(t => ({
      date: t.date,
      type: t.type,
      amount: Math.round(Number(t.amount) * 100) / 100,
      account: t.account.name,
      category: t.category?.name || 'Uncategorized',
      toAccount: t.toAccount?.name || null,
      description: t.description,
      payee: t.payee,
      notes: t.notes,
      tags: t.tags
    }));
  }

  private groupByCategory(transactions: Transaction[]) {
    const categoryMap = new Map<string, { name: string; amount: number; count: number }>();

    for (const transaction of transactions) {
      const categoryId = transaction.categoryId || 'uncategorized';
      const categoryName = transaction.category?.name || 'Uncategorized';

      if (categoryMap.has(categoryId)) {
        const existing = categoryMap.get(categoryId)!;
        existing.amount += Number(transaction.amount);
        existing.count += 1;
      } else {
        categoryMap.set(categoryId, {
          name: categoryName,
          amount: Number(transaction.amount),
          count: 1
        });
      }
    }

    return Array.from(categoryMap.values())
      .map(item => ({
        ...item,
        amount: Math.round(item.amount * 100) / 100
      }))
      .sort((a, b) => b.amount - a.amount);
  }
}

