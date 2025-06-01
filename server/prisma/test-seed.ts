import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create a demo user
    const user = await prisma.user.upsert({
      where: { email: 'demo@routineflow.com' },
      update: {},
      create: {
        email: 'demo@routineflow.com',
        name: 'Demo User',
      },
    });

    console.log('✅ Created user:', user.email);

    // Create a simple task
    const task = await prisma.task.create({
      data: {
        name: 'Test Task',
        description: 'This is a test task',
        priority: 'IMPORTANT_NOT_URGENT',
        category: 'PERSONAL',
        userId: user.id,
      },
    });

    console.log('✅ Created task:', task.name);

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
