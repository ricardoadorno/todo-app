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
import { GoalsService } from './goals.service';
import { CreateGoalDto, UpdateGoalDto } from './dto/goal.dto';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(@Body(ValidationPipe) createGoalDto: CreateGoalDto) {
    return this.goalsService.create(createGoalDto);
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.goalsService.findAll(userId);
  }

  @Get('in-progress')
  getInProgress(
    @Query('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.goalsService.getInProgress(userId, limitNumber);
  }

  @Get('category/:category')
  findByCategory(
    @Param('category') category: string,
    @Query('userId') userId: string,
  ) {
    return this.goalsService.findByCategory(userId, category);
  }

  @Get('status/:status')
  findByStatus(
    @Param('status') status: string,
    @Query('userId') userId: string,
  ) {
    return this.goalsService.findByStatus(userId, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('userId') userId: string) {
    return this.goalsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body(ValidationPipe) updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalsService.update(id, userId, updateGoalDto);
  }

  @Patch(':id/progress')
  updateProgress(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body('currentValue') currentValue: number,
  ) {
    return this.goalsService.updateProgress(id, userId, currentValue);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('userId') userId: string) {
    return this.goalsService.remove(id, userId);
  }

  // SubTask endpoints
  @Post(':goalId/subtasks')
  addSubTask(
    @Param('goalId') goalId: string,
    @Query('userId') userId: string,
    @Body('name') name: string,
  ) {
    return this.goalsService.addSubTask(goalId, userId, name);
  }

  @Patch('subtasks/:subTaskId/toggle')
  toggleSubTask(
    @Param('subTaskId') subTaskId: string,
    @Query('userId') userId: string,
  ) {
    return this.goalsService.toggleSubTask(subTaskId, userId);
  }

  @Delete('subtasks/:subTaskId')
  removeSubTask(
    @Param('subTaskId') subTaskId: string,
    @Query('userId') userId: string,
  ) {
    return this.goalsService.removeSubTask(subTaskId, userId);
  }
}
