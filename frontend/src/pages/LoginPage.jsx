import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleMockLogin = () => {
    // In dev mock mode, just log in directly and route to /posts
    login('mock-jwt-token');
    navigate('/posts');
  };

  return (
    <div className="py-20 text-center max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Login</h1>
      <p className="text-gray-600 mb-8">
        (Dev Mode) Click below to simulate login as the mock student defined in AuthContext.
      </p>
      <button 
        onClick={handleMockLogin}
        className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition"
      >
        Simulate Mock Login
      </button>
    </div>
  );
}
