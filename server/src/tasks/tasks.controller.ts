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
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body(ValidationPipe) createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.tasksService.findAll(userId);
  }

  @Get('upcoming')
  findUpcoming(
    @Query('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.tasksService.findUpcoming(userId, limitNumber);
  }

  @Get('category/:category')
  findByCategory(
    @Param('category') category: string,
    @Query('userId') userId: string,
  ) {
    return this.tasksService.findByCategory(userId, category);
  }

  @Get('priority/:priority')
  findByPriority(
    @Param('priority') priority: string,
    @Query('userId') userId: string,
  ) {
    return this.tasksService.findByPriority(userId, priority);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('userId') userId: string) {
    return this.tasksService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, userId, updateTaskDto);
  }

  @Patch(':id/complete')
  markCompleted(@Param('id') id: string, @Query('userId') userId: string) {
    return this.tasksService.markCompleted(id, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('userId') userId: string) {
    return this.tasksService.remove(id, userId);
  }
}
