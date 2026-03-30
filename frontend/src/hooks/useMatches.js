import { useQuery } from '@tanstack/react-query';
import * as postService from '../services/postService';

export const useMatches = (postId) => {
  return useQuery({
    queryKey: ['matches', postId],
    queryFn: () => postService.getMatchesForPost(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 30, // 30 minutes, mirrors backend TTL
    select: (data) => data.matches
  });
};

export default useMatches;
