import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Transaction, Investment, FinancialOverview } from '@/types';
import apiClient, { MOCK_USER_ID } from '@/lib/api';

// ===== TRANSACTIONS =====

/**
 * Hook para buscar todas as transações do usuário
 */
export const useGetTransactions = (userId: string = MOCK_USER_ID) => {
  return useQuery<Transaction[], Error>({
    queryKey: ['transactions', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/transactions?userId=${userId}`);
      return data;
    },
  });
};

/**
 * Hook para buscar o resumo financeiro do usuário
 */
export const useGetFinancialOverview = (userId: string = MOCK_USER_ID, monthsBack: number = 6) => {
  return useQuery<FinancialOverview, Error>({
    queryKey: ['transactions', 'overview', userId, monthsBack],
    queryFn: async () => {
      const { data } = await apiClient.get(`/transactions/overview?userId=${userId}&monthsBack=${monthsBack}`);
      return data;
    },
  });
};

/**
 * Hook para adicionar uma nova transação
 */
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

/**
 * Hook para atualizar uma transação existente
 */
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

/**
 * Hook para excluir uma transação
 */
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

// ===== INVESTMENTS =====

/**
 * Hook para buscar todos os investimentos do usuário
 */
export const useGetInvestments = (userId: string = MOCK_USER_ID) => {
  return useQuery<Investment[], Error>({
    queryKey: ['investments', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/investments?userId=${userId}`);
      return data;
    },
  });
};

/**
 * Hook para buscar o resumo do portfólio de investimentos
 */
export const useGetPortfolioSummary = (userId: string = MOCK_USER_ID) => {
  return useQuery<any, Error>({
    queryKey: ['investments', 'portfolio', userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/investments/portfolio?userId=${userId}`);
      return data;
    },
  });
};

/**
 * Hook para adicionar um novo investimento
 */
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

/**
 * Hook para atualizar um investimento existente
 */
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

/**
 * Hook para excluir um investimento
 */
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
