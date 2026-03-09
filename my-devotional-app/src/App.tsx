import { lazy, Suspense } from 'react';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { FullPageLoader } from './components/ui/LoadingSpinner';

const HomePage = lazy(() => import('./pages/HomePage'));
const DayDevotionalPage = lazy(() => import('./pages/DayDevotionalPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const DevotionalForm = lazy(() => import('./pages/admin/DevotionalForm'));
const RouterComponent = import.meta.env.VITE_USE_HASH_ROUTER === 'true' ? HashRouter : BrowserRouter;

export default function App() {
  return (
    <AuthProvider>
      <RouterComponent>
        <Suspense fallback={<FullPageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/ziua/:dayNumber" element={<DayDevotionalPage />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/devotional/:id" element={<DevotionalForm />} />
            </Route>
          </Routes>
        </Suspense>
      </RouterComponent>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#1c1917',
            color: '#fff',
            fontSize: '14px',
          },
        }}
      />
    </AuthProvider>
  );
}
