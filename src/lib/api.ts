import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add bearer token if available
api.interceptors.request.use(
  (config) => {
    // Only access sessionStorage in the browser safely
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Track if a refresh is currently running to prevent multiple identical refresh calls
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor for handling common errors and auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Catch 401 Unauthorized assuming it represents an expired access token
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      originalRequest.url !== '/auth/login' && 
      originalRequest.url !== '/auth/refresh'
    ) {
      const refreshToken = typeof window !== 'undefined' ? sessionStorage.getItem('refresh_token')?.trim() || null : null;
      
      // If we don't have a refresh token on deck, rip cord and boot to login
      if (!refreshToken) {
         if (typeof window !== 'undefined') {
             sessionStorage.removeItem('access_token');
             sessionStorage.removeItem('refresh_token');
             window.location.href = '/login';
         }
         return Promise.reject(error);
      }

      // If another request already tripped the refresh process, join the waiting queue
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest); // replay original blocked request with the new token
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Fire a naked axios instance to prevent loop recursion with this interceptor
        const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
        const { data } = await axios.post(`${NEXT_PUBLIC_API_URL}/auth/refresh`, {
          refresh_token: refreshToken
        });

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('access_token', data.access_token);
          if (data.refresh_token) {
              sessionStorage.setItem('refresh_token', data.refresh_token);
          }
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

        processQueue(null, data.access_token);
        
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // Refresh token natively died/failed (server revoked it). Perform hard wipe logout.
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
