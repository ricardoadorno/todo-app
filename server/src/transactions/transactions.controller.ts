import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body(ValidationPipe) createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.transactionsService.findAll(userId);
  }

  @Get('overview')
  getFinancialOverview(
    @Query('userId') userId: string,
    @Query('monthsBack') monthsBack?: string,
  ) {
    const months = monthsBack ? parseInt(monthsBack, 10) : 6;
    return this.transactionsService.getFinancialOverview(userId, months);
  }

  @Get('recurring')
  getRecurringTransactions(@Query('userId') userId: string) {
    return this.transactionsService.getRecurringTransactions(userId);
  }

  @Get('type/:type')
  findByType(
    @Param('type') type: 'INCOME' | 'EXPENSE',
    @Query('userId') userId: string,
  ) {
    return this.transactionsService.findByType(userId, type);
  }

  @Get('category/:category')
  findByCategory(
    @Param('category') category: string,
    @Query('userId') userId: string,
  ) {
    return this.transactionsService.findByCategory(userId, category);
  }

  @Get('date-range')
  findByDateRange(
    @Query('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.transactionsService.findByDateRange(
      userId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('userId') userId: string) {
    return this.transactionsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body(ValidationPipe) updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, userId, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('userId') userId: string) {
    return this.transactionsService.remove(id, userId);
  }
}
