import { Link } from 'react-router-dom';
import { MapPin, Tag, Camera } from 'lucide-react';

export default function MatchCard({ postId, matchedPostId, score, breakdown, matchedPostSnapshot }) {
  const scoreColor = score >= 80 ? 'bg-green-500' : score >= 70 ? 'bg-amber-500' : 'bg-red-500';

  const formattedDate = new Date(matchedPostSnapshot.incidentDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-start hover:border-blue-300 transition relative">
      <div className={`w-16 h-16 rounded-full flex gap-1 items-center justify-center text-white font-bold text-lg flex-shrink-0 ${scoreColor}`}>
        {score}%
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex gap-4">
          <div className="w-20 h-20 flex-shrink-0">
            {matchedPostSnapshot.imageUrls && matchedPostSnapshot.imageUrls.length > 0 ? (
              <img src={matchedPostSnapshot.imageUrls[0]} alt="thumbnail" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <Camera className="text-gray-400 w-6 h-6" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">{matchedPostSnapshot.title}</h4>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Tag size={14} /> <span>{matchedPostSnapshot.category}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={14} /> <span>{matchedPostSnapshot.zone}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>

            <details className="mt-2 group">
              <summary className="text-xs text-blue-600 cursor-pointer font-medium hover:underline inline-block select-none">
                View score breakdown
              </summary>
              <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                <p>Category: {breakdown.categoryScore}/40</p>
                <p>Zone: {breakdown.zoneScore}/35</p>
                <p>Date: {breakdown.dateScore}/25</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      <div className="self-end ml-auto mt-4 sm:absolute sm:bottom-4 sm:right-4 sm:mt-0">
        <button 
          onClick={(e) => {
            e.preventDefault();
            import('react-hot-toast').then(toast => toast.default('Claims Module is currently under active development. Keep an eye out for our upcoming Week 11 integration update!', { icon: '🚧' }));
          }}
          className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition inline-block whitespace-nowrap"
        >
          Submit Claim →
        </button>
      </div>
    </div>
  );
}
