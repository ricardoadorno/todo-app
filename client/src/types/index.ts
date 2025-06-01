
export type Priority = 
  | 'URGENT_IMPORTANT'    // Fazer Primeiro
  | 'IMPORTANT_NOT_URGENT'// Agendar
  | 'URGENT_NOT_IMPORTANT'  // Delegar / Mais tarde
  | 'NOT_URGENT_NOT_IMPORTANT'; // Eliminar / Talvez mais tarde

export type Recurrence = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

// NOVO: Categorias para Tarefas
export type TaskCategory = 'FINANCIAL' | 'HEALTH' | 'PERSONAL' | 'WORK' | 'LEARNING' | 'HOME' | 'OTHER';

export interface Task {
  id: string;
  name: string;
  description?: string;
  priority: Priority;
  dueDate: string | null; // ISO string
  repetitionsRequired: number; 
  repetitionsCompleted: number; 
  category: TaskCategory; 
  recurrence: Recurrence;
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
}

export type HabitProgressStatus = 'DONE' | 'SKIPPED' | 'MISSED';

export interface HabitDayProgress {
  date: string; // YYYY-MM-DD
  status: HabitProgressStatus;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  streak: number; 
  progress: HabitDayProgress[];
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
}

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number; 
  date: string; // ISO string 
  description: string; 
  category?: string; 
  isRecurring?: boolean; 
  recurrenceInterval?: Recurrence; 
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
}

export type GoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';

export type GoalCategory = 'PERSONAL' | 'FINANCIAL' | 'HEALTH' | 'CAREER' | 'LEARNING' | 'OTHER';

export interface SubTask {
  id: string;
  name: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  name: string;
  description?: string;
  category: GoalCategory;
  targetDate: string | null; // ISO string 
  status: GoalStatus;
  currentValue?: number | null; 
  targetValue?: number | null; 
  subTasks?: SubTask[];
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
}

// Tipos para Investimentos
export type InvestmentType = 'STOCK' | 'CRYPTO' | 'FUND' | 'REAL_ESTATE' | 'OTHER';

export interface Investment {
  id: string;
  name: string; // ex: "Ações da Apple", "Bitcoin"
  type: InvestmentType;
  quantity?: number; // opcional, pode não ser aplicável a todos os tipos
  purchasePrice?: number; // preço unitário na compra
  currentValue: number; // valor total atual do investimento
  purchaseDate: string; // ISO string
  notes?: string;
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
}
