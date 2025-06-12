import apiClient from './apiClient';

export async function fetchVideos(page, limit) {
  try {
    const response = await apiClient.get('/videos', {
      params: {
        page,
        limit
      }
    });
    return response.data; // Assuming the response contains { videos, totalCount }
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
}

export async function addVideo(videoData) {
  try {
    const response = await apiClient.post('/videos', videoData);
    return response.data;
  } catch (error) {
    console.error('Error adding video:', error);
    throw error;
  }
}