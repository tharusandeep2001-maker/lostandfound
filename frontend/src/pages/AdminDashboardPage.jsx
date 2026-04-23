import { Link } from 'react-router-dom';
import {
  Users, FileText, ClipboardList, ShieldCheck,
  MapPin, BarChart2, Megaphone, TrendingUp,
  Activity, Clock,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CARDS = [
  {
    title: 'Manage Users',
    description: 'View all registered students, ban or remove accounts.',
    icon: Users,
    link: '/admin/users',
    accent: 'bg-blue-500',
    hint: 'User accounts',
  },
  {
    title: 'Manage Posts',
    description: 'View all lost and found posts, update their status.',
    icon: FileText,
    link: '/admin/posts',
    accent: 'bg-emerald-500',
    hint: 'All submissions',
  },
  {
    title: 'Manage Claims',
    description: 'Review pending claims, approve or reject with email notification.',
    icon: ClipboardList,
    link: '/admin/claims',
    accent: 'bg-violet-500',
    hint: 'Pending review',
  },
  {
    title: 'Announcements',
    description: 'Broadcast messages to all users via banner and email.',
    icon: Megaphone,
    link: '/admin/announcements',
    accent: 'bg-indigo-500',
    hint: 'Broadcast channel',
  },
  {
    title: 'Campus Heatmap',
    description: 'Tag lost & found posts on floor maps and view density heatmaps.',
    icon: MapPin,
    link: '/admin/heatmap',
    accent: 'bg-orange-500',
    hint: 'Location intelligence',
  },
  {
    title: 'Analytics',
    description: 'Trends, zone hotspots, category recovery rates and engagement.',
    icon: BarChart2,
    link: '/admin/analytics',
    accent: 'bg-rose-500',
    hint: 'Platform insights',
  },
];

// Stat bar items — static labels; in a real app these would come from an API
const STATS = [
  { label: 'Total Posts', value: '—', icon: FileText, color: 'text-emerald-600' },
  { label: 'Open Claims', value: '—', icon: ClipboardList, color: 'text-violet-600' },
  { label: 'Resolved (7d)', value: '—', icon: TrendingUp, color: 'text-indigo-600' },
  { label: 'Active Users', value: '—', icon: Activity, color: 'text-orange-500' },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back, {user?.name}</p>
        </div>
      </div>

      {/* KPI stat bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Management cards grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Management</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARDS.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 ${card.accent} rounded-xl flex items-center justify-center`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
                    {card.title}
                  </h2>
                  <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">{card.description}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">{card.hint}</span>
                <span className="text-xs font-medium text-indigo-500 group-hover:text-indigo-700 transition-colors">
                  Open →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
