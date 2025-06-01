import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task, Habit, Transaction, Goal, Investment, HabitDayProgress } from '@/types';

// Mock user ID para desenvolvimento - em produção viria da autenticação
export const MOCK_USER_ID = "usr_fluxo_rotina_axb345cz_dev001";

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Backend NestJS na porta 3001 com prefixo /api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tasks
export const useGetTasks = (userId: string = MOCK_USER_ID) => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/tasks?userId=${userId}`);
      return data;
    },
  });
};

export const useGetUpcomingTasks = (userId: string = MOCK_USER_ID, limit: number = 10) => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'upcoming', userId, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(`/tasks/upcoming?userId=${userId}&limit=${limit}`);
      return data;
    },
  });
};

export const useAddTask = () => {
  const queryClient = useQueryClient();
  return useMutation<Task, Error, Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: async (newTask) => {
      const taskData = {
        ...newTask,
        userId: MOCK_USER_ID,
        // Converter ISO string para Date se necessário
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
      };
      const { data } = await apiClient.post('/tasks', taskData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation<Task, Error, Task>({
    mutationFn: async (updatedTask) => {
      const taskData = {
        ...updatedTask,
        dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : null,
      };
      const { data } = await apiClient.patch(`/tasks/${updatedTask.id}?userId=${MOCK_USER_ID}`, taskData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (taskId) => {
      await apiClient.delete(`/tasks/${taskId}?userId=${MOCK_USER_ID}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useMarkTaskCompleted = () => {
  const queryClient = useQueryClient();
  return useMutation<Task, Error, string>({
    mutationFn: async (taskId) => {
      const { data } = await apiClient.patch(`/tasks/${taskId}/complete?userId=${MOCK_USER_ID}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// Habits
export const useGetHabits = (userId: string = MOCK_USER_ID) => {
  return useQuery<Habit[], Error>({
    queryKey: ['habits', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/habits?userId=${userId}`);
      return data;
    },
  });
};

export const useGetActiveHabits = (userId: string = MOCK_USER_ID, limit: number = 10) => {
  return useQuery<Habit[], Error>({
    queryKey: ['habits', 'active', userId, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(`/habits/active?userId=${userId}&limit=${limit}`);
      return data;
    },
  });
};

export const useAddHabit = () => {
  const queryClient = useQueryClient();
  return useMutation<Habit, Error, Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: async (newHabit) => {
      const habitData = {
        ...newHabit,
        userId: MOCK_USER_ID,
      };
      const { data } = await apiClient.post('/habits', habitData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
};

export const useUpdateHabit = () => {
  const queryClient = useQueryClient();
  return useMutation<Habit, Error, Habit>({
    mutationFn: async (updatedHabit) => {
      const { data } = await apiClient.patch(`/habits/${updatedHabit.id}?userId=${MOCK_USER_ID}`, updatedHabit);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
};

export const useDeleteHabit = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (habitId) => {
      await apiClient.delete(`/habits/${habitId}?userId=${MOCK_USER_ID}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
};

// Transactions
export const useGetTransactions = (userId: string = MOCK_USER_ID) => {
  return useQuery<Transaction[], Error>({
    queryKey: ['transactions', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/transactions?userId=${userId}`);
      return data;
    },
  });
};

export const useGetFinancialOverview = (userId: string = MOCK_USER_ID, monthsBack: number = 6) => {
  return useQuery<any, Error>({
    queryKey: ['transactions', 'overview', userId, monthsBack],
    queryFn: async () => {
      const { data } = await apiClient.get(`/transactions/overview?userId=${userId}&monthsBack=${monthsBack}`);
      return data;
    },
  });
};

export const useAddTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<Transaction, Error, Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: async (newTransaction) => {
      const transactionData = {
        ...newTransaction,
        userId: MOCK_USER_ID,
        date: newTransaction.date ? new Date(newTransaction.date) : new Date(),
      };
      const { data } = await apiClient.post('/transactions', transactionData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<Transaction, Error, Transaction>({
    mutationFn: async (updatedTransaction) => {
      const transactionData = {
        ...updatedTransaction,
        date: updatedTransaction.date ? new Date(updatedTransaction.date) : new Date(),
      };
      const { data } = await apiClient.patch(`/transactions/${updatedTransaction.id}?userId=${MOCK_USER_ID}`, transactionData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (transactionId) => {
      await apiClient.delete(`/transactions/${transactionId}?userId=${MOCK_USER_ID}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

// Goals
export const useGetGoals = (userId: string = MOCK_USER_ID) => {
  return useQuery<Goal[], Error>({
    queryKey: ['goals', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/goals?userId=${userId}`);
      return data;
    },
  });
};

export const useGetGoalsInProgress = (userId: string = MOCK_USER_ID, limit: number = 5) => {
  return useQuery<Goal[], Error>({
    queryKey: ['goals', 'in-progress', userId, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(`/goals/in-progress?userId=${userId}&limit=${limit}`);
      return data;
    },
  });
};

export const useAddGoal = () => {
  const queryClient = useQueryClient();
  return useMutation<Goal, Error, Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: async (newGoal) => {
      const goalData = {
        ...newGoal,
        userId: MOCK_USER_ID,
        targetDate: newGoal.targetDate ? new Date(newGoal.targetDate) : null,
      };
      const { data } = await apiClient.post('/goals', goalData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation<Goal, Error, Goal>({
    mutationFn: async (updatedGoal) => {
      const goalData = {
        ...updatedGoal,
        targetDate: updatedGoal.targetDate ? new Date(updatedGoal.targetDate) : null,
      };
      const { data } = await apiClient.patch(`/goals/${updatedGoal.id}?userId=${MOCK_USER_ID}`, goalData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (goalId) => {
      await apiClient.delete(`/goals/${goalId}?userId=${MOCK_USER_ID}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

// Investments
export const useGetInvestments = (userId: string = MOCK_USER_ID) => {
  return useQuery<Investment[], Error>({
    queryKey: ['investments', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/investments?userId=${userId}`);
      return data;
    },
  });
};

export const useGetPortfolioSummary = (userId: string = MOCK_USER_ID) => {
  return useQuery<any, Error>({
    queryKey: ['investments', 'portfolio', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/investments/portfolio?userId=${userId}`);
      return data;
    },
  });
};

export const useAddInvestment = () => {
  const queryClient = useQueryClient();
  return useMutation<Investment, Error, Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: async (newInvestment) => {
      const investmentData = {
        ...newInvestment,
        userId: MOCK_USER_ID,
        purchaseDate: newInvestment.purchaseDate ? new Date(newInvestment.purchaseDate) : new Date(),
      };
      const { data } = await apiClient.post('/investments', investmentData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
    },
  });
};

export const useUpdateInvestment = () => {
  const queryClient = useQueryClient();
  return useMutation<Investment, Error, Investment>({
    mutationFn: async (updatedInvestment) => {
      const investmentData = {
        ...updatedInvestment,
        purchaseDate: updatedInvestment.purchaseDate ? new Date(updatedInvestment.purchaseDate) : new Date(),
      };
      const { data } = await apiClient.patch(`/investments/${updatedInvestment.id}?userId=${MOCK_USER_ID}`, investmentData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
    },
  });
};

export const useDeleteInvestment = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (investmentId) => {
      await apiClient.delete(`/investments/${investmentId}?userId=${MOCK_USER_ID}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
    },
  });
};

// Habit Progress
export const useCreateHabitProgress = () => {
  const queryClient = useQueryClient();
  return useMutation<HabitDayProgress, Error, Omit<HabitDayProgress, 'id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: async (progressData) => {
      const { data } = await apiClient.post('/habits/progress', {
        ...progressData,
        date: new Date(progressData.date),
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habit-progress'] });
    },
  });
};

export const useUpdateHabitProgress = () => {
  const queryClient = useQueryClient();
  return useMutation<HabitDayProgress, Error, { habitId: string; date: string; status: 'DONE' | 'SKIPPED' | 'MISSED' }>({
    mutationFn: async ({ habitId, date, status }) => {
      const { data } = await apiClient.patch(`/habits/${habitId}/progress/${date}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habit-progress'] });
    },
  });
};

export const useGetHabitProgress = (habitId: string, startDate: string, endDate: string) => {
  return useQuery<HabitDayProgress[], Error>({
    queryKey: ['habit-progress', habitId, startDate, endDate],
    queryFn: async () => {
      const { data } = await apiClient.get(`/habits/${habitId}/progress?startDate=${startDate}&endDate=${endDate}`);
      return data;
    },
    enabled: !!habitId && !!startDate && !!endDate,
  });
};
