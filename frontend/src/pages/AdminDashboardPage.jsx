import { Link } from 'react-router-dom';
import {
  Users, FileText, ClipboardList, ShieldCheck,
  MapPin, BarChart2, Megaphone, TrendingUp,
  Activity, ArrowRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CARDS = [
  { title: 'Users', description: 'View, ban, or remove student accounts.', icon: Users, link: '/admin/users', gradient: 'from-blue-500 to-cyan-400' },
  { title: 'Posts', description: 'Manage all lost and found submissions.', icon: FileText, link: '/admin/posts', gradient: 'from-emerald-500 to-teal-400' },
  { title: 'Claims', description: 'Review, approve or reject pending claims.', icon: ClipboardList, link: '/admin/claims', gradient: 'from-violet-500 to-purple-400' },
  { title: 'Announce', description: 'Broadcast messages to all users.', icon: Megaphone, link: '/admin/announcements', gradient: 'from-indigo-500 to-blue-400' },
  { title: 'Heatmap', description: 'Visualise where items are lost most often.', icon: MapPin, link: '/admin/heatmap', gradient: 'from-orange-500 to-amber-400' },
  { title: 'Analytics', description: 'Recovery rates, trends, category insights.', icon: BarChart2, link: '/admin/analytics', gradient: 'from-rose-500 to-pink-400' },
];

const STATS = [
  { label: 'Total Posts', icon: FileText, gradient: 'from-emerald-400 to-teal-300' },
  { label: 'Open Claims', icon: ClipboardList, gradient: 'from-violet-400 to-purple-300' },
  { label: 'Resolved 7d', icon: TrendingUp, gradient: 'from-indigo-400 to-blue-300' },
  { label: 'Active Users', icon: Activity, gradient: 'from-orange-400 to-amber-300' },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* ── Hero header ─────────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden px-8 py-9"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a8a 100%)' }}
      >
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute bottom-0 left-32 w-28 h-28 bg-white/5 rounded-full" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-0.5">Admin Control Panel</p>
            <h1 className="text-2xl font-extrabold text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Good to see you, {user?.name?.split(' ')[0]} 👋
            </h1>
          </div>
        </div>
      </div>

      {/* ── KPI stat row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(({ label, icon: Icon, gradient }) => (
          <div key={label} className="bg-white rounded-2xl p-5 relative overflow-hidden"
            style={{ border: '1px solid #e8edf4', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            {/* Large faded icon watermark */}
            <div className={`absolute -bottom-3 -right-3 w-20 h-20 bg-gradient-to-br ${gradient} rounded-full opacity-10`} />
            <div className={`w-9 h-9 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-3 shadow-sm`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >—</p>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Management cards ──────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">Management</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARDS.map(card => (
            <Link
              key={card.title}
              to={card.link}
              className="group bg-white rounded-2xl p-5 flex items-start gap-4 transition-all"
              style={{ border: '1px solid #e8edf4', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(79,70,229,0.12)'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e8edf4'; }}
            >
              <div className={`w-11 h-11 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{card.description}</p>
                <div className="flex items-center gap-1 mt-3 text-xs font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
