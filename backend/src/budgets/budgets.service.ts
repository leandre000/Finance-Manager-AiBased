import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Budget } from './entities/budget.entity.js';
import { CreateBudgetDto } from './dto/create-budget.dto.js';
import { UpdateBudgetDto } from './dto/update-budget.dto.js';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>
  ) {}

  async create(userId: string, createBudgetDto: CreateBudgetDto): Promise<Budget> {
    const budget = this.budgetRepository.create({
      ...createBudgetDto,
      userId
    });
    return await this.budgetRepository.save(budget);
  }

  async findAll(userId: string, isActive?: boolean): Promise<Budget[]> {
    const where: any = { userId };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return await this.budgetRepository.find({
      where,
      relations: ['category'],
      order: { startDate: 'DESC' }
    });
  }

  async findOne(id: string, userId: string): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({
      where: { id, userId },
      relations: ['category']
    });

    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }

    return budget;
  }

  async update(id: string, userId: string, updateBudgetDto: UpdateBudgetDto): Promise<Budget> {
    const budget = await this.findOne(id, userId);

    Object.assign(budget, updateBudgetDto);
    return await this.budgetRepository.save(budget);
  }

  async remove(id: string, userId: string): Promise<void> {
    const budget = await this.findOne(id, userId);
    await this.budgetRepository.remove(budget);
  }

  async updateSpent(id: string, userId: string, amount: number): Promise<Budget> {
    const budget = await this.findOne(id, userId);
    budget.spent = Number(budget.spent) + amount;
    return await this.budgetRepository.save(budget);
  }

  async getCurrentBudgets(userId: string): Promise<Budget[]> {
    const today = new Date();
    
    return await this.budgetRepository.find({
      where: {
        userId,
        isActive: true
      },
      relations: ['category'],
      order: { startDate: 'DESC' }
    });
  }

  async getBudgetProgress(id: string, userId: string) {
    const budget = await this.findOne(id, userId);
    const percentage = (Number(budget.spent) / Number(budget.amount)) * 100;
    const remaining = Number(budget.amount) - Number(budget.spent);

    return {
      budget,
      percentage: Math.round(percentage * 100) / 100,
      remaining,
      isOverBudget: remaining < 0
    };
  }
}

