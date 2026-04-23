import { Link } from 'react-router-dom';
import { MapPin, Tag, Camera, Clock } from 'lucide-react';
import PostStatusBadge from './PostStatusBadge';
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

export default function PostCard({ post }) {
  const { _id, type, status, title, category, zone, incidentDate, imageUrls, matchCount } = post;

  return (
    <Link
      to={`/posts/${_id}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all duration-200"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        {imageUrls && imageUrls.length > 0 ? (
          <img
            src={imageUrls[0]}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="text-slate-300 w-10 h-10" />
          </div>
        )}

        {/* Type badge — overlaid top-left */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-lg shadow-sm capitalize ${
              TYPE_COLORS[type] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {type}
          </span>
        </div>

        {/* Status — overlaid top-right */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-1 py-0.5 shadow-sm">
          <PostStatusBadge status={status} size="sm" />
        </div>

        {/* Match badge */}
        {matchCount > 0 && status === 'matched' && (
          <div className="absolute bottom-3 left-3">
            <span className="text-xs bg-amber-500 text-white px-2.5 py-1 rounded-full font-semibold shadow-sm">
              ⚡ {matchCount} match
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors mb-2">
          {title}
        </h3>

        <div className="mt-auto space-y-1.5">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {category}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {zone}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            {relativeTime(incidentDate)}
          </div>
        </div>
      </div>
    </Link>
  );
}
