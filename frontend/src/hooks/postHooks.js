import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as postService from '../services/postService';

export const usePosts = (filters) => {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: () => postService.getPosts(filters),
    staleTime: 1000 * 60 * 2,     // 2 minutes
    placeholderData: (prev) => prev
  });
};

export const usePost = (id) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => postService.getPostById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5      // 5 minutes
  });
};

export const useMyPosts = () => {
  return useQuery({
    queryKey: ['posts', 'mine'],
    queryFn: postService.getMyPosts,
    staleTime: 1000 * 60 * 2
  });
};

export const useCreatePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postService.createPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['posts'] });
    }
  });
};

export const useUpdatePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postService.updatePost,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['posts', variables.id] });
      qc.invalidateQueries({ queryKey: ['posts'] });
    }
  });
};

export const useDeletePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['posts'] });
    }
  });
};
