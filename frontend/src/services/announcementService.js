import axiosClient from './axiosClient';

export const getAnnouncements = async () => {
  const response = await axiosClient.get('/announcements');
  return response.data;
};

export const createAnnouncement = async (data) => {
  const response = await axiosClient.post('/announcements', data);
  return response.data;
};

export const archiveAnnouncement = async (id) => {
  const response = await axiosClient.patch(`/announcements/${id}/archive`);
  return response.data;
};
