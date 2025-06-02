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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body(ValidationPipe) createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for a user' })
  @ApiQuery({ name: 'userId', required: true, description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'Returns all tasks for the user' })
  findAll(@Query('userId') userId: string) {
    return this.tasksService.findAll(userId);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming tasks for a user' })
  @ApiQuery({ name: 'userId', required: true, description: 'ID of the user' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of tasks to return',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns upcoming tasks for the user',
  })
  findUpcoming(
    @Query('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.tasksService.findUpcoming(userId, limitNumber);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get tasks by category' })
  @ApiParam({ name: 'category', description: 'Task category' })
  @ApiQuery({ name: 'userId', required: true, description: 'ID of the user' })
  @ApiResponse({
    status: 200,
    description: 'Returns tasks matching the category',
  })
  findByCategory(
    @Param('category') category: string,
    @Query('userId') userId: string,
  ) {
    return this.tasksService.findByCategory(userId, category);
  }

  @Get('priority/:priority')
  @ApiOperation({ summary: 'Get tasks by priority' })
  @ApiParam({ name: 'priority', description: 'Task priority' })
  @ApiQuery({ name: 'userId', required: true, description: 'ID of the user' })
  @ApiResponse({
    status: 200,
    description: 'Returns tasks matching the priority',
  })
  findByPriority(
    @Param('priority') priority: string,
    @Query('userId') userId: string,
  ) {
    return this.tasksService.findByPriority(userId, priority);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiQuery({ name: 'userId', required: true, description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'Returns the task' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id') id: string, @Query('userId') userId: string) {
    return this.tasksService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiQuery({ name: 'userId', required: true, description: 'ID of the user' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, userId, updateTaskDto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark a task as completed' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiQuery({ name: 'userId', required: true, description: 'ID of the user' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully marked as completed.',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  markCompleted(@Param('id') id: string, @Query('userId') userId: string) {
    return this.tasksService.markCompleted(id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiQuery({ name: 'userId', required: true, description: 'ID of the user' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id') id: string, @Query('userId') userId: string) {
    return this.tasksService.remove(id, userId);
  }
}
