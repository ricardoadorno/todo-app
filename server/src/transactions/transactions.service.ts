import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: createTransactionDto,
    });
  }

  async findAll(userId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async update(
    id: string,
    userId: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    await this.findOne(id, userId); // Check if transaction exists and belongs to user

    return this.prisma.transaction.update({
      where: { id },
      data: updateTransactionDto,
    });
  }

  async remove(id: string, userId: string): Promise<Transaction> {
    await this.findOne(id, userId); // Check if transaction exists and belongs to user

    return this.prisma.transaction.delete({
      where: { id },
    });
  }

  async findByType(
    userId: string,
    type: 'INCOME' | 'EXPENSE',
  ): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { userId, type },
      orderBy: { date: 'desc' },
    });
  }

  async findByCategory(
    userId: string,
    category: string,
  ): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { userId, category },
      orderBy: { date: 'desc' },
    });
  }

  async findByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
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

  async getFinancialOverview(userId: string, monthsBack: number = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'desc' },
    });

    // Calculate totals
    const income = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = income - expenses;

    // Group by month for trend analysis
    const monthlyData = transactions.reduce(
      (acc, transaction) => {
        const month = transaction.date.toISOString().substring(0, 7); // YYYY-MM
        if (!acc[month]) {
          acc[month] = { income: 0, expenses: 0 };
        }
        if (transaction.type === 'INCOME') {
          acc[month].income += Number(transaction.amount);
        } else {
          acc[month].expenses += Number(transaction.amount);
        }
        return acc;
      },
      {} as Record<string, { income: number; expenses: number }>,
    );

    // Group by category for expenses
    const expensesByCategory = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce(
        (acc, transaction) => {
          const category = transaction.category || 'Other';
          acc[category] = (acc[category] || 0) + Number(transaction.amount);
          return acc;
        },
        {} as Record<string, number>,
      );

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance,
      monthlyData,
      expensesByCategory,
      recentTransactions: transactions.slice(0, 10),
    };
  }

  async getRecurringTransactions(userId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        isRecurring: true,
      },
      orderBy: { date: 'desc' },
    });
  }
}
