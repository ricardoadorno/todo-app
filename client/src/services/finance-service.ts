import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Transaction, Investment, FinancialOverview } from '@/types';
import apiClient from '@/lib/api';

// ===== TRANSACTIONS =====

/**
 * Hook para buscar todas as transações do usuário
 */
export const useGetTransactions = () => {
  return useQuery<Transaction[], Error>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data } = await apiClient.get('/transactions');
      return data;
    },
  });
};

/**
 * Hook para buscar o resumo financeiro do usuário
 */
export const useGetFinancialOverview = (monthsBack: number = 6) => {
  return useQuery<FinancialOverview, Error>({
    queryKey: ['transactions', 'overview', monthsBack],
    queryFn: async () => {
      const { data } = await apiClient.get(`/transactions/overview?monthsBack=${monthsBack}`);
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
      const { data } = await apiClient.patch(`/transactions/${updatedTransaction.id}`, transactionData);
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
      await apiClient.delete(`/transactions/${transactionId}`);
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
export const useGetInvestments = () => {
  return useQuery<Investment[], Error>({
    queryKey: ['investments'],
    queryFn: async () => {
      const { data } = await apiClient.get('/investments');
      return data;
    },
  });
};

/**
 * Hook para buscar o resumo do portfólio de investimentos
 */
export const useGetPortfolioSummary = () => {
  return useQuery<any, Error>({
    queryKey: ['investments', 'portfolio'],
    queryFn: async () => {
      const { data } = await apiClient.get('/investments/portfolio-summary');
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
      const { data } = await apiClient.patch(`/investments/${updatedInvestment.id}`, investmentData);
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
      await apiClient.delete(`/investments/${investmentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
    },
  });
};
