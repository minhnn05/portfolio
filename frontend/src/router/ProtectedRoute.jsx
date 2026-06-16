import { useEffect, useRef } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * Bảo vệ admin routes.
 * - Nếu không có token → redirect /admin/login ngay
 * - Nếu có token nhưng chưa verify → verify một lần, show spinner
 * - Sau khi verify xong → render Outlet (hoặc redirect nếu 401)
 */
export default function ProtectedRoute() {
  const token      = useAuthStore((s) => s.token);
  const admin      = useAuthStore((s) => s.admin);
  const isLoading  = useAuthStore((s) => s.isLoading);
  const fetchMe    = useAuthStore((s) => s.fetchMe);
  const verified   = useRef(false);

  useEffect(() => {
    // Chỉ gọi fetchMe một lần khi mount và có token
    if (token && !admin && !verified.current) {
      verified.current = true;
      fetchMe();
    }
  }, [token, admin, fetchMe]);

  // Không có token → về login ngay
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Đang verify lần đầu → spinner
  if (!admin && isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <Outlet />;
}
