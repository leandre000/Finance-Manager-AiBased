import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  getOverview(@Request() req: any) {
    return this.dashboardService.getOverview(req.user.userId);
  }

  @Get('cash-flow')
  getCashFlow(@Request() req: any, @Query('months') months?: string) {
    const monthsNum = months ? parseInt(months, 10) : 6;
    return this.dashboardService.getCashFlow(req.user.userId, monthsNum);
  }

  @Get('spending-by-category')
  getSpendingByCategory(
    @Request() req: any,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date();
    return this.dashboardService.getSpendingByCategory(req.user.userId, start, end);
  }

  @Get('income-by-category')
  getIncomeByCategory(
    @Request() req: any,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date();
    return this.dashboardService.getIncomeByCategory(req.user.userId, start, end);
  }

  @Get('recent-transactions')
  getRecentTransactions(@Request() req: any, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.dashboardService.getRecentTransactions(req.user.userId, limitNum);
  }

  @Get('accounts-overview')
  getAccountsOverview(@Request() req: any) {
    return this.dashboardService.getAccountsOverview(req.user.userId);
  }

  @Get('budget-status')
  getBudgetStatus(@Request() req: any) {
    return this.dashboardService.getBudgetStatus(req.user.userId);
  }

  @Get('financial-health')
  getFinancialHealth(@Request() req: any) {
    return this.dashboardService.getFinancialHealth(req.user.userId);
  }
}

