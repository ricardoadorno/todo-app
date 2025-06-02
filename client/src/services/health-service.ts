import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { HealthData, HealthMeasurement, Exercise, DietPlan, WorkoutPlan } from '@/types';
import apiClient, { MOCK_USER_ID } from '@/lib/api';

/**
 * Hook para buscar todos os dados de saúde do usuário
 */
export const useGetHealthData = (userId: string = MOCK_USER_ID) => {
  return useQuery<HealthData, Error>({
    queryKey: ['health', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/health?userId=${userId}`);
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
        userId: MOCK_USER_ID,
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
        userId: MOCK_USER_ID,
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
export const useGetCurrentDietPlan = (userId: string = MOCK_USER_ID) => {
  return useQuery<DietPlan, Error>({
    queryKey: ['health', 'diet-plan', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/health/diet-plan?userId=${userId}&current=true`);
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
        userId: MOCK_USER_ID,
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
export const useGetCurrentWorkoutPlan = (userId: string = MOCK_USER_ID) => {
  return useQuery<WorkoutPlan, Error>({
    queryKey: ['health', 'workout-plan', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/health/workout-plan?userId=${userId}&current=true`);
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
        userId: MOCK_USER_ID,
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
        userId: MOCK_USER_ID,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health'] });
    },
  });
};
