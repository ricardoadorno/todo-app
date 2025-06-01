import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvestmentDto, UpdateInvestmentDto } from './dto/investment.dto';
import { Investment } from '@prisma/client';

@Injectable()
export class InvestmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createInvestmentDto: CreateInvestmentDto): Promise<Investment> {
    return this.prisma.investment.create({
      data: createInvestmentDto,
    });
  }

  async findAll(userId: string): Promise<Investment[]> {
    return this.prisma.investment.findMany({
      where: { userId },
      orderBy: { purchaseDate: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Investment> {
    const investment = await this.prisma.investment.findFirst({
      where: { id, userId },
    });

    if (!investment) {
      throw new NotFoundException(`Investment with ID ${id} not found`);
    }

    return investment;
  }

  async update(
    id: string,
    userId: string,
    updateInvestmentDto: UpdateInvestmentDto,
  ): Promise<Investment> {
    await this.findOne(id, userId); // Check if investment exists and belongs to user

    return this.prisma.investment.update({
      where: { id },
      data: updateInvestmentDto,
    });
  }

  async remove(id: string, userId: string): Promise<Investment> {
    await this.findOne(id, userId); // Check if investment exists and belongs to user

    return this.prisma.investment.delete({
      where: { id },
    });
  }

  async findByType(userId: string, type: string): Promise<Investment[]> {
    return this.prisma.investment.findMany({
      where: { userId, type: type as any },
      orderBy: { purchaseDate: 'desc' },
    });
  }

  async getPortfolioSummary(userId: string) {
    const investments = await this.prisma.investment.findMany({
      where: { userId },
    });

    if (investments.length === 0) {
      return {
        totalValue: 0,
        totalInvested: 0,
        totalGainLoss: 0,
        gainLossPercentage: 0,
        byType: {},
        topPerformers: [],
      };
    }

    const totalValue = investments.reduce(
      (sum, inv) => sum + Number(inv.currentValue),
      0,
    );

    const totalInvested = investments.reduce((sum, inv) => {
      const invested =
        inv.purchasePrice && inv.quantity
          ? Number(inv.purchasePrice) * Number(inv.quantity)
          : Number(inv.currentValue); // Fallback if purchase price not available
      return sum + invested;
    }, 0);

    const totalGainLoss = totalValue - totalInvested;
    const gainLossPercentage =
      totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    // Group by type
    const byType = investments.reduce(
      (acc, inv) => {
        const type = inv.type;
        if (!acc[type]) {
          acc[type] = {
            count: 0,
            totalValue: 0,
            totalInvested: 0,
          };
        }
        acc[type].count++;
        acc[type].totalValue += Number(inv.currentValue);

        const invested =
          inv.purchasePrice && inv.quantity
            ? Number(inv.purchasePrice) * Number(inv.quantity)
            : Number(inv.currentValue);
        acc[type].totalInvested += invested;

        return acc;
      },
      {} as Record<
        string,
        { count: number; totalValue: number; totalInvested: number }
      >,
    );

    // Calculate performance for each investment and get top performers
    const investmentsWithPerformance = investments.map((inv) => {
      const invested =
        inv.purchasePrice && inv.quantity
          ? Number(inv.purchasePrice) * Number(inv.quantity)
          : Number(inv.currentValue);
      const gainLoss = Number(inv.currentValue) - invested;
      const performance = invested > 0 ? (gainLoss / invested) * 100 : 0;

      return {
        ...inv,
        gainLoss,
        performance,
      };
    });

    const topPerformers = investmentsWithPerformance
      .sort((a, b) => b.performance - a.performance)
      .slice(0, 5);

    return {
      totalValue,
      totalInvested,
      totalGainLoss,
      gainLossPercentage,
      byType,
      topPerformers,
      investments: investmentsWithPerformance,
    };
  }

  async updateCurrentValue(
    id: string,
    userId: string,
    currentValue: number,
  ): Promise<Investment> {
    await this.findOne(id, userId); // Check if investment exists and belongs to user

    return this.prisma.investment.update({
      where: { id },
      data: { currentValue },
    });
  }
}
