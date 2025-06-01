import type { Task, Habit, Transaction, Goal, HabitDayProgress, SubTask, TaskCategory, Recurrence, Investment, InvestmentType } from '@/types';

export const mockTasks: Task[] = [
  { 
    id: '1', 
    name: 'Finalizar proposta do projeto Alfa', 
    priority: 'URGENT_IMPORTANT', 
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), 
    repetitionsRequired: 1,
    repetitionsCompleted: 0,
    category: 'WORK',
    recurrence: 'NONE', 
    description: 'Proposta detalhada para o projeto do Q3: incluir análise de mercado, alocação de recursos e cronograma.', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
  { 
    id: '2', 
    name: 'Agendar consulta no dentista', 
    priority: 'IMPORTANT_NOT_URGENT', 
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), 
    repetitionsRequired: 1,
    repetitionsCompleted: 0,
    category: 'HEALTH',
    recurrence: 'NONE', 
    description: 'Check-up regular de 6 meses e limpeza.', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
  { 
    id: '3', 
    name: 'Responder e-mails de clientes (diário)', 
    priority: 'URGENT_NOT_IMPORTANT', 
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), 
    repetitionsRequired: 1, 
    repetitionsCompleted: 1, 
    category: 'WORK',
    recurrence: 'DAILY', 
    description: 'Colocar em dia todas as comunicações pendentes de clientes.', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
  { 
    id: '4', 
    name: 'Organizar arquivos digitais na nuvem', 
    priority: 'NOT_URGENT_NOT_IMPORTANT', 
    dueDate: null, 
    repetitionsRequired: 3, 
    repetitionsCompleted: 1,
    category: 'HOME',
    recurrence: 'NONE', 
    description: 'Limpar área de trabalho, organizar pasta de documentos e fazer backup de arquivos importantes. (Passo 1/3: Limpar Área de Trabalho)', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
  { 
    id: '5', 
    name: 'Compras semanais de supermercado', 
    priority: 'IMPORTANT_NOT_URGENT', 
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), 
    repetitionsRequired: 1,
    repetitionsCompleted: 0,
    category: 'HOME',
    recurrence: 'WEEKLY', 
    description: 'Comprar frutas, vegetais e outros itens essenciais para a semana.', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
  { 
    id: '6', 
    name: 'Sessões de estudo para certificação', 
    priority: 'IMPORTANT_NOT_URGENT', 
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), 
    repetitionsRequired: 10, 
    repetitionsCompleted: 2,
    category: 'LEARNING',
    recurrence: 'NONE', 
    description: 'Completar 10 sessões de estudo de 2 horas cada para a certificação AWS.', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
];

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(today.getDate() - 2);

const generateHabitProgress = (startDate: Date, days: number, baseStatus: HabitProgressStatus[] = ['DONE', 'SKIPPED', 'MISSED']): HabitDayProgress[] => {
  const progress: HabitDayProgress[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() - i);
    if (Math.random() > 0.2) { 
      progress.push({
        date: date.toISOString().split('T')[0],
        status: baseStatus[Math.floor(Math.random() * baseStatus.length)],
      });
    }
  }
  return progress.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()); 
};


export const mockHabits: Habit[] = [
  {
    id: '1',
    name: 'Meditação Matinal',
    progress: generateHabitProgress(new Date(), 45, ['DONE', 'SKIPPED']), 
    streak: 5,
    description: '10 minutos de mindfulness usando o app Headspace.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Beber 2L de água',
    progress: generateHabitProgress(new Date(), 60), 
    streak: 1,
    description: 'Manter-se hidratado ao longo do dia, acompanhar com uma garrafa de água de 2L.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Ler 30 minutos antes de dormir',
    progress: generateHabitProgress(new Date(), 30, ['DONE', 'MISSED']), 
    streak: 12,
    description: 'Atualmente lendo "Hábitos Atômicos".',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
   {
    id: '4',
    name: 'Exercício Físico',
    progress: generateHabitProgress(new Date(), 20, ['DONE', 'SKIPPED']), 
    streak: 3,
    description: 'Pelo menos 30 minutos de atividade física (caminhada, corrida, academia).',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];


export const mockTransactions: Transaction[] = [
  { id: '1', type: 'income', amount: 1200.00, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), description: 'Projeto Freelance Alfa', category: 'Freelance', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isRecurring: false, recurrenceInterval: 'NONE' },
  { id: '2', type: 'expense', amount: 45.50, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), description: 'Compras no Supermercado X', category: 'Alimentação', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isRecurring: true, recurrenceInterval: 'WEEKLY' },
  { id: '3', type: 'expense', amount: 39.90, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), description: 'Assinatura Netflix', category: 'Entretenimento', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isRecurring: true, recurrenceInterval: 'MONTHLY' },
  { id: '4', type: 'income', amount: 250.00, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), description: 'Venda placa de vídeo antiga', category: 'Vendas', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isRecurring: false, recurrenceInterval: 'NONE' },
  { id: '5', type: 'expense', amount: 85.00, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), description: 'Jantar com amigos', category: 'Social', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isRecurring: false, recurrenceInterval: 'NONE' },
  { id: '6', type: 'expense', amount: 129.99, date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), description: 'Conta de Internet Fibra', category: 'Moradia', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isRecurring: true, recurrenceInterval: 'MONTHLY'},
  { id: '7', type: 'expense', amount: 75.00, date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), description: 'Plano de Celular', category: 'Utilidades', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isRecurring: true, recurrenceInterval: 'MONTHLY'},
];

export const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Economizar R$1000 para Fundo de Emergência',
    description: 'Criar um fundo de emergência para despesas inesperadas.',
    category: 'FINANCIAL',
    targetDate: new Date('2024-12-31').toISOString(),
    status: 'IN_PROGRESS',
    currentValue: 350,
    targetValue: 1000,
    subTasks: [
      { id: 'st1-1', name: 'Abrir conta poupança dedicada', completed: true },
      { id: 'st1-2', name: 'Transferir R$150 iniciais', completed: true },
      { id: 'st1-3', name: 'Configurar transferência automática mensal de R$100', completed: false },
      { id: 'st1-4', name: 'Avaliar progresso mensalmente', completed: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Correr 5K em menos de 30 minutos',
    description: 'Melhorar o ritmo de corrida e completar uma corrida de 5K.',
    category: 'HEALTH',
    targetDate: new Date('2024-10-30').toISOString(),
    status: 'IN_PROGRESS',
    currentValue: null,
    targetValue: null,
    subTasks: [
      { id: 'st2-1', name: 'Comprar tênis de corrida adequado', completed: true },
      { id: 'st2-2', name: 'Seguir plano de treino C25K (Couch to 5K)', completed: false },
      { id: 'st2-3', name: 'Correr 3x por semana', completed: false },
      { id: 'st2-4', name: 'Participar de uma corrida local de 5K', completed: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Aprender TypeScript Avançado',
    description: 'Aprofundar conhecimento em TypeScript para projetos de trabalho.',
    category: 'LEARNING',
    targetDate: new Date('2024-11-15').toISOString(),
    status: 'NOT_STARTED',
    currentValue: null,
    targetValue: null,
    subTasks: [
      { id: 'st3-1', name: 'Concluir curso online de TypeScript', completed: false },
      { id: 'st3-2', name: 'Desenvolver um projeto pessoal com TypeScript', completed: false },
      { id: 'st3-3', name: 'Contribuir para um projeto open-source com TypeScript', completed: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Ler 12 livros este ano',
    description: 'Expandir conhecimento e aproveitar mais a leitura.',
    category: 'PERSONAL',
    targetDate: new Date('2024-12-31').toISOString(),
    status: 'IN_PROGRESS',
    currentValue: 5,
    targetValue: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

export const mockUserId = "usr_fluxo_rotina_axb345cz_dev001";

export const mockDietPlan = `
**Segunda-feira:**
- Café da manhã: Aveia com frutas vermelhas e nozes
- Almoço: Salada de frango grelhado com mix de folhas e vinagrete
- Jantar: Salmão assado com quinoa e aspargos tostados
- Lanches: Fatias de maçã com pasta de amendoim, Iogurte grego

**Terça-feira:**
- Café da manhã: Ovos mexidos com espinafre e torrada integral
- Almoço: Sopa de lentilha com pão integral
- Jantar: Almôndegas de peru com macarrão de abobrinha e molho marinara
- Lanches: Um punhado de amêndoas, Cenourinhas com homus
`;

export const mockWorkoutPlan = `
**Segunda-feira: Treino de Força Full Body**
- Agachamentos: 3 séries de 10-12 repetições
- Supino: 3 séries de 10-12 repetições
- Levantamento Terra (Romano ou Convencional): 1 série de 5 reps / 3 séries de 8-10 reps
- Desenvolvimento Militar (Overhead Press): 3 séries de 10-12 repetições
- Remada Curvada: 3 séries de 10-12 repetições

**Quarta-feira: Cardio & Core**
- Corrida/Ciclismo: 30-45 minutos de intensidade moderada
- Prancha: 3 séries, 60 segundos de isometria
- Russian Twists: 3 séries de 15-20 repetições por lado
- Elevação de Pernas: 3 séries de 15-20 repetições

**Sexta-feira: Foco em Membros Superiores**
- Supino Inclinado com Halteres: 3 séries de 10-12 repetições
- Barra Fixa/Puxada Alta: 3 séries até a falha ou 8-12 repetições
- Desenvolvimento de Ombros com Halteres: 3 séries de 10-12 repetições
- Rosca Direta (Bíceps): 3 séries de 12-15 repetições
- Tríceps Pulley: 3 séries de 12-15 repetições
`;

export const mockInvestments: Investment[] = [
  {
    id: 'inv-1',
    name: 'Ações da TechCorp (TCORP)',
    type: 'STOCK',
    quantity: 50,
    purchasePrice: 150.75,
    currentValue: 9250.00, // 50 * 185.00
    purchaseDate: new Date('2023-01-15').toISOString(),
    notes: 'Investimento de longo prazo em empresa de tecnologia promissora.',
    createdAt: new Date('2023-01-15').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'inv-2',
    name: 'CryptoMoeda X (CMX)',
    type: 'CRYPTO',
    quantity: 5,
    purchasePrice: 800.00,
    currentValue: 4500.00, // 5 * 900.00
    purchaseDate: new Date('2023-06-20').toISOString(),
    notes: 'Pequena alocação em criptomoeda com alto potencial de crescimento.',
    createdAt: new Date('2023-06-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'inv-3',
    name: 'Fundo Imobiliário Praça Central (FIPC11)',
    type: 'REAL_ESTATE', // Pode ser 'FUND' se for um FII
    quantity: 100,
    purchasePrice: 95.00,
    currentValue: 10200.00, // 100 * 102.00
    purchaseDate: new Date('2022-11-01').toISOString(),
    notes: 'Fundo de investimento imobiliário focado em renda de aluguel comercial.',
    createdAt: new Date('2022-11-01').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];