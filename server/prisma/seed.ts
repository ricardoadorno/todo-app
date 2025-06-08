// Arquivo temporário para a seed de teste
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Hash senha padrão para o usuário de demo
    const hashedPassword = await bcrypt.hash('demo123456', 10);

    // Create a demo user
    const user = await prisma.user.upsert({
      where: { email: 'demo@routineflow.com' },
      update: {},
      create: {
        email: 'demo@routineflow.com',
        name: 'Demo User',
        password: hashedPassword,
      },
    });

    console.log('✅ Created user:', user.email);

    // ... resto do arquivo original
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
