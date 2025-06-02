import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Goal } from '@/types';
import apiClient, { MOCK_USER_ID } from '@/lib/api';

/**
 * Hook para buscar todas as metas do usuário
 */
export const useGetGoals = (userId: string = MOCK_USER_ID) => {
  return useQuery<Goal[], Error>({
    queryKey: ['goals', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/goals?userId=${userId}`);
      return data;
    },
  });
};

/**
 * Hook para buscar metas em progresso
 */
export const useGetGoalsInProgress = (userId: string = MOCK_USER_ID, limit: number = 5) => {
  return useQuery<Goal[], Error>({
    queryKey: ['goals', 'in-progress', userId, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(`/goals/in-progress?userId=${userId}&limit=${limit}`);
      return data;
    },
  });
};

/**
 * Hook para adicionar uma nova meta
 */
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

/**
 * Hook para atualizar uma meta existente
 */
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

/**
 * Hook para excluir uma meta
 */
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
