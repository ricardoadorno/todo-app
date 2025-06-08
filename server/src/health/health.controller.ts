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
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { HealthService } from './health.service';
import {
  CreateHealthMeasurementDto,
  UpdateHealthMeasurementDto,
  CreateExerciseDto,
  UpdateExerciseDto,
  CreateDietPlanDto,
  UpdateDietPlanDto,
  CreateWorkoutPlanDto,
  UpdateWorkoutPlanDto,
} from './dto/health.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserId } from '../auth/decorators/user.decorator';

@Controller('health')
@ApiTags('Health')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  // Health Dashboard endpoint
  @Get()
  @ApiOperation({ summary: 'Get health dashboard data' })
  async getHealthData(@UserId() userId: string) {
    return this.healthService.getHealthData(userId);
  }

  // Health Measurements endpoints
  @Post('measurements')
  @ApiOperation({ summary: 'Create health measurement' })
  async createHealthMeasurement(
    @Body(ValidationPipe)
    createHealthMeasurementDto: CreateHealthMeasurementDto,
  ) {
    return this.healthService.createHealthMeasurement(
      createHealthMeasurementDto,
    );
  }

  @Get('measurements')
  @ApiOperation({ summary: 'Get all health measurements' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async findAllHealthMeasurements(
    @Query('userId') userId: string,
    @Query('type') type?: string,
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
  ) {
    if (type) {
      // Type validation is now handled in the service
      return this.healthService.findHealthMeasurementsByType(userId, type);
    }

    if (startDateStr && endDateStr) {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      return this.healthService.findHealthMeasurementsByDateRange(
        userId,
        startDate,
        endDate,
      );
    }

    return this.healthService.findAllHealthMeasurements(userId);
  }

  @Get('measurements/:id')
  @ApiOperation({ summary: 'Get health measurement by id' })
  @ApiParam({ name: 'id', description: 'Health measurement ID' })
  async findHealthMeasurementById(@Param('id') id: string) {
    return this.healthService.findHealthMeasurementById(id);
  }

  @Patch('measurements/:id')
  @ApiOperation({ summary: 'Update health measurement' })
  @ApiParam({ name: 'id', description: 'Health measurement ID' })
  async updateHealthMeasurement(
    @Param('id') id: string,
    @Body(ValidationPipe)
    updateHealthMeasurementDto: UpdateHealthMeasurementDto,
  ) {
    return this.healthService.updateHealthMeasurement(
      id,
      updateHealthMeasurementDto,
    );
  }

  @Delete('measurements/:id')
  @ApiOperation({ summary: 'Delete health measurement' })
  @ApiParam({ name: 'id', description: 'Health measurement ID' })
  async deleteHealthMeasurement(@Param('id') id: string) {
    return this.healthService.deleteHealthMeasurement(id);
  }

  // Exercise endpoints
  @Post('exercises')
  @ApiOperation({ summary: 'Create exercise' })
  async createExercise(
    @Body(ValidationPipe) createExerciseDto: CreateExerciseDto,
  ) {
    return this.healthService.createExercise(createExerciseDto);
  }

  @Get('exercises')
  @ApiOperation({ summary: 'Get all exercises' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async findAllExercises(
    @Query('userId') userId: string,
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
  ) {
    if (startDateStr && endDateStr) {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      return this.healthService.findExercisesByDateRange(
        userId,
        startDate,
        endDate,
      );
    }

    return this.healthService.findAllExercises(userId);
  }

  @Get('exercises/:id')
  @ApiOperation({ summary: 'Get exercise by id' })
  @ApiParam({ name: 'id', description: 'Exercise ID' })
  async findExerciseById(@Param('id') id: string) {
    return this.healthService.findExerciseById(id);
  }

  @Patch('exercises/:id')
  @ApiOperation({ summary: 'Update exercise' })
  @ApiParam({ name: 'id', description: 'Exercise ID' })
  async updateExercise(
    @Param('id') id: string,
    @Body(ValidationPipe) updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.healthService.updateExercise(id, updateExerciseDto);
  }

  @Delete('exercises/:id')
  @ApiOperation({ summary: 'Delete exercise' })
  @ApiParam({ name: 'id', description: 'Exercise ID' })
  async deleteExercise(@Param('id') id: string) {
    return this.healthService.deleteExercise(id);
  }

  // Diet Plan endpoints
  @Post('diet-plan')
  @ApiOperation({ summary: 'Create diet plan' })
  async createDietPlan(
    @Body(ValidationPipe) createDietPlanDto: CreateDietPlanDto,
  ) {
    return this.healthService.createDietPlan(createDietPlanDto);
  }

  @Get('diet-plan')
  @ApiOperation({ summary: 'Get all diet plans' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'current', required: false, type: Boolean })
  async findAllDietPlans(
    @Query('userId') userId: string,
    @Query('current') current?: boolean,
  ) {
    if (current) {
      return this.healthService.findCurrentDietPlan(userId);
    }
    return this.healthService.findAllDietPlans(userId);
  }

  @Get('diet-plan/:id')
  @ApiOperation({ summary: 'Get diet plan by id' })
  @ApiParam({ name: 'id', description: 'Diet Plan ID' })
  async findDietPlanById(@Param('id') id: string) {
    return this.healthService.findDietPlanById(id);
  }

  @Patch('diet-plan/:id')
  @ApiOperation({ summary: 'Update diet plan' })
  @ApiParam({ name: 'id', description: 'Diet Plan ID' })
  async updateDietPlan(
    @Param('id') id: string,
    @Body(ValidationPipe) updateDietPlanDto: UpdateDietPlanDto,
  ) {
    return this.healthService.updateDietPlan(id, updateDietPlanDto);
  }

  @Delete('diet-plan/:id')
  @ApiOperation({ summary: 'Delete diet plan' })
  @ApiParam({ name: 'id', description: 'Diet Plan ID' })
  async deleteDietPlan(@Param('id') id: string) {
    return this.healthService.deleteDietPlan(id);
  }

  // Workout Plan endpoints
  @Post('workout-plan')
  @ApiOperation({ summary: 'Create workout plan' })
  async createWorkoutPlan(
    @Body(ValidationPipe) createWorkoutPlanDto: CreateWorkoutPlanDto,
  ) {
    return this.healthService.createWorkoutPlan(createWorkoutPlanDto);
  }

  @Get('workout-plan')
  @ApiOperation({ summary: 'Get all workout plans' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'current', required: false, type: Boolean })
  async findAllWorkoutPlans(
    @Query('userId') userId: string,
    @Query('current') current?: boolean,
  ) {
    if (current) {
      return this.healthService.findCurrentWorkoutPlan(userId);
    }
    return this.healthService.findAllWorkoutPlans(userId);
  }

  @Get('workout-plan/:id')
  @ApiOperation({ summary: 'Get workout plan by id' })
  @ApiParam({ name: 'id', description: 'Workout Plan ID' })
  async findWorkoutPlanById(@Param('id') id: string) {
    return this.healthService.findWorkoutPlanById(id);
  }

  @Patch('workout-plan/:id')
  @ApiOperation({ summary: 'Update workout plan' })
  @ApiParam({ name: 'id', description: 'Workout Plan ID' })
  async updateWorkoutPlan(
    @Param('id') id: string,
    @Body(ValidationPipe) updateWorkoutPlanDto: UpdateWorkoutPlanDto,
  ) {
    return this.healthService.updateWorkoutPlan(id, updateWorkoutPlanDto);
  }

  @Delete('workout-plan/:id')
  @ApiOperation({ summary: 'Delete workout plan' })
  @ApiParam({ name: 'id', description: 'Workout Plan ID' })
  async deleteWorkoutPlan(@Param('id') id: string) {
    return this.healthService.deleteWorkoutPlan(id);
  }
}
