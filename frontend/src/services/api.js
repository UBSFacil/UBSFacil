import axios from 'axios';

// URL base do backend - usar variável de ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Criar instância do Axios com configurações padrão
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ AUTH ============
export const authService = {
  login: async (email, senha) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', senha);
    
    const response = await api.post('/auth/login', formData);
    const { access_token } = response.data;
    
    localStorage.setItem('access_token', access_token);
    return response.data;
  },

  me: async () => {
    const response = await api.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};

// ============ MEDICAMENTOS ============
export const medicamentosService = {
  buscarTodos: async () => {
    const response = await api.get('/medicamentos');
    return response.data;
  },

  buscarPorUnidade: async (unidadeId) => {
    const response = await api.get(`/medicamentos/unidade/${unidadeId}`);
    return response.data;
  },

  buscarDisponibilidade: async (medicamentoId) => {
    const response = await api.get(`/medicamentos/${medicamentoId}/disponibilidade`);
    return response.data;
  },

  buscarPorNome: async (nome) => {
    const response = await api.get('/medicamentos/buscar', {
      params: { nome },
    });
    return response.data;
  },
};

// ============ UNIDADES ============
export const unidadesService = {
  buscarTodas: async () => {
    const response = await api.get('/unidades');
    return response.data;
  },

  buscarProximas: async (latitude, longitude, raio = 5) => {
    const response = await api.get('/unidades/proximas', {
      params: { latitude, longitude, raio },
    });
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/unidades/${id}`);
    return response.data;
  },

  buscarPorBairro: async (bairro) => {
    const response = await api.get('/unidades/bairro', {
      params: { bairro },
    });
    return response.data;
  },
};

// ============ ESTOQUE ============
export const estoqueService = {
  buscarEstoque: async (unidadeId) => {
    const response = await api.get(`/estoque/unidade/${unidadeId}`);
    return response.data;
  },

  buscarQuantidade: async (medicamentoId, unidadeId) => {
    const response = await api.get(`/estoque/${medicamentoId}/${unidadeId}`);
    return response.data;
  },
};

// ============ RETIRADAS / HISTÓRICO ============
export const retiradasService = {
  retirar: async (medicamentoId, unidadeId, quantidade = 1) => {
    const response = await api.post('/retiradas', {
      medicamento_id: medicamentoId,
      unidade_id: unidadeId,
      quantidade,
    });
    return response.data;
  },

  historico: async () => {
    const response = await api.get('/paciente/historico');
    return response.data;
  },

  historicoDetalhes: async (retiradaId) => {
    const response = await api.get(`/retiradas/${retiradaId}`);
    return response.data;
  },
};

// ============ EXPORT DEFAULT ============
export default api;
