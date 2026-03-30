import MatchCard from './MatchCard';
// We anticipate creating the hook in Part 2, standardizing on this path
import { useMatches } from '../../hooks/useMatches';

export default function MatchSuggestionsPanel({ postId }) {
  const { data: matches, isLoading, isError } = useMatches(postId);

  if (isLoading) {
    return (
      <div className="space-y-3 mt-8">
        <div className="h-6 w-56 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="animate-pulse bg-gray-100 rounded-xl h-32 w-full"></div>
        <div className="animate-pulse bg-gray-100 rounded-xl h-32 w-full"></div>
        <div className="animate-pulse bg-gray-100 rounded-xl h-32 w-full"></div>
      </div>
    );
  }

  // Silent fail if fetching matches fails completely
  if (isError) return null;

  if (!matches?.length) {
    return (
      <div className="text-center py-8 text-gray-400 bg-gray-50 border border-gray-100 rounded-xl mt-8">
        <p className="font-medium text-gray-500">No matches found yet.</p>
        <p className="text-sm mt-1">Check back after more items are reported.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Smart Match Suggestions ({matches.length})
      </h3>
      <div className="space-y-3">
        {matches.map(match => (
          <MatchCard key={match.matchedPostId} {...match} postId={postId} />
        ))}
      </div>
    </div>
  );
}
