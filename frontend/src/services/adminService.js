import axiosClient from './axiosClient';

// ─── USERS ───────────────────────────────────────────────
export const getAllUsers = async () => {
  const response = await axiosClient.get('/admin/users');
  return response.data;
};

export const banUser = async (userId) => {
  const response = await axiosClient.patch(`/admin/users/${userId}/ban`);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axiosClient.delete(`/admin/users/${userId}`);
  return response.data;
};

// ─── POSTS ───────────────────────────────────────────────
export const getAllPosts = async () => {
  const [open, matched, resolved] = await Promise.all([
    axiosClient.get('/posts?limit=50&status=open'),
    axiosClient.get('/posts?limit=50&status=matched'),
    axiosClient.get('/posts?limit=50&status=resolved'),
  ]);

  return {
    posts: [
      ...open.data.posts,
      ...matched.data.posts,
      ...resolved.data.posts,
    ]
  };
};

export const updatePostStatus = async (postId, status) => {
  const response = await axiosClient.patch(`/posts/${postId}/status`, { status });
  return response.data;
};