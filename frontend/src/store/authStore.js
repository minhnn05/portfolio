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
    set({ isLoading: true });
    try {
      const data = await authService.me();
      set({ admin: data, isLoading: false });
    } catch (err) {
      // Chỉ xóa token khi server trả 401 (token hết hạn / invalid)
      // Không xóa khi lỗi network / CORS / 5xx
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        set({ token: null, admin: null, isLoading: false });
        localStorage.removeItem('access_token');
      } else {
        // Lỗi network/khác: giữ token, user vẫn ở lại trang admin
        set({ isLoading: false });
      }
    }
  },

  isAuthenticated: () => !!localStorage.getItem('access_token'),
}));
