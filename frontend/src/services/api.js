import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const compactParams = (params) => Object.fromEntries(
  Object.entries(params || {}).filter(([, value]) => value !== '' && value !== null && value !== undefined)
);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const taskAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/tasks', { params: compactParams(params) });
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/tasks/stats');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default api;
