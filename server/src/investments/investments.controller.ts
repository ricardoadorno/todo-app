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
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto, UpdateInvestmentDto } from './dto/investment.dto';

@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  create(@Body(ValidationPipe) createInvestmentDto: CreateInvestmentDto) {
    return this.investmentsService.create(createInvestmentDto);
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.investmentsService.findAll(userId);
  }

  @Get('portfolio-summary')
  getPortfolioSummary(@Query('userId') userId: string) {
    return this.investmentsService.getPortfolioSummary(userId);
  }

  @Get('type/:type')
  findByType(@Param('type') type: string, @Query('userId') userId: string) {
    return this.investmentsService.findByType(userId, type);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('userId') userId: string) {
    return this.investmentsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body(ValidationPipe) updateInvestmentDto: UpdateInvestmentDto,
  ) {
    return this.investmentsService.update(id, userId, updateInvestmentDto);
  }

  @Patch(':id/current-value')
  updateCurrentValue(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body('currentValue') currentValue: number,
  ) {
    return this.investmentsService.updateCurrentValue(id, userId, currentValue);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('userId') userId: string) {
    return this.investmentsService.remove(id, userId);
  }
}
