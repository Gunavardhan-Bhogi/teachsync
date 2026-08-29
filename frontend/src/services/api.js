import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Class endpoints
export const getClasses = async () => {
  const response = await api.get('/classes');
  return response.data;
};

export const createClass = async (classData) => {
  const response = await api.post('/classes', classData);
  return response.data;
};

// Lecture endpoints
export const generateDraft = async (formData) => {
  const response = await api.post('/lectures/generate-draft', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const dispatchLecture = async (dispatchData) => {
  const response = await api.post('/lectures/dispatch', dispatchData);
  return response.data;
};

export default api;
