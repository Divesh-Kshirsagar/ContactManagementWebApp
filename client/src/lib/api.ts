import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data as any;
      const errorMessage = errorData?.message || 'An error occurred';
      const validationErrors = errorData?.errors || [];
      
      console.error('API Error:', errorMessage);
      if (validationErrors.length > 0) {
        console.error('Validation Errors:', validationErrors);
      }
      console.error('Request URL:', error.config?.url);
      console.error('Request Params:', error.config?.params);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error: No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
