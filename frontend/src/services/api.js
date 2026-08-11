import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
});

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
