// src/api/api.js

import axios from 'axios';

// Cria uma instância do axios com configurações base
const api = axios.create({
  baseURL: 'https://restaurantefront.onrender.com',
});

// A MÁGICA DO INTERCEPTOR
// Isso adiciona um "guarda" que intercepta TODA requisição antes dela ser enviada.
api.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem('token');
    // Se o token existir, adiciona o cabeçalho de autenticação
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

