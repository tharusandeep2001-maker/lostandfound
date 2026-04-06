import axiosClient from './axiosClient';

export const submitClaim = async (postId, identifyingDetail) => {
  const response = await axiosClient.post('/claims', { postId, identifyingDetail });
  return response.data;
};

export const getMyClaims = async () => {
  const response = await axiosClient.get('/claims/mine');
  return response.data;
};

export const getAllClaims = async (status = '') => {
  const query = status ? `?status=${status}` : '';
  const response = await axiosClient.get(`/claims${query}`);
  return response.data;
};

export const reviewClaim = async (claimId, status, adminNote = '') => {
  const response = await axiosClient.patch(`/claims/${claimId}`, { status, adminNote });
  return response.data;
};

export const withdrawClaim = async (claimId) => {
  const response = await axiosClient.delete(`/claims/${claimId}`);
  return response.data;
};