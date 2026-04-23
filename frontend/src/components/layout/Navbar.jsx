import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, ShieldCheck, MapIcon, BarChart2, FileText, Users, ClipboardList, Megaphone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const location = useLocation();

  const isAdmin = user?.role === 'admin';

  // Close drawer on route change
  useEffect(() => setDrawerOpen(false), [location.pathname]);

  // Close on outside click
  useEffect(() => {
    if (!drawerOpen) return;
    function handle(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) setDrawerOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [drawerOpen]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const linkCls = (path) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-indigo-100 text-indigo-700'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const mobileLinkCls = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
      isActive(path)
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-slate-700 hover:bg-slate-50'
    }`;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link to="/" className="text-lg font-bold text-indigo-600 tracking-tight">
                CampusLostFound
              </Link>

              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-1">
                <Link to="/posts" className={linkCls('/posts')}>Browse</Link>
                {isAuthenticated && !isAdmin && (
                  <>
                    <Link to="/posts/new" className={linkCls('/posts/new')}>Report</Link>
                    <Link to="/my-posts" className={linkCls('/my-posts')}>My Posts</Link>
                    <Link to="/my-claims" className={linkCls('/my-claims')}>My Claims</Link>
                    <Link to="/heatmap" className={linkCls('/heatmap')}>Heatmap</Link>
                  </>
                )}
                {isAdmin && (
                  <>
                    <Link to="/admin" className={linkCls('/admin')}>Dashboard</Link>
                    <Link to="/admin/heatmap" className={linkCls('/admin/heatmap')}>Heatmap</Link>
                    <Link to="/admin/analytics" className={linkCls('/admin/analytics')}>Analytics</Link>
                    <Link to="/admin/announcements" className={linkCls('/admin/announcements')}>Announce</Link>
                  </>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Notification bell — placeholder, ready for future hook */}
                  <button
                    className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
                    <span className="text-sm text-slate-500">
                      {user.name?.split(' ')[0]}
                      {isAdmin && (
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 inline ml-1" />
                      )}
                    </span>
                    <button
                      onClick={logout}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-1.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer panel — slides in from right */}
          <div
            ref={drawerRef}
            className="absolute top-0 right-0 h-full w-72 bg-white shadow-2xl flex flex-col"
            style={{ animation: 'slideInRight 0.22s cubic-bezier(0.22,1,0.36,1)' }}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <span className="font-bold text-indigo-600">Menu</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              <Link to="/posts" className={mobileLinkCls('/posts')}>
                <FileText className="w-5 h-5 text-slate-400" /> Browse Posts
              </Link>

              {isAuthenticated && !isAdmin && (
                <>
                  <Link to="/posts/new" className={mobileLinkCls('/posts/new')}>
                    <FileText className="w-5 h-5 text-slate-400" /> Report Item
                  </Link>
                  <Link to="/my-posts" className={mobileLinkCls('/my-posts')}>
                    <FileText className="w-5 h-5 text-slate-400" /> My Posts
                  </Link>
                  <Link to="/my-claims" className={mobileLinkCls('/my-claims')}>
                    <ClipboardList className="w-5 h-5 text-slate-400" /> My Claims
                  </Link>
                  <Link to="/heatmap" className={mobileLinkCls('/heatmap')}>
                    <MapIcon className="w-5 h-5 text-slate-400" /> Heatmap
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link to="/admin" className={mobileLinkCls('/admin')}>
                    <ShieldCheck className="w-5 h-5 text-indigo-400" /> Admin Panel
                  </Link>
                  <Link to="/admin/users" className={mobileLinkCls('/admin/users')}>
                    <Users className="w-5 h-5 text-slate-400" /> Users
                  </Link>
                  <Link to="/admin/posts" className={mobileLinkCls('/admin/posts')}>
                    <FileText className="w-5 h-5 text-slate-400" /> Posts
                  </Link>
                  <Link to="/admin/claims" className={mobileLinkCls('/admin/claims')}>
                    <ClipboardList className="w-5 h-5 text-slate-400" /> Claims
                  </Link>
                  <Link to="/admin/heatmap" className={mobileLinkCls('/admin/heatmap')}>
                    <MapIcon className="w-5 h-5 text-orange-400" /> Heatmap
                  </Link>
                  <Link to="/admin/analytics" className={mobileLinkCls('/admin/analytics')}>
                    <BarChart2 className="w-5 h-5 text-rose-400" /> Analytics
                  </Link>
                  <Link to="/admin/announcements" className={mobileLinkCls('/admin/announcements')}>
                    <Megaphone className="w-5 h-5 text-indigo-400" /> Announcements
                  </Link>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-100">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold text-sm">
                      {user.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block w-full text-center px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
