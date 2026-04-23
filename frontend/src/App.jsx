import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts & Layout
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';

// Pages
import PostBrowsePage from './pages/PostBrowsePage';
import PostCreatePage from './pages/PostCreatePage';
import PostDetailPage from './pages/PostDetailPage';
import PostEditPage from './pages/PostEditPage';
import MyPostsPage from './pages/MyPostsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminPostsPage from './pages/AdminPostsPage';
import AdminAnnouncementsPage from './pages/AdminAnnouncementsPage';
import NotFoundPage from './pages/NotFoundPage';
import MyClaimsPage from './pages/MyClaimsPage';
import AdminClaimsPage from './pages/AdminClaimsPage';
import AdminHeatmapPage from './pages/AdminHeatmapPage';
import HeatmapPage from './pages/HeatmapPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
              },
            }}
          />
          <Routes>
            <Route element={<AppLayout />}>

              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/posts" replace />} />
              <Route path="/posts" element={<PostBrowsePage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

              {/* Student Authenticated Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/posts/new" element={<PostCreatePage />} />
                <Route path="/posts/:id/edit" element={<PostEditPage />} />
                <Route path="/my-posts" element={<MyPostsPage />} />
                <Route path="/my-claims" element={<MyClaimsPage />} />
                <Route path="/heatmap" element={<HeatmapPage />} />
              </Route>

              {/* Admin Only Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/posts" element={<AdminPostsPage />} />
                <Route path="/admin/claims" element={<AdminClaimsPage />} />
                <Route path="/admin/heatmap" element={<AdminHeatmapPage />} />
                <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
                <Route path="/admin/announcements" element={<AdminAnnouncementsPage />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />

            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
