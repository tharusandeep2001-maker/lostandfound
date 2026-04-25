import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../services/authService';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/posts';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginUser(form);
      login(data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">

      {/* Split layout: left brand panel + right form */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">

        {/* ── Left: brand panel ───────────────────────────────────────────── */}
        <div className="hidden lg:flex flex-col justify-between p-10 relative"
          style={{ background: 'linear-gradient(155deg, #4f46e5 0%, #6d28d9 55%, #1d4ed8 100%)' }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-10 left-5 w-40 h-40 bg-white/5 rounded-full" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">CampusLostFound</span>
            </div>

            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Reuniting<br />people with<br />their things.
            </h2>
            <p className="text-indigo-200 text-sm leading-relaxed max-w-xs">
              The official campus lost and found platform. Hundreds of items returned every semester.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-3">
            {['Report a lost item in 60 seconds', 'AI-powered matching system', 'Email alerts when a match is found'].map(text => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-indigo-100 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: form panel ────────────────────────────────────────────── */}
        <div className="bg-white flex flex-col justify-center p-8 lg:p-12">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <span className="font-bold text-slate-900">CampusLostFound</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Welcome back
            </h1>
            <p className="text-slate-400 text-sm">Sign in to your campus account</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                required autoComplete="email"
                placeholder="you@university.lk"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-indigo-600 font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password" name="password" value={form.password} onChange={handleChange}
                required autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50 transition"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 text-sm shadow-md shadow-indigo-200"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-7">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
