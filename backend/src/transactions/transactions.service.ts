import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';
import { AccountsService } from '../accounts/accounts.service.js';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly accountsService: AccountsService
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    // Verify account belongs to user
    await this.accountsService.findOne(createTransactionDto.accountId, userId);

    // For transfers, verify toAccount exists and belongs to user
    if (createTransactionDto.type === TransactionType.TRANSFER && createTransactionDto.toAccountId) {
      await this.accountsService.findOne(createTransactionDto.toAccountId, userId);
    }

    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      userId
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    // Update account balance
    await this.updateAccountBalances(savedTransaction);

    return savedTransaction;
  }

  async findAll(
    userId: string,
    options?: {
      accountId?: string;
      categoryId?: string;
      type?: TransactionType;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<Transaction[]> {
    const where: any = { userId };

    if (options?.accountId) {
      where.accountId = options.accountId;
    }

    if (options?.categoryId) {
      where.categoryId = options.categoryId;
    }

    if (options?.type) {
      where.type = options.type;
    }

    if (options?.startDate && options?.endDate) {
      where.date = Between(new Date(options.startDate), new Date(options.endDate));
    } else if (options?.startDate) {
      where.date = MoreThanOrEqual(new Date(options.startDate));
    } else if (options?.endDate) {
      where.date = LessThanOrEqual(new Date(options.endDate));
    }

    return await this.transactionRepository.find({
      where,
      relations: ['account', 'category', 'toAccount'],
      order: { date: 'DESC', createdAt: 'DESC' }
    });
  }

  async findOne(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id, userId },
      relations: ['account', 'category', 'toAccount']
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async update(id: string, userId: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.findOne(id, userId);

    // Revert old balance changes
    await this.revertAccountBalances(transaction);

    // Update transaction
    Object.assign(transaction, updateTransactionDto);
    const updatedTransaction = await this.transactionRepository.save(transaction);

    // Apply new balance changes
    await this.updateAccountBalances(updatedTransaction);

    return updatedTransaction;
  }

  async remove(id: string, userId: string): Promise<void> {
    const transaction = await this.findOne(id, userId);

    // Revert balance changes
    await this.revertAccountBalances(transaction);

    await this.transactionRepository.remove(transaction);
  }

  async getStatistics(userId: string, startDate: string, endDate: string) {
    const transactions = await this.findAll(userId, { startDate, endDate });

    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const transfers = transactions
      .filter(t => t.type === TransactionType.TRANSFER)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expenses,
      transfers,
      netIncome: income - expenses,
      totalTransactions: transactions.length
    };
  }

  private async updateAccountBalances(transaction: Transaction): Promise<void> {
    const amount = Number(transaction.amount);

    if (transaction.type === TransactionType.INCOME) {
      await this.accountsService.updateBalance(transaction.accountId, transaction.userId, amount);
    } else if (transaction.type === TransactionType.EXPENSE) {
      await this.accountsService.updateBalance(transaction.accountId, transaction.userId, -amount);
    } else if (transaction.type === TransactionType.TRANSFER && transaction.toAccountId) {
      await this.accountsService.updateBalance(transaction.accountId, transaction.userId, -amount);
      await this.accountsService.updateBalance(transaction.toAccountId, transaction.userId, amount);
    }
  }

  private async revertAccountBalances(transaction: Transaction): Promise<void> {
    const amount = Number(transaction.amount);

    if (transaction.type === TransactionType.INCOME) {
      await this.accountsService.updateBalance(transaction.accountId, transaction.userId, -amount);
    } else if (transaction.type === TransactionType.EXPENSE) {
      await this.accountsService.updateBalance(transaction.accountId, transaction.userId, amount);
    } else if (transaction.type === TransactionType.TRANSFER && transaction.toAccountId) {
      await this.accountsService.updateBalance(transaction.accountId, transaction.userId, amount);
      await this.accountsService.updateBalance(transaction.toAccountId, transaction.userId, -amount);
    }
  }
}

