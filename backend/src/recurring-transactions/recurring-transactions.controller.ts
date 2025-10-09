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
import { RecurringTransactionsService } from './recurring-transactions.service';
import { CreateRecurringTransactionDto } from './dto/create-recurring-transaction.dto';
import { UpdateRecurringTransactionDto } from './dto/update-recurring-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RecurringStatus } from './entities/recurring-transaction.entity';

@Controller('recurring-transactions')
@UseGuards(JwtAuthGuard)
export class RecurringTransactionsController {
  constructor(private readonly recurringTransactionsService: RecurringTransactionsService) {}

  @Post()
  create(@Request() req: any, @Body() createDto: CreateRecurringTransactionDto) {
    return this.recurringTransactionsService.create(req.user.userId, createDto);
  }

  @Get()
  findAll(@Request() req: any, @Query('status') status?: RecurringStatus) {
    return this.recurringTransactionsService.findAll(req.user.userId, status);
  }

  @Get('upcoming')
  getUpcoming(@Request() req: any, @Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 30;
    return this.recurringTransactionsService.getUpcoming(req.user.userId, daysNum);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.recurringTransactionsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateDto: UpdateRecurringTransactionDto
  ) {
    return this.recurringTransactionsService.update(id, req.user.userId, updateDto);
  }

  @Patch(':id/pause')
  pause(@Request() req: any, @Param('id') id: string) {
    return this.recurringTransactionsService.pause(id, req.user.userId);
  }

  @Patch(':id/resume')
  resume(@Request() req: any, @Param('id') id: string) {
    return this.recurringTransactionsService.resume(id, req.user.userId);
  }

  @Patch(':id/cancel')
  cancel(@Request() req: any, @Param('id') id: string) {
    return this.recurringTransactionsService.cancel(id, req.user.userId);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.recurringTransactionsService.remove(id, req.user.userId);
  }
}

