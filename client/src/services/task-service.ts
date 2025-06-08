import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '@/types';
import apiClient from '@/lib/api';

/**
 * Hook para buscar todas as tarefas do usuário
 */
export const useGetTasks = () => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await apiClient.get('/tasks');
      return data;
    },
  });
};

/**
 * Hook para buscar tarefas próximas (com data de vencimento)
 */
export const useGetUpcomingTasks = (limit: number = 10) => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'upcoming', limit],
    queryFn: async () => {
      const { data } = await apiClient.get(`/tasks/upcoming?limit=${limit}`);
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
      // Remove os campos que devem ser gerados pelo servidor
      const { id, createdAt, updatedAt, ...taskDataToSend } = newTask as Task;
      
      const taskData = {
        ...taskDataToSend,
        dueDate: taskDataToSend.dueDate ? new Date(taskDataToSend.dueDate) : null,
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
      // Remove os campos que devem ser gerados pelo servidor
      const { id, createdAt, updatedAt, ...taskDataToSend } = updatedTask;
      
      const taskData = {
        ...taskDataToSend,
        dueDate: taskDataToSend.dueDate ? new Date(taskDataToSend.dueDate) : null,
      };
      
      const { data } = await apiClient.patch(`/tasks/${id}`, taskData);
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
      await apiClient.delete(`/tasks/${taskId}`);
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
      const { data } = await apiClient.patch(`/tasks/${taskId}/complete`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
