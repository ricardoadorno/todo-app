import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateHealthMeasurementDto,
  UpdateHealthMeasurementDto,
  CreateExerciseDto,
  UpdateExerciseDto,
  CreateDietPlanDto,
  UpdateDietPlanDto,
  CreateWorkoutPlanDto,
  UpdateWorkoutPlanDto,
  MeasurementType,
} from './dto/health.dto';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  // Health Measurements
  async createHealthMeasurement(
    createHealthMeasurementDto: CreateHealthMeasurementDto,
  ) {
    return this.prisma.healthMeasurement.create({
      data: createHealthMeasurementDto,
    });
  }

  async findAllHealthMeasurements(userId: string) {
    return this.prisma.healthMeasurement.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async findHealthMeasurementsByType(userId: string, type: string) {
    // Validar se o tipo existe no enum MeasurementType
    if (!Object.values(MeasurementType).includes(type as MeasurementType)) {
      throw new Error(`Invalid measurement type: ${type}`);
    }

    return this.prisma.healthMeasurement.findMany({
      where: {
        userId,
        type: type as MeasurementType,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findHealthMeasurementsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    return this.prisma.healthMeasurement.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findHealthMeasurementById(id: string) {
    const measurement = await this.prisma.healthMeasurement.findUnique({
      where: { id },
    });

    if (!measurement) {
      throw new NotFoundException(`Health measurement with ID ${id} not found`);
    }

    return measurement;
  }

  async updateHealthMeasurement(
    id: string,
    updateHealthMeasurementDto: UpdateHealthMeasurementDto,
  ) {
    try {
      return await this.prisma.healthMeasurement.update({
        where: { id },
        data: updateHealthMeasurementDto,
      });
    } catch (error) {
      throw new NotFoundException(`Health measurement with ID ${id} not found`);
    }
  }

  async deleteHealthMeasurement(id: string) {
    try {
      return await this.prisma.healthMeasurement.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Health measurement with ID ${id} not found`);
    }
  }

  // Exercises
  async createExercise(createExerciseDto: CreateExerciseDto) {
    return this.prisma.exercise.create({
      data: createExerciseDto,
    });
  }

  async findAllExercises(userId: string) {
    return this.prisma.exercise.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async findExercisesByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    return this.prisma.exercise.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findExerciseById(id: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }

    return exercise;
  }

  async updateExercise(id: string, updateExerciseDto: UpdateExerciseDto) {
    try {
      return await this.prisma.exercise.update({
        where: { id },
        data: updateExerciseDto,
      });
    } catch (error) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
  }

  async deleteExercise(id: string) {
    try {
      return await this.prisma.exercise.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
  }

  // Diet Plans
  async createDietPlan(createDietPlanDto: CreateDietPlanDto) {
    return this.prisma.dietPlan.create({
      data: createDietPlanDto,
    });
  }

  async findAllDietPlans(userId: string) {
    return this.prisma.dietPlan.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
  }

  async findCurrentDietPlan(userId: string) {
    const now = new Date();

    // Primeiro tenta encontrar um plano onde a data atual está entre startDate e endDate
    const activePlan = await this.prisma.dietPlan.findFirst({
      where: {
        userId,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    if (activePlan) {
      return activePlan;
    }

    // Se não encontrar um plano ativo, retorna o plano mais recente
    return this.prisma.dietPlan.findFirst({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
  }

  async findDietPlanById(id: string) {
    const dietPlan = await this.prisma.dietPlan.findUnique({
      where: { id },
    });

    if (!dietPlan) {
      throw new NotFoundException(`Diet plan with ID ${id} not found`);
    }

    return dietPlan;
  }

  async updateDietPlan(id: string, updateDietPlanDto: UpdateDietPlanDto) {
    try {
      return await this.prisma.dietPlan.update({
        where: { id },
        data: updateDietPlanDto,
      });
    } catch (error) {
      throw new NotFoundException(`Diet plan with ID ${id} not found`);
    }
  }

  async deleteDietPlan(id: string) {
    try {
      return await this.prisma.dietPlan.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Diet plan with ID ${id} not found`);
    }
  }

  // Workout Plans
  async createWorkoutPlan(createWorkoutPlanDto: CreateWorkoutPlanDto) {
    return this.prisma.workoutPlan.create({
      data: createWorkoutPlanDto,
    });
  }

  async findAllWorkoutPlans(userId: string) {
    return this.prisma.workoutPlan.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
  }

  async findCurrentWorkoutPlan(userId: string) {
    const now = new Date();

    // Primeiro tenta encontrar um plano onde a data atual está entre startDate e endDate
    const activePlan = await this.prisma.workoutPlan.findFirst({
      where: {
        userId,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    if (activePlan) {
      return activePlan;
    }

    // Se não encontrar um plano ativo, retorna o plano mais recente
    return this.prisma.workoutPlan.findFirst({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
  }

  async findWorkoutPlanById(id: string) {
    const workoutPlan = await this.prisma.workoutPlan.findUnique({
      where: { id },
    });

    if (!workoutPlan) {
      throw new NotFoundException(`Workout plan with ID ${id} not found`);
    }

    return workoutPlan;
  }

  async updateWorkoutPlan(
    id: string,
    updateWorkoutPlanDto: UpdateWorkoutPlanDto,
  ) {
    try {
      return await this.prisma.workoutPlan.update({
        where: { id },
        data: updateWorkoutPlanDto,
      });
    } catch (error) {
      throw new NotFoundException(`Workout plan with ID ${id} not found`);
    }
  }

  async deleteWorkoutPlan(id: string) {
    try {
      return await this.prisma.workoutPlan.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Workout plan with ID ${id} not found`);
    }
  }

  // Health Dashboard Data
  async getHealthData(userId: string) {
    const [measurements, exercises, currentDietPlan, currentWorkoutPlan] =
      await Promise.all([
        this.findAllHealthMeasurements(userId),
        this.findAllExercises(userId),
        this.findCurrentDietPlan(userId),
        this.findCurrentWorkoutPlan(userId),
      ]);

    return {
      measurements,
      exercises,
      currentDietPlan,
      currentWorkoutPlan,
    };
  }
}
