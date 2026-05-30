import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import Login from '@/pages/Login';
import TeacherDashboard from '@/pages/TeacherDashboard';
import PrincipalDashboard from '@/pages/PrincipalDashboard';
import StudentProfile from '@/pages/StudentProfile';
import Analytics from '@/pages/Analytics';
import NotFound from '@/pages/NotFound';
import AppLayout from '@/components/layout/AppLayout';

function ProtectedRoute({ children, requireRole }: { children: React.ReactNode; requireRole?: string }) {
  const currentUser = useAppStore((s) => s.currentUser);
  if (!currentUser) return <Navigate to="/" replace />;
  if (requireRole && currentUser.role !== requireRole) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  const currentUser = useAppStore((s) => s.currentUser);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={currentUser ? <Navigate to={currentUser.role === 'principal' ? '/principal' : '/teacher'} replace /> : <Login />} />

        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/teacher" element={
            <ProtectedRoute requireRole="teacher"><TeacherDashboard /></ProtectedRoute>
          } />
          <Route path="/principal" element={
            <ProtectedRoute requireRole="principal"><PrincipalDashboard /></ProtectedRoute>
          } />
          <Route path="/student/:studentId" element={
            <ProtectedRoute><StudentProfile /></ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute requireRole="principal"><Analytics /></ProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
