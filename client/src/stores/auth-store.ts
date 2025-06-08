"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthState } from '@/types';
import apiClient, { ApiError } from '@/lib/api';

interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token?: string;
}

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  checkSession: () => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      isAuthenticated: false,
      isLoading: true,
      token: null,
      error: null,

      // Ações
      setUser: (user) => 
        set(() => ({ user, isAuthenticated: !!user })),
      
      setLoading: (isLoading) => 
        set(() => ({ isLoading })),
      
      setError: (error) => 
        set(() => ({ error })),
        login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data } = await apiClient.post<AuthResponse>('/auth/login', { email, password });
          
          if (data.access_token) {
            // Configurar token para requisições futuras
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
            
            // Salvar refresh token separadamente se estiver disponível
            if (data.refresh_token) {
              localStorage.setItem('auth-refresh-token', data.refresh_token);
            }
            
            set({
              user: data.user,
              token: data.access_token,
              isAuthenticated: true,
              isLoading: false
            });
          }
        } catch (err: any) {
          const errorMessage = err?.response?.data?.message || 'Erro ao fazer login';
          set({ isLoading: false, error: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage });
          throw err;
        }
      },register: async (name, email, password) => {
        try {
          set({ isLoading: true, error: null });
          
          await apiClient.post('/auth/register', { name, email, password });
          
          set({ isLoading: false });
        } catch (err: any) {
          const errorMessage = err?.response?.data?.message || 'Erro ao registrar usuário';
          set({ isLoading: false, error: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage });
          throw err;
        }
      },

      checkSession: async () => {
        try {
          set({ isLoading: true });
          
          // Verificar se o token ainda é válido chamando um endpoint protegido
          const { data } = await apiClient.get<User>('/auth/profile');
          
          if (data) {
            set({ 
              user: data, 
              isAuthenticated: true, 
              isLoading: false 
            });
            return true;
          }
          
          return false;
        } catch (error) {
          // Token inválido, tentar refresh ou fazer logout
          const refreshSuccessful = await get().refreshToken();
          
          if (!refreshSuccessful) {
            get().logout();
          }
          
          set({ isLoading: false });
          return refreshSuccessful;
        }
      },
      
      refreshToken: async () => {
        try {
          const refreshToken = localStorage.getItem('auth-refresh-token');
          
          if (!refreshToken) {
            return false;
          }
          
          const { data } = await apiClient.post<{access_token: string}>('/auth/refresh', { refreshToken });
          
          if (data.access_token) {
            // Atualizar o token no header
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
            
            set({
              token: data.access_token,
              isAuthenticated: true
            });
            
            return true;
          }
          
          return false;
        } catch (error) {
          return false;
        }
      },

      logout: () => {
        // Remover o cabeçalho de autorização
        delete apiClient.defaults.headers.common['Authorization'];
        
        // Remover refresh token
        localStorage.removeItem('auth-refresh-token');
        
        // Resetar o estado
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'auth-storage', // nome usado para a chave no localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Hook para uso da autenticação
export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error,
    login, 
    register, 
    logout,
    checkSession, 
    refreshToken,
    setError
  } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkSession,
    refreshToken,
    setError
  };
};

// Inicialização do estado de autenticação
if (typeof window !== 'undefined') {
  // Configurar listener para eventos de logout forçado
  window.addEventListener('auth-logout-needed', () => {
    useAuthStore.getState().logout();
  });

  // Verificar se existe token no store e configurar o axios
  const token = useAuthStore.getState().token;
  
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Verificar a validade da sessão atual (assíncrono)
    useAuthStore.getState().checkSession().catch(() => {
      // Falha silenciosa - já tratamos dentro da função checkSession
    });
  } else {
    useAuthStore.setState({ isLoading: false });
  }
}
