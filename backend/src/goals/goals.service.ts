import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal, GoalStatus } from './entities/goal.entity.js';
import { CreateGoalDto } from './dto/create-goal.dto.js';
import { UpdateGoalDto } from './dto/update-goal.dto.js';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>
  ) {}

  async create(userId: string, createGoalDto: CreateGoalDto): Promise<Goal> {
    const goal = this.goalRepository.create({
      ...createGoalDto,
      userId
    });
    return await this.goalRepository.save(goal);
  }

  async findAll(userId: string, status?: GoalStatus): Promise<Goal[]> {
    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    return await this.goalRepository.find({
      where,
      relations: ['account'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string, userId: string): Promise<Goal> {
    const goal = await this.goalRepository.findOne({
      where: { id, userId },
      relations: ['account']
    });

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    return goal;
  }

  async update(id: string, userId: string, updateGoalDto: UpdateGoalDto): Promise<Goal> {
    const goal = await this.findOne(id, userId);

    Object.assign(goal, updateGoalDto);

    // Auto-complete goal if target reached
    if (Number(goal.currentAmount) >= Number(goal.targetAmount) && goal.status === GoalStatus.IN_PROGRESS) {
      goal.status = GoalStatus.COMPLETED;
    }

    return await this.goalRepository.save(goal);
  }

  async remove(id: string, userId: string): Promise<void> {
    const goal = await this.findOne(id, userId);
    await this.goalRepository.remove(goal);
  }

  async addToGoal(id: string, userId: string, amount: number): Promise<Goal> {
    const goal = await this.findOne(id, userId);
    goal.currentAmount = Number(goal.currentAmount) + amount;

    // Auto-complete goal if target reached
    if (goal.currentAmount >= Number(goal.targetAmount) && goal.status === GoalStatus.IN_PROGRESS) {
      goal.status = GoalStatus.COMPLETED;
    }

    return await this.goalRepository.save(goal);
  }

  async getGoalProgress(id: string, userId: string) {
    const goal = await this.findOne(id, userId);
    const percentage = (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100;
    const remaining = Number(goal.targetAmount) - Number(goal.currentAmount);

    let daysRemaining = null;
    if (goal.targetDate) {
      const today = new Date();
      const target = new Date(goal.targetDate);
      const diffTime = target.getTime() - today.getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return {
      goal,
      percentage: Math.round(percentage * 100) / 100,
      remaining,
      daysRemaining,
      isCompleted: goal.status === GoalStatus.COMPLETED
    };
  }

  async getActiveGoals(userId: string): Promise<Goal[]> {
    return await this.goalRepository.find({
      where: { userId, status: GoalStatus.IN_PROGRESS },
      relations: ['account'],
      order: { targetDate: 'ASC' }
    });
  }
}

