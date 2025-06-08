import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { HealthData, HealthMeasurement, Exercise, DietPlan, WorkoutPlan } from '@/types';
import apiClient from '@/lib/api';

/**
 * Hook para buscar todos os dados de saúde do usuário
 */
export const useGetHealthData = () => {
  return useQuery<HealthData, Error>({
    queryKey: ['health'],
    queryFn: async () => {
      const { data } = await apiClient.get('/health');
      return data;
    },
  });
};

/**
 * Hook para adicionar uma medição de saúde (ex: peso, pressão, etc)
 */
export const useAddHealthMeasurement = () => {
  const queryClient = useQueryClient();
  return useMutation<HealthMeasurement, Error, Omit<HealthMeasurement, 'id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: async (newMeasurement) => {
      const { data } = await apiClient.post('/health/measurements', {
        ...newMeasurement,
        date: newMeasurement.date ? new Date(newMeasurement.date) : new Date(),
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health'] });
    },
  });
};

/**
 * Hook para registrar atividade física
 */
export const useAddExercise = () => {
  const queryClient = useQueryClient();
  return useMutation<Exercise, Error, Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: async (newExercise) => {
      const { data } = await apiClient.post('/health/exercises', {
        ...newExercise,
        date: newExercise.date ? new Date(newExercise.date) : new Date(),
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health'] });
    },
  });
};

/**
 * Hook para buscar o plano de dieta atual
 */
export const useGetCurrentDietPlan = () => {
  return useQuery<DietPlan, Error>({
    queryKey: ['health', 'diet-plan'],
    queryFn: async () => {
      const { data } = await apiClient.get('/health/diet-plan?current=true');
      return data;
    },
  });
};

/**
 * Hook para salvar/atualizar o plano de dieta
 */
export const useUpdateDietPlan = () => {
  const queryClient = useQueryClient();
  return useMutation<DietPlan, Error, Omit<DietPlan, 'id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: async (dietPlan) => {
      const { data } = await apiClient.post('/health/diet-plan', {
        ...dietPlan,
        startDate: dietPlan.startDate ? new Date(dietPlan.startDate) : new Date(),
        endDate: dietPlan.endDate ? new Date(dietPlan.endDate) : null,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health'] });
    },
  });
};

/**
 * Hook para buscar o plano de treino atual
 */
export const useGetCurrentWorkoutPlan = () => {
  return useQuery<WorkoutPlan, Error>({
    queryKey: ['health', 'workout-plan'],
    queryFn: async () => {
      const { data } = await apiClient.get('/health/workout-plan?current=true');
      return data;
    },
  });
};

/**
 * Hook para salvar/atualizar o plano de treino
 */
export const useUpdateWorkoutPlan = () => {
  const queryClient = useQueryClient();
  return useMutation<WorkoutPlan, Error, Omit<WorkoutPlan, 'id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: async (workoutPlan) => {
      const { data } = await apiClient.post('/health/workout-plan', {
        ...workoutPlan,
        startDate: workoutPlan.startDate ? new Date(workoutPlan.startDate) : new Date(),
        endDate: workoutPlan.endDate ? new Date(workoutPlan.endDate) : null,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health'] });
    },
  });
};

/**
 * Hook para registrar sono
 */
export const useAddSleepRecord = () => {
  const queryClient = useQueryClient();
  return useMutation<HealthMeasurement, Error, {hours: number, date: string, notes?: string}>({
    mutationFn: async (sleepData) => {
      const { data } = await apiClient.post('/health/measurements', {
        type: 'SLEEP_HOURS',
        value: sleepData.hours,
        unit: 'hours',
        date: sleepData.date ? new Date(sleepData.date) : new Date(),
        notes: sleepData.notes,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health'] });
    },
  });
};
