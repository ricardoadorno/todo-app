import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { HabitsModule } from './habits/habits.module';
import { GoalsModule } from './goals/goals.module';
import { TransactionsModule } from './transactions/transactions.module';
import { InvestmentsModule } from './investments/investments.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    TasksModule,
    HabitsModule,
    GoalsModule,
    TransactionsModule,
    InvestmentsModule,
    HealthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
