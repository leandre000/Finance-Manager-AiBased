import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Transaction, TransactionType } from '../transactions/entities/transaction.entity';
import { Account } from '../accounts/entities/account.entity';
import { Category } from '../categories/entities/category.entity';
import { Budget } from '../budgets/entities/budget.entity';
import { Goal } from '../goals/entities/goal.entity';

export interface SearchFilters {
  query?: string;
  type?: TransactionType;
  accountIds?: string[];
  categoryIds?: string[];
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
  tags?: string[];
  payee?: string;
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>
  ) {}

  async searchTransactions(userId: string, filters: SearchFilters): Promise<Transaction[]> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.account', 'account')
      .leftJoinAndSelect('transaction.category', 'category')
      .leftJoinAndSelect('transaction.toAccount', 'toAccount')
      .where('transaction.userId = :userId', { userId });

    // Text search in description, notes, payee
    if (filters.query) {
      queryBuilder.andWhere(
        '(transaction.description ILIKE :query OR transaction.notes ILIKE :query OR transaction.payee ILIKE :query)',
        { query: `%${filters.query}%` }
      );
    }

    // Transaction type filter
    if (filters.type) {
      queryBuilder.andWhere('transaction.type = :type', { type: filters.type });
    }

    // Account filter
    if (filters.accountIds && filters.accountIds.length > 0) {
      queryBuilder.andWhere('transaction.accountId IN (:...accountIds)', {
        accountIds: filters.accountIds
      });
    }

    // Category filter
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      queryBuilder.andWhere('transaction.categoryId IN (:...categoryIds)', {
        categoryIds: filters.categoryIds
      });
    }

    // Amount range filter
    if (filters.minAmount !== undefined) {
      queryBuilder.andWhere('transaction.amount >= :minAmount', {
        minAmount: filters.minAmount
      });
    }

    if (filters.maxAmount !== undefined) {
      queryBuilder.andWhere('transaction.amount <= :maxAmount', {
        maxAmount: filters.maxAmount
      });
    }

    // Date range filter
    if (filters.startDate) {
      queryBuilder.andWhere('transaction.date >= :startDate', {
        startDate: filters.startDate
      });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('transaction.date <= :endDate', {
        endDate: filters.endDate
      });
    }

    // Tags filter (JSONB contains)
    if (filters.tags && filters.tags.length > 0) {
      queryBuilder.andWhere('transaction.tags @> :tags', {
        tags: JSON.stringify(filters.tags)
      });
    }

    // Payee filter
    if (filters.payee) {
      queryBuilder.andWhere('transaction.payee ILIKE :payee', {
        payee: `%${filters.payee}%`
      });
    }

    return await queryBuilder
      .orderBy('transaction.date', 'DESC')
      .addOrderBy('transaction.createdAt', 'DESC')
      .take(100) // Limit results for performance
      .getMany();
  }

  async searchAccounts(userId: string, query: string): Promise<Account[]> {
    return await this.accountRepository.find({
      where: [
        { userId, name: Like(`%${query}%`) },
        { userId, description: Like(`%${query}%`) }
      ],
      order: { name: 'ASC' }
    });
  }

  async searchCategories(userId: string, query: string): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: [
        { userId, name: Like(`%${query}%`) },
        { userId, description: Like(`%${query}%`) },
        { isSystem: true, name: Like(`%${query}%`) },
        { isSystem: true, description: Like(`%${query}%`) }
      ],
      order: { name: 'ASC' }
    });
  }

  async searchBudgets(userId: string, query: string): Promise<Budget[]> {
    return await this.budgetRepository.find({
      where: [
        { userId, name: Like(`%${query}%`) },
        { userId, notes: Like(`%${query}%`) }
      ],
      relations: ['category'],
      order: { name: 'ASC' }
    });
  }

  async searchGoals(userId: string, query: string): Promise<Goal[]> {
    return await this.goalRepository.find({
      where: [
        { userId, name: Like(`%${query}%`) },
        { userId, description: Like(`%${query}%`) }
      ],
      relations: ['account'],
      order: { name: 'ASC' }
    });
  }

  async globalSearch(userId: string, query: string) {
    const [transactions, accounts, categories, budgets, goals] = await Promise.all([
      this.searchTransactions(userId, { query }),
      this.searchAccounts(userId, query),
      this.searchCategories(userId, query),
      this.searchBudgets(userId, query),
      this.searchGoals(userId, query)
    ]);

    return {
      transactions: transactions.slice(0, 10),
      accounts: accounts.slice(0, 5),
      categories: categories.slice(0, 5),
      budgets: budgets.slice(0, 5),
      goals: goals.slice(0, 5),
      total: transactions.length + accounts.length + categories.length + budgets.length + goals.length
    };
  }

  async getQuickStats(userId: string, filters: SearchFilters) {
    const transactions = await this.searchTransactions(userId, filters);

    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const categoryBreakdown = new Map<string, { name: string; amount: number; count: number }>();

    for (const t of transactions) {
      if (t.type === TransactionType.EXPENSE) {
        const catId = t.categoryId || 'uncategorized';
        const catName = t.category?.name || 'Uncategorized';

        if (categoryBreakdown.has(catId)) {
          const existing = categoryBreakdown.get(catId)!;
          existing.amount += Number(t.amount);
          existing.count += 1;
        } else {
          categoryBreakdown.set(catId, {
            name: catName,
            amount: Number(t.amount),
            count: 1
          });
        }
      }
    }

    return {
      totalTransactions: transactions.length,
      totalIncome: Math.round(income * 100) / 100,
      totalExpenses: Math.round(expenses * 100) / 100,
      netIncome: Math.round((income - expenses) * 100) / 100,
      topCategories: Array.from(categoryBreakdown.values())
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)
        .map(c => ({
          ...c,
          amount: Math.round(c.amount * 100) / 100
        }))
    };
  }
}

