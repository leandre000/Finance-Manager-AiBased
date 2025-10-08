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
import { BudgetsService } from './budgets.service.js';
import { CreateBudgetDto } from './dto/create-budget.dto.js';
import { UpdateBudgetDto } from './dto/update-budget.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(@Request() req: any, @Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.create(req.user.userId, createBudgetDto);
  }

  @Get()
  findAll(@Request() req: any, @Query('isActive') isActive?: string) {
    const isActiveBool = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.budgetsService.findAll(req.user.userId, isActiveBool);
  }

  @Get('current')
  getCurrentBudgets(@Request() req: any) {
    return this.budgetsService.getCurrentBudgets(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.budgetsService.findOne(id, req.user.userId);
  }

  @Get(':id/progress')
  getBudgetProgress(@Request() req: any, @Param('id') id: string) {
    return this.budgetsService.getBudgetProgress(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto
  ) {
    return this.budgetsService.update(id, req.user.userId, updateBudgetDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.budgetsService.remove(id, req.user.userId);
  }
}

