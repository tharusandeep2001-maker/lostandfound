// STUBS for Layer 8 — fulfilled in Layer 9

export const usePosts = (filters) => ({ data: { posts: [], total: 0, pages: 1 }, isLoading: false });
export const usePost = (id) => ({ data: null, isLoading: false, isError: false });
export const useMyPosts = () => ({ data: { posts: [] }, isLoading: false });

export const useCreatePost = () => ({ 
  mutateAsync: async () => ({ post: { _id: 'stub_id' }, matchCount: 0 }), 
  isPending: false 
});

export const useUpdatePost = () => ({ 
  mutateAsync: async () => ({}), 
  isPending: false 
});

export const useDeletePost = () => ({ 
  mutateAsync: async () => ({}), 
  isPending: false 
});
