import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
});

// Log every request/response during this debugging phase
api.interceptors.request.use((config) => {
  console.log('[API Request]', config.method?.toUpperCase(), config.url, config.data);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('[API Error]', error.config?.url, error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const repos = {
  add: (repoUrl) => api.post('/api/repos', { repoUrl }),
  list: () => api.get('/api/repos'),
  get: (id) => api.get(`/api/repos/${id}`),
  delete: (id) => api.delete(`/api/repos/${id}`),
};

export const chat = {
  ask: (repoId, question) => api.post(`/api/repos/${repoId}/chat`, { question }),
};

export const health = () => api.get('/api/health');
