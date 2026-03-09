import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { FullPageLoader } from './components/ui/LoadingSpinner';

const HomePage = lazy(() => import('./pages/HomePage'));
const JournalDaysPage = lazy(() => import('./pages/JournalDaysPage'));
const DayDevotionalPage = lazy(() => import('./pages/DayDevotionalPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const DevotionalForm = lazy(() => import('./pages/admin/DevotionalForm'));

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Suspense fallback={<FullPageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/jurnal/:slug" element={<JournalDaysPage />} />
            <Route path="/jurnal/:slug/ziua/:dayNumber" element={<DayDevotionalPage />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/jurnal/:journalId" element={<AdminDashboard />} />
              <Route path="/admin/devotional/:journalId/:id" element={<DevotionalForm />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>

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
