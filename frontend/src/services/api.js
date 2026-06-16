import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  // Auth token
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Disable browser/CDN cache cho tất cả GET requests
  // → đảm bảo public pages luôn nhận data mới nhất từ server
  if (config.method === 'get' || !config.method) {
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma']        = 'no-cache';
  }

  return config;
});

// ── Response interceptor — xử lý 401 tự động logout ─────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
