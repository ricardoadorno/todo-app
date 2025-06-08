import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Adicionado ConfigModule
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { HabitsModule } from './habits/habits.module';
import { GoalsModule } from './goals/goals.module';
import { TransactionsModule } from './transactions/transactions.module';
import { InvestmentsModule } from './investments/investments.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Adicionado ConfigModule.forRoot
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    TasksModule,
    HabitsModule,
    GoalsModule,
    TransactionsModule,
    InvestmentsModule,
    HealthModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
