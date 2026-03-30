import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts & Layout
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import PostBrowsePage from './pages/PostBrowsePage';
import PostCreatePage from './pages/PostCreatePage';
import PostDetailPage from './pages/PostDetailPage';
import PostEditPage from './pages/PostEditPage';
import MyPostsPage from './pages/MyPostsPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

// Initialize React Query client with 2-minute stale time
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes
    },
  },
});

// Layout wrapper applied to all routes
function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            {/* All routes are wrapped in AppLayout which includes the Navbar */}
            <Route element={<AppLayout />}>
              
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/posts" replace />} />
              <Route path="/posts" element={<PostBrowsePage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Authenticated Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/posts/new" element={<PostCreatePage />} />
                <Route path="/posts/:id/edit" element={<PostEditPage />} />
                <Route path="/my-posts" element={<MyPostsPage />} />
              </Route>
              
              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />

            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
