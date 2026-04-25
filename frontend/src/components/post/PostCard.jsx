import { Link } from 'react-router-dom';
import { MapPin, Tag, Clock, Camera } from 'lucide-react';
import { TYPE_COLORS } from '../../utils/constants';

function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const STATUS_DOT = {
  open:     { color: '#22c55e', label: 'Open' },
  matched:  { color: '#f59e0b', label: 'Matched' },
  claimed:  { color: '#6366f1', label: 'Claimed' },
  resolved: { color: '#059669', label: 'Resolved' },
};

const TYPE_GRADIENT = {
  lost:  'from-rose-500 to-orange-400',
  found: 'from-emerald-500 to-teal-400',
};

export default function PostCard({ post }) {
  const { _id, type, status, title, category, zone, incidentDate, imageUrls, matchCount } = post;
  const dot = STATUS_DOT[status] || STATUS_DOT.open;
  const hasImage = imageUrls && imageUrls.length > 0;

  return (
    <Link
      to={`/posts/${_id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        border: '1px solid #e8edf4',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 2px 12px rgba(79,70,229,0.04)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(79,70,229,0.13), 0 2px 8px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 2px 12px rgba(79,70,229,0.04)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Image area */}
      <div className="relative h-44 overflow-hidden"
        style={{ background: hasImage ? '#f1f5f9' : 'linear-gradient(135deg, #f1f5f9 0%, #e8edf4 100%)' }}
      >
        {hasImage ? (
          <img
            src={imageUrls[0]}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            {/* Coloured ring placeholder */}
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${TYPE_GRADIENT[type] || 'from-slate-300 to-slate-400'} flex items-center justify-center shadow-md`}>
              <Camera className="w-7 h-7 text-white opacity-90" />
            </div>
            <span className="text-xs text-slate-400 font-medium">{category}</span>
          </div>
        )}

        {/* Type pill — top left */}
        <div className="absolute top-3 left-3">
          <span className={`
            px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm backdrop-blur-sm
            ${type === 'lost'
              ? 'bg-rose-500/90 text-white'
              : 'bg-emerald-500/90 text-white'}
          `}>
            {type}
          </span>
        </div>

        {/* Status dot — top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot.color }} />
          <span className="text-xs font-medium text-slate-700">{dot.label}</span>
        </div>

        {/* Match flash badge */}
        {matchCount > 0 && status === 'matched' && (
          <div className="absolute bottom-3 left-3">
            <span className="text-xs bg-amber-400 text-amber-900 font-bold px-2.5 py-1 rounded-full shadow-sm">
              ⚡ Match found
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {title}
        </h3>

        <div className="mt-auto space-y-2">
          {/* Meta row */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Tag className="w-3 h-3 text-slate-400 flex-shrink-0" />
              {category}
            </span>
            <span className="w-0.5 h-3 bg-slate-200 rounded-full" />
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
              {zone}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {relativeTime(incidentDate)}
            </span>
            <span className="text-xs font-semibold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
