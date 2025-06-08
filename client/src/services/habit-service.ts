import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Habit, HabitDayProgress } from '@/types';
import apiClient from '@/lib/api';

/**
 * Hook para buscar todos os hábitos do usuário
 */
export const useGetHabits = () => {
  return useQuery<Habit[], Error>({
    queryKey: ['habits'],
    queryFn: async () => {
      const { data } = await apiClient.get('/habits');
      return data;
    },
  });
};

/**
 * Hook para buscar hábitos ativos do usuário
 */
export const useGetActiveHabits = (limit: number = 10) => {
  return useQuery<Habit[], Error>({
    queryKey: ['habits', 'active', limit],
    queryFn: async () => {
      const { data } = await apiClient.get(`/habits/active?limit=${limit}`);
      return data;
    },
  });
};

/**
 * Hook para adicionar um novo hábito
 */
export const useAddHabit = () => {
  const queryClient = useQueryClient();
  return useMutation<Habit, Error, Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: async (newHabit) => {
      const habitData = {
        ...newHabit,
      };
      const { data } = await apiClient.post('/habits', habitData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
};

/**
 * Hook para atualizar um hábito existente
 */
export const useUpdateHabit = () => {
  const queryClient = useQueryClient();
  return useMutation<Habit, Error, Habit>({
    mutationFn: async (updatedHabit) => {
      const { data } = await apiClient.patch(`/habits/${updatedHabit.id}`, updatedHabit);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
};

/**
 * Hook para excluir um hábito
 */
export const useDeleteHabit = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (habitId) => {
      await apiClient.delete(`/habits/${habitId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
};

/**
 * Hook para criar um progresso diário de hábito
 */
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

/**
 * Hook para atualizar o progresso de um hábito
 */
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

/**
 * Hook para buscar o progresso de um hábito em um período
 */
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
