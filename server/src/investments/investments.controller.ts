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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto, UpdateInvestmentDto } from './dto/investment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserId } from '../auth/decorators/user.decorator';

@Controller('investments')
@ApiTags('investments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  create(
    @Body(ValidationPipe) createInvestmentDto: CreateInvestmentDto,
    @UserId() userId: string,
  ) {
    return this.investmentsService.create({ ...createInvestmentDto, userId });
  }

  @Get()
  findAll(@UserId() userId: string) {
    return this.investmentsService.findAll(userId);
  }

  @Get('portfolio-summary')
  getPortfolioSummary(@UserId() userId: string) {
    return this.investmentsService.getPortfolioSummary(userId);
  }

  @Get('type/:type')
  findByType(@Param('type') type: string, @UserId() userId: string) {
    return this.investmentsService.findByType(userId, type);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @UserId() userId: string) {
    return this.investmentsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @UserId() userId: string,
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
