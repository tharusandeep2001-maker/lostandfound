import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              CampusLostFound
            </Link>
            <div className="hidden sm:flex space-x-6">
              <Link to="/posts" className="text-gray-600 hover:text-indigo-600 font-medium">
                Browse Posts
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/posts/new" className="text-gray-600 hover:text-indigo-600 font-medium">
                    Report Item
                  </Link>
                  <Link to="/my-posts" className="text-gray-600 hover:text-indigo-600 font-medium">
                    My Posts
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
