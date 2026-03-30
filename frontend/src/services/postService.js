import axiosClient from './axiosClient';

const buildQuery = (filters) => {
  return Object.entries(filters)
    .filter(([_, v]) => v !== undefined && v !== '' && v !== null)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
};

export const getPosts = async (filters = {}) => {
  const query = buildQuery(filters);
  const response = await axiosClient.get(`/posts?${query}`);
  return response.data;
};

export const getPostById = async (id) => {
  const response = await axiosClient.get(`/posts/${id}`);
  return response.data;
};

export const getMyPosts = async () => {
  const response = await axiosClient.get('/posts/mine');
  return response.data;
};

export const createPost = async (payload) => {
  const response = await axiosClient.post('/posts', payload);
  return response.data;
};

export const updatePost = async ({ id, ...data }) => {
  const response = await axiosClient.put(`/posts/${id}`, data);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await axiosClient.delete(`/posts/${id}`);
  return response.data;
};

export const updatePostStatus = async ({ id, status }) => {
  const response = await axiosClient.patch(`/posts/${id}/status`, { status });
  return response.data;
};

export const getMatchesForPost = async (postId) => {
  const response = await axiosClient.get(`/posts/${postId}/matches`);
  return response.data;
};
