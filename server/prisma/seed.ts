import { PrismaClient, HabitProgressStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@routineflow.com' },
    update: {},
    create: {
      email: 'demo@routineflow.com',
      name: 'Demo User',
    },
  });

  console.log('👤 Created user:', user.email);

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        name: 'Review quarterly goals',
        description: 'Analyze progress and adjust objectives for next quarter',
        priority: 'IMPORTANT_NOT_URGENT',
        category: 'WORK',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        userId: user.id,
      },
    }),
    prisma.task.create({
      data: {
        name: 'Schedule dentist appointment',
        description: 'Annual checkup and cleaning',
        priority: 'URGENT_IMPORTANT',
        category: 'HEALTH',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        userId: user.id,
      },
    }),
    prisma.task.create({
      data: {
        name: 'Update portfolio website',
        description: 'Add recent projects and update skills section',
        priority: 'IMPORTANT_NOT_URGENT',
        category: 'PERSONAL',
        userId: user.id,
      },
    }),
  ]);

  console.log(`📋 Created ${tasks.length} tasks`);

  // Create sample habits
  const habits = await Promise.all([
    prisma.habit.create({
      data: {
        name: 'Morning meditation',
        description: '10 minutes of mindfulness practice',
        streak: 5,
        userId: user.id,
      },
    }),
    prisma.habit.create({
      data: {
        name: 'Daily walk',
        description: '30 minutes outdoor walk',
        streak: 12,
        userId: user.id,
      },
    }),
    prisma.habit.create({
      data: {
        name: 'Read before bed',
        description: 'Read for 20 minutes before sleeping',
        streak: 3,
        userId: user.id,
      },
    }),
  ]);

  console.log(`🎯 Created ${habits.length} habits`);

  // Create sample goals
  const goals = await Promise.all([
    prisma.goal.create({
      data: {
        name: 'Emergency Fund',
        description: 'Build an emergency fund covering 6 months of expenses',
        category: 'FINANCIAL',
        status: 'IN_PROGRESS',
        currentValue: 5000,
        targetValue: 15000,
        targetDate: new Date('2025-12-31'),
        userId: user.id,
        subTasks: {
          create: [
            { name: 'Set up automatic savings transfer', completed: true },
            { name: 'Open high-yield savings account', completed: true },
            { name: 'Save $1000 per month', completed: false },
            { name: 'Review and adjust budget', completed: false },
          ],
        },
      },
    }),
    prisma.goal.create({
      data: {
        name: 'Learn TypeScript',
        description: 'Master TypeScript for better web development',
        category: 'LEARNING',
        status: 'IN_PROGRESS',
        currentValue: 60,
        targetValue: 100,
        userId: user.id,
        subTasks: {
          create: [
            { name: 'Complete TypeScript handbook', completed: true },
            { name: 'Build a TypeScript project', completed: false },
            { name: 'Learn advanced types', completed: false },
          ],
        },
      },
    }),
  ]);

  console.log(`🚀 Created ${goals.length} goals`);

  // Create sample transactions
  const transactions = await Promise.all([
    prisma.transaction.create({
      data: {
        type: 'INCOME',
        amount: 5000,
        date: new Date(),
        description: 'Monthly salary',
        category: 'Salary',
        isRecurring: true,
        recurrenceInterval: 'MONTHLY',
        userId: user.id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'EXPENSE',
        amount: 1200,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        description: 'Monthly rent',
        category: 'Housing',
        isRecurring: true,
        recurrenceInterval: 'MONTHLY',
        userId: user.id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'EXPENSE',
        amount: 89.99,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        description: 'Grocery shopping',
        category: 'Food',
        userId: user.id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'EXPENSE',
        amount: 45.0,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        description: 'Gas station',
        category: 'Transportation',
        userId: user.id,
      },
    }),
  ]);

  console.log(`💰 Created ${transactions.length} transactions`);

  // Create sample investments
  const investments = await Promise.all([
    prisma.investment.create({
      data: {
        name: 'Apple Inc. (AAPL)',
        type: 'STOCK',
        quantity: 10,
        purchasePrice: 150.0,
        currentValue: 1750.0,
        purchaseDate: new Date('2024-01-15'),
        notes: 'Tech stock for long-term growth',
        userId: user.id,
      },
    }),
    prisma.investment.create({
      data: {
        name: 'Bitcoin (BTC)',
        type: 'CRYPTO',
        quantity: 0.5,
        purchasePrice: 45000.0,
        currentValue: 30000.0,
        purchaseDate: new Date('2024-03-10'),
        notes: 'Cryptocurrency investment',
        userId: user.id,
      },
    }),
    prisma.investment.create({
      data: {
        name: 'S&P 500 ETF',
        type: 'FUND',
        quantity: 50,
        purchasePrice: 400.0,
        currentValue: 22500.0,
        purchaseDate: new Date('2024-02-01'),
        notes: 'Diversified index fund',
        userId: user.id,
      },
    }),
  ]);
  console.log(`📈 Created ${investments.length} investments`);

  // Create habit progress for the last few days
  const today = new Date();
  const progressData: Array<{
    habitId: string;
    date: Date;
    status: HabitProgressStatus;
  }> = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    for (const habit of habits) {
      const random = Math.random();
      const status =
        random > 0.3
          ? HabitProgressStatus.DONE
          : random > 0.5
            ? HabitProgressStatus.SKIPPED
            : HabitProgressStatus.MISSED;

      progressData.push({
        habitId: habit.id,
        date,
        status,
      });
    }
  }

  const habitProgress = await prisma.habitDayProgress.createMany({
    data: progressData,
    skipDuplicates: true,
  });

  console.log(`📊 Created habit progress entries`);

  console.log('✅ Seeding completed successfully!');
  console.log(`👤 Demo user: ${user.email} (ID: ${user.id})`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
