import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/** Bảo vệ admin routes — redirect về /admin/login nếu chưa đăng nhập. */
export default function ProtectedRoute() {
  const token = useAuthStore((s) => s.token);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
