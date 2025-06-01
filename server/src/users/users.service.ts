import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with this email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id); // Check if user exists

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string): Promise<User> {
    await this.findOne(id); // Check if user exists

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getUserProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        tasks: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        habits: {
          take: 5,
          orderBy: { streak: 'desc' },
        },
        goals: {
          where: { status: 'IN_PROGRESS' },
          take: 5,
          orderBy: { updatedAt: 'desc' },
        },
        transactions: {
          take: 5,
          orderBy: { date: 'desc' },
        },
        investments: {
          take: 5,
          orderBy: { currentValue: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async getDashboardData(userId: string) {
    const user = await this.findOne(userId);

    // Get upcoming tasks
    const upcomingTasks = await this.prisma.task.findMany({
      where: {
        userId,
        dueDate: {
          gte: new Date(),
        },
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
    });

    // Get active habits with recent progress
    const activeHabits = await this.prisma.habit.findMany({
      where: { userId },
      orderBy: { streak: 'desc' },
      take: 5,
      include: {
        progress: {
          where: {
            date: {
              gte: new Date(new Date().setDate(new Date().getDate() - 7)),
            },
          },
          orderBy: { date: 'desc' },
        },
      },
    });

    // Get goals in progress
    const goalsInProgress = await this.prisma.goal.findMany({
      where: {
        userId,
        status: 'IN_PROGRESS',
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        subTasks: true,
      },
    });

    // Get recent financial data
    const recentTransactions = await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 10,
    });

    // Calculate financial overview
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthlyTransactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: thisMonth,
        },
      },
    });

    const monthlyIncome = monthlyTransactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const monthlyExpenses = monthlyTransactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      user,
      upcomingTasks,
      activeHabits,
      goalsInProgress,
      financialOverview: {
        monthlyIncome,
        monthlyExpenses,
        monthlyBalance: monthlyIncome - monthlyExpenses,
        recentTransactions: recentTransactions.slice(0, 5),
      },
    };
  }
}
