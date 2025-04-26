// src/services/api/client.ts
import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: '/api', // This will be proxied to http://localhost:8000/api in development
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error cases (e.g., authentication errors)
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('auth_token');
        // window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

