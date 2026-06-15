import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('access_token') ?? null,
  admin: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('access_token', data.access_token);
      set({ token: data.access_token, isLoading: false });
      return true;
    } catch (err) {
      const msg = err.response?.data?.detail ?? 'Đăng nhập thất bại';
      set({ error: msg, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ token: null, admin: null });
  },

  fetchMe: async () => {
    try {
      const data = await authService.me();
      set({ admin: data });
    } catch {
      set({ token: null, admin: null });
      localStorage.removeItem('access_token');
    }
  },

  isAuthenticated: () => !!localStorage.getItem('access_token'),
}));
