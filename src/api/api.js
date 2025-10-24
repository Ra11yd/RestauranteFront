import axios from 'axios';

// 1. Lê a URL da API a partir das variáveis de ambiente.
//    Em produção (Render), ele usará a VITE_API_BASE_URL (https://.../api)
//    Em desenvolvimento (local), ele usará o 'http://localhost:3333/api'
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333/api';

const api = axios.create({
  baseURL: API_URL
});

// 2. Interceptor para adicionar o token de admin/funcionário em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Token do admin/funcionário
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
