import axios from 'axios';
import useAuthStore from '../store/authStore';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Add Interceptor to attach both tokens to the request
instance.interceptors.request.use(
  (config) => {
    const { stationToken, employeeToken } = useAuthStore.getState();

    let authHeader = '';
    if (stationToken) {
      authHeader += `Bearer Station ${stationToken}`;
    }
    if (employeeToken) {
      authHeader += ` Bearer Employee ${employeeToken}`;
    }

    if (authHeader) {
      config.headers.Authorization = authHeader.trim();
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
