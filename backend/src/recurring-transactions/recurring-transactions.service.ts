import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { RecurringTransaction, RecurringFrequency, RecurringStatus } from './entities/recurring-transaction.entity.js';
import { CreateRecurringTransactionDto } from './dto/create-recurring-transaction.dto.js';
import { UpdateRecurringTransactionDto } from './dto/update-recurring-transaction.dto.js';
import { TransactionsService } from '../transactions/transactions.service.js';
import { AccountsService } from '../accounts/accounts.service.js';

@Injectable()
export class RecurringTransactionsService {
  constructor(
    @InjectRepository(RecurringTransaction)
    private readonly recurringTransactionRepository: Repository<RecurringTransaction>,
    private readonly transactionsService: TransactionsService,
    private readonly accountsService: AccountsService
  ) {}

  async create(userId: string, createDto: CreateRecurringTransactionDto): Promise<RecurringTransaction> {
    // Verify account belongs to user
    await this.accountsService.findOne(createDto.accountId, userId);

    const nextOccurrence = this.calculateNextOccurrence(new Date(createDto.startDate), createDto.frequency);

    const recurringTransaction = this.recurringTransactionRepository.create({
      ...createDto,
      userId,
      nextOccurrence,
      occurrenceCount: 0
    });

    return await this.recurringTransactionRepository.save(recurringTransaction);
  }

  async findAll(userId: string, status?: RecurringStatus): Promise<RecurringTransaction[]> {
    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    return await this.recurringTransactionRepository.find({
      where,
      relations: ['account', 'category', 'toAccount'],
      order: { nextOccurrence: 'ASC' }
    });
  }

  async findOne(id: string, userId: string): Promise<RecurringTransaction> {
    const recurring = await this.recurringTransactionRepository.findOne({
      where: { id, userId },
      relations: ['account', 'category', 'toAccount']
    });

    if (!recurring) {
      throw new NotFoundException(`Recurring transaction with ID ${id} not found`);
    }

    return recurring;
  }

  async update(id: string, userId: string, updateDto: UpdateRecurringTransactionDto): Promise<RecurringTransaction> {
    const recurring = await this.findOne(id, userId);

    Object.assign(recurring, updateDto);

    // Recalculate next occurrence if frequency or start date changed
    if (updateDto.frequency || updateDto.startDate) {
      const baseDate = updateDto.startDate ? new Date(updateDto.startDate) : new Date(recurring.startDate);
      recurring.nextOccurrence = this.calculateNextOccurrence(baseDate, recurring.frequency);
    }

    return await this.recurringTransactionRepository.save(recurring);
  }

  async remove(id: string, userId: string): Promise<void> {
    const recurring = await this.findOne(id, userId);
    await this.recurringTransactionRepository.remove(recurring);
  }

  async pause(id: string, userId: string): Promise<RecurringTransaction> {
    const recurring = await this.findOne(id, userId);
    recurring.status = RecurringStatus.PAUSED;
    return await this.recurringTransactionRepository.save(recurring);
  }

  async resume(id: string, userId: string): Promise<RecurringTransaction> {
    const recurring = await this.findOne(id, userId);
    recurring.status = RecurringStatus.ACTIVE;
    return await this.recurringTransactionRepository.save(recurring);
  }

  async cancel(id: string, userId: string): Promise<RecurringTransaction> {
    const recurring = await this.findOne(id, userId);
    recurring.status = RecurringStatus.CANCELLED;
    return await this.recurringTransactionRepository.save(recurring);
  }

  async processRecurringTransactions(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueRecurring = await this.recurringTransactionRepository.find({
      where: {
        status: RecurringStatus.ACTIVE,
        nextOccurrence: LessThanOrEqual(today),
        autoCreate: true
      },
      relations: ['account', 'category', 'toAccount']
    });

    let processedCount = 0;

    for (const recurring of dueRecurring) {
      try {
        // Create the transaction
        await this.transactionsService.create(recurring.userId, {
          type: recurring.type,
          amount: recurring.amount,
          date: new Date(recurring.nextOccurrence).toISOString(),
          description: recurring.description,
          notes: `Auto-created from recurring: ${recurring.name}`,
          payee: recurring.payee,
          tags: recurring.tags,
          accountId: recurring.accountId,
          categoryId: recurring.categoryId,
          toAccountId: recurring.toAccountId,
          isRecurring: true,
          recurringFrequency: recurring.frequency
        });

        // Update recurring transaction
        recurring.lastProcessed = today;
        recurring.occurrenceCount += 1;
        recurring.nextOccurrence = this.calculateNextOccurrence(
          new Date(recurring.nextOccurrence),
          recurring.frequency
        );

        // Check if it should be completed
        if (recurring.maxOccurrences && recurring.occurrenceCount >= recurring.maxOccurrences) {
          recurring.status = RecurringStatus.COMPLETED;
        } else if (recurring.endDate && new Date(recurring.nextOccurrence) > new Date(recurring.endDate)) {
          recurring.status = RecurringStatus.COMPLETED;
        }

        await this.recurringTransactionRepository.save(recurring);
        processedCount++;
      } catch (error) {
        console.error(`Error processing recurring transaction ${recurring.id}:`, error);
      }
    }

    return processedCount;
  }

  async getUpcoming(userId: string, days: number = 30): Promise<RecurringTransaction[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const recurring = await this.recurringTransactionRepository.find({
      where: {
        userId,
        status: RecurringStatus.ACTIVE
      },
      relations: ['account', 'category', 'toAccount']
    });

    return recurring
      .filter(r => new Date(r.nextOccurrence) <= futureDate)
      .sort((a, b) => new Date(a.nextOccurrence).getTime() - new Date(b.nextOccurrence).getTime());
  }

  private calculateNextOccurrence(currentDate: Date, frequency: RecurringFrequency): Date {
    const nextDate = new Date(currentDate);

    switch (frequency) {
      case RecurringFrequency.DAILY:
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case RecurringFrequency.WEEKLY:
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case RecurringFrequency.BIWEEKLY:
        nextDate.setDate(nextDate.getDate() + 14);
        break;
      case RecurringFrequency.MONTHLY:
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case RecurringFrequency.QUARTERLY:
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case RecurringFrequency.YEARLY:
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    return nextDate;
  }
}

