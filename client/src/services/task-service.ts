import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '@/types';
import apiClient, { MOCK_USER_ID } from '@/lib/api';

/**
 * Hook para buscar todas as tarefas do usuário
 */
export const useGetTasks = (userId: string = MOCK_USER_ID) => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/tasks?userId=${userId}`);
      return data;
    },
  });
};

/**
 * Hook para buscar tarefas próximas (com data de vencimento)
 */
export const useGetUpcomingTasks = (userId: string = MOCK_USER_ID, limit: number = 10) => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'upcoming', userId, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(`/tasks/upcoming?userId=${userId}&limit=${limit}`);
      return data;
    },
  });
};

/**
 * Hook para adicionar uma nova tarefa
 */
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

/**
 * Hook para atualizar uma tarefa existente
 */
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

/**
 * Hook para excluir uma tarefa
 */
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

/**
 * Hook para marcar uma tarefa como concluída
 */
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
