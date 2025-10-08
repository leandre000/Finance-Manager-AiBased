import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query
} from '@nestjs/common';
import { GoalsService } from './goals.service.js';
import { CreateGoalDto } from './dto/create-goal.dto.js';
import { UpdateGoalDto } from './dto/update-goal.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { GoalStatus } from './entities/goal.entity.js';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(@Request() req: any, @Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.create(req.user.userId, createGoalDto);
  }

  @Get()
  findAll(@Request() req: any, @Query('status') status?: GoalStatus) {
    return this.goalsService.findAll(req.user.userId, status);
  }

  @Get('active')
  getActiveGoals(@Request() req: any) {
    return this.goalsService.getActiveGoals(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.goalsService.findOne(id, req.user.userId);
  }

  @Get(':id/progress')
  getGoalProgress(@Request() req: any, @Param('id') id: string) {
    return this.goalsService.getGoalProgress(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto
  ) {
    return this.goalsService.update(id, req.user.userId, updateGoalDto);
  }

  @Patch(':id/add')
  addToGoal(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { amount: number }
  ) {
    return this.goalsService.addToGoal(id, req.user.userId, body.amount);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.goalsService.remove(id, req.user.userId);
  }
}

