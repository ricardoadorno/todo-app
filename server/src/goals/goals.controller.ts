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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GoalsService } from './goals.service';
import { CreateGoalDto, UpdateGoalDto } from './dto/goal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserId } from '../auth/decorators/user.decorator';

@ApiTags('goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new goal' })
  @ApiResponse({
    status: 201,
    description: 'The goal has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(
    @Body(ValidationPipe) createGoalDto: CreateGoalDto,
    @UserId() userId: string,
  ) {
    return this.goalsService.create({ ...createGoalDto, userId });
  }

  @Get()
  @ApiOperation({ summary: 'Get all goals for a user' })
  @ApiResponse({ status: 200, description: 'Returns all goals for the user' })
  findAll(@UserId() userId: string) {
    return this.goalsService.findAll(userId);
  }

  @Get('in-progress')
  @ApiOperation({ summary: 'Get goals in progress for a user' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of goals to return',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns goals in progress for the user',
  })
  getInProgress(@UserId() userId: string, @Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.goalsService.getInProgress(userId, limitNumber);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get goals by category' })
  @ApiParam({ name: 'category', description: 'Goal category' })
  @ApiResponse({
    status: 200,
    description: 'Returns goals matching the category',
  })
  findByCategory(
    @Param('category') category: string,
    @UserId() userId: string,
  ) {
    return this.goalsService.findByCategory(userId, category);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get goals by status' })
  @ApiParam({ name: 'status', description: 'Goal status' })
  @ApiResponse({
    status: 200,
    description: 'Returns goals matching the status',
  })
  findByStatus(@Param('status') status: string, @UserId() userId: string) {
    return this.goalsService.findByStatus(userId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a goal by ID' })
  @ApiParam({ name: 'id', description: 'Goal ID' })
  @ApiResponse({ status: 200, description: 'Returns the goal' })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  findOne(@Param('id') id: string, @UserId() userId: string) {
    return this.goalsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a goal' })
  @ApiParam({ name: 'id', description: 'Goal ID' })
  @ApiResponse({
    status: 200,
    description: 'The goal has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  update(
    @Param('id') id: string,
    @UserId() userId: string,
    @Body(ValidationPipe) updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalsService.update(id, userId, updateGoalDto);
  }

  @Patch(':id/progress')
  @ApiOperation({ summary: 'Update goal progress' })
  @ApiParam({ name: 'id', description: 'Goal ID' })
  @ApiResponse({
    status: 200,
    description: 'The goal progress has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  updateProgress(
    @Param('id') id: string,
    @UserId() userId: string,
    @Body('currentValue') currentValue: number,
  ) {
    return this.goalsService.updateProgress(id, userId, currentValue);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a goal' })
  @ApiParam({ name: 'id', description: 'Goal ID' })
  @ApiResponse({
    status: 200,
    description: 'The goal has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  remove(@Param('id') id: string, @UserId() userId: string) {
    return this.goalsService.remove(id, userId);
  }

  // SubTask endpoints
  @Post(':goalId/subtasks')
  @ApiOperation({ summary: 'Add a subtask to a goal' })
  @ApiParam({ name: 'goalId', description: 'Goal ID' })
  @ApiResponse({
    status: 201,
    description: 'The subtask has been successfully added.',
  })
  @ApiResponse({ status: 404, description: 'Goal not found' })
  addSubTask(
    @Param('goalId') goalId: string,
    @UserId() userId: string,
    @Body('name') name: string,
  ) {
    return this.goalsService.addSubTask(goalId, userId, name);
  }

  @Patch('subtasks/:subTaskId/toggle')
  @ApiOperation({ summary: 'Toggle a subtask completion status' })
  @ApiParam({ name: 'subTaskId', description: 'SubTask ID' })
  @ApiResponse({
    status: 200,
    description: 'The subtask status has been successfully toggled.',
  })
  @ApiResponse({ status: 404, description: 'SubTask not found' })
  toggleSubTask(
    @Param('subTaskId') subTaskId: string,
    @UserId() userId: string,
  ) {
    return this.goalsService.toggleSubTask(subTaskId, userId);
  }

  @Delete('subtasks/:subTaskId')
  @ApiOperation({ summary: 'Remove a subtask' })
  @ApiParam({ name: 'subTaskId', description: 'SubTask ID' })
  @ApiResponse({
    status: 200,
    description: 'The subtask has been successfully removed.',
  })
  @ApiResponse({ status: 404, description: 'SubTask not found' })
  removeSubTask(
    @Param('subTaskId') subTaskId: string,
    @UserId() userId: string,
  ) {
    return this.goalsService.removeSubTask(subTaskId, userId);
  }
}
