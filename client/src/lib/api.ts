import axios from 'axios';

// Mock user ID para desenvolvimento - em produção viria da autenticação
export const MOCK_USER_ID = "cmbe9lk520000w2asjjj1fhxw";

// Criando cliente axios centralizado para usar em todos os serviços
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', // Backend NestJS na porta 3001 com prefixo /api
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
