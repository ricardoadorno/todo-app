import axios from 'axios';

// Criando cliente axios centralizado para usar em todos os serviços
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', // Backend NestJS na porta 3001 com prefixo /api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação a todas as requisições
apiClient.interceptors.request.use(
  (config) => {
    // Verificar se temos um token na localStorage
    const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    const token = authStorage?.state?.token;
    
    // Adicionar o token ao header se existir
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Função auxiliar para limpar dados de autenticação e redirecionar
const handleAuthFailure = () => {
  // Limpar dados de autenticação
  localStorage.removeItem('auth-storage');
  localStorage.removeItem('auth-refresh-token');
  
  // Disparar evento para componentes ouvirem
  window.dispatchEvent(new Event('auth-logout-needed'));
  
  // Redirecionar para login se não estivermos já lá
  if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
};

// Função auxiliar para verificar se o usuário está autenticado
const isAuthenticated = () => {
  const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
  return authStorage?.state?.token && authStorage?.state?.user;
};

// Interceptor para tratamento de erros global
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Log do erro para debugging
    console.log('API Error:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      code: error.code,
      message: error.message
    });
    
    // Verificar se é erro de conexão (servidor não está rodando)
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response) {
      console.error('Erro de conexão com o servidor:', error.message);
      
      // Se o usuário não estiver autenticado, redirecionar para login
      if (!isAuthenticated()) {
        handleAuthFailure();
        return Promise.reject(new Error('Servidor indisponível. Redirecionando para login...'));
      }
      
      // Se estiver autenticado, mostrar erro de conexão
      return Promise.reject(new Error('Erro de conexão com o servidor. Verifique se o servidor está rodando na porta 3001.'));
    }
    
    // Lidar com erros de autenticação (401, 403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Se não for uma tentativa de refresh e não for uma rota de auth
      if (!originalRequest._retry && !originalRequest.url.includes('/auth/')) {
        // Verificar se temos um refreshToken disponível
        const refreshToken = localStorage.getItem('auth-refresh-token');
        
        if (refreshToken && error.response?.status === 401) {
          try {
            originalRequest._retry = true;
            
            // Tentar renovar o token
            const response = await apiClient.post('/auth/refresh', {
              refreshToken
            });
            
            const { access_token } = response.data;
            
            // Atualizar o token no localStorage
            const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
            if (authStorage.state) {
              authStorage.state.token = access_token;
              localStorage.setItem('auth-storage', JSON.stringify(authStorage));
            }
            
            // Atualizar o token no cabeçalho das requisições
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            
            // Refazer a requisição original com o novo token
            originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
            return apiClient(originalRequest);
          } catch (refreshError) {
            console.error('Erro ao renovar token:', refreshError);
            handleAuthFailure();
            return Promise.reject(new Error('Sessão expirada. Redirecionando para login...'));
          }
        } else {
          // Não temos refresh token ou erro 403 - redirecionar para login
          console.warn('Usuário não autenticado ou sem permissão:', error.response?.status);
          handleAuthFailure();
          return Promise.reject(new Error('Acesso não autorizado. Redirecionando para login...'));
        }
      }
    }
    
    // Para outros erros, verificar se o usuário está autenticado
    if (error.response?.status >= 500) {
      return Promise.reject(new Error('Erro interno do servidor. Tente novamente mais tarde.'));
    }
    
    // Se chegou até aqui e o usuário não está autenticado, redirecionar
    if (!isAuthenticated() && !originalRequest.url.includes('/auth/')) {
      handleAuthFailure();
      return Promise.reject(new Error('Usuário não autenticado. Redirecionando para login...'));
    }
    
    return Promise.reject(error);
  }
);

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export default apiClient;
