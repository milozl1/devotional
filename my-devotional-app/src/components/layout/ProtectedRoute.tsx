import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { FullPageLoader } from '../ui/LoadingSpinner';

export function ProtectedRoute() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
}
