import { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import { useAuthStore } from './store/authStore';

export default function App() {
  const { token, fetchMe } = useAuthStore();

  // Validate stored token against the server on startup.
  // If token is invalid/expired, fetchMe() will clear it automatically.
  useEffect(() => {
    if (token) {
      fetchMe();
    }
  }, []); // run once on mount

  return <AppRouter />;
}
