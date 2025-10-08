import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import { ReportsService } from './reports.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('income-statement')
  getIncomeStatement(
    @Request() req: any,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date();
    return this.reportsService.getIncomeStatement(req.user.userId, start, end);
  }

  @Get('balance-sheet')
  getBalanceSheet(@Request() req: any) {
    return this.reportsService.getBalanceSheet(req.user.userId);
  }

  @Get('cash-flow')
  getCashFlowReport(
    @Request() req: any,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date();
    return this.reportsService.getCashFlowReport(req.user.userId, start, end);
  }

  @Get('budget')
  getBudgetReport(@Request() req: any) {
    return this.reportsService.getBudgetReport(req.user.userId);
  }

  @Get('monthly-comparison')
  getMonthlyComparison(@Request() req: any, @Query('months') months?: string) {
    const monthsNum = months ? parseInt(months, 10) : 6;
    return this.reportsService.getMonthlyComparison(req.user.userId, monthsNum);
  }

  @Get('export')
  getTransactionExport(
    @Request() req: any,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();
    return this.reportsService.getTransactionExport(req.user.userId, start, end);
  }
}

