import { Link } from 'react-router-dom';
import { MapPin, Tag, Camera } from 'lucide-react';
import PostStatusBadge from './PostStatusBadge';
import { TYPE_COLORS } from '../../utils/constants';

export default function PostCard({ post }) {
  const { _id, type, status, title, category, zone, incidentDate, imageUrls, matchCount } = post;
  
  const formattedDate = new Date(incidentDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <Link 
      to={`/posts/${_id}`} 
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
    >
      <div className="relative h-40">
        {imageUrls && imageUrls.length > 0 ? (
          <img src={imageUrls[0]} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Camera className="text-gray-400 w-8 h-8" />
          </div>
        )}
        
        <div className="absolute top-3 left-3 shadow-sm rounded-md overflow-hidden bg-white/90 backdrop-blur-sm">
          <span className={`px-2 py-1 text-xs font-semibold block capitalize ${TYPE_COLORS[type]}`}>
            {type}
          </span>
        </div>
        
        <div className="absolute top-3 right-3 shadow-sm rounded-full bg-white/90 backdrop-blur-sm p-0.5">
          <PostStatusBadge status={status} size="sm" />
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{title}</h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <div className="flex items-center gap-1">
            <Tag size={14} />
            <span>{category}</span>
          </div>
          <span>&middot;</span>
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{zone}</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
        
        {matchCount > 0 && status === 'matched' && (
          <span className="mt-2 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full inline-block font-medium">
            ⚡ {matchCount} match found
          </span>
        )}
      </div>
    </Link>
  );
}
