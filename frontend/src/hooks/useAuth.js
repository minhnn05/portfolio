import { useAuthStore } from '../store/authStore';

/** Convenience hook — expose auth state và actions. */
export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const admin = useAuthStore((s) => s.admin);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const fetchMe = useAuthStore((s) => s.fetchMe);

  return {
    token,
    admin,
    isLoading,
    error,
    isAuthenticated: !!token,
    login,
    logout,
    fetchMe,
  };
}
