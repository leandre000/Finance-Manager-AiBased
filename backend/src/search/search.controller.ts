import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import { SearchService, SearchFilters } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransactionType } from '../transactions/entities/transaction.entity';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('transactions')
  searchTransactions(
    @Request() req: any,
    @Query('query') query?: string,
    @Query('type') type?: TransactionType,
    @Query('accountIds') accountIds?: string,
    @Query('categoryIds') categoryIds?: string,
    @Query('minAmount') minAmount?: string,
    @Query('maxAmount') maxAmount?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('tags') tags?: string,
    @Query('payee') payee?: string
  ) {
    const filters: SearchFilters = {
      query,
      type,
      accountIds: accountIds ? accountIds.split(',') : undefined,
      categoryIds: categoryIds ? categoryIds.split(',') : undefined,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
      startDate,
      endDate,
      tags: tags ? tags.split(',') : undefined,
      payee
    };

    return this.searchService.searchTransactions(req.user.userId, filters);
  }

  @Get('accounts')
  searchAccounts(@Request() req: any, @Query('query') query: string) {
    return this.searchService.searchAccounts(req.user.userId, query);
  }

  @Get('categories')
  searchCategories(@Request() req: any, @Query('query') query: string) {
    return this.searchService.searchCategories(req.user.userId, query);
  }

  @Get('budgets')
  searchBudgets(@Request() req: any, @Query('query') query: string) {
    return this.searchService.searchBudgets(req.user.userId, query);
  }

  @Get('goals')
  searchGoals(@Request() req: any, @Query('query') query: string) {
    return this.searchService.searchGoals(req.user.userId, query);
  }

  @Get('global')
  globalSearch(@Request() req: any, @Query('query') query: string) {
    return this.searchService.globalSearch(req.user.userId, query);
  }

  @Get('stats')
  getQuickStats(
    @Request() req: any,
    @Query('query') query?: string,
    @Query('type') type?: TransactionType,
    @Query('accountIds') accountIds?: string,
    @Query('categoryIds') categoryIds?: string,
    @Query('minAmount') minAmount?: string,
    @Query('maxAmount') maxAmount?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('tags') tags?: string,
    @Query('payee') payee?: string
  ) {
    const filters: SearchFilters = {
      query,
      type,
      accountIds: accountIds ? accountIds.split(',') : undefined,
      categoryIds: categoryIds ? categoryIds.split(',') : undefined,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
      startDate,
      endDate,
      tags: tags ? tags.split(',') : undefined,
      payee
    };

    return this.searchService.getQuickStats(req.user.userId, filters);
  }
}

