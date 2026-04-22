import api from '@/lib/api';

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  mobile: string;
  grade: string;
  password?: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    mobile?: string;
    grade?: string;
    schoolName?: string;
    age?: number;
    avatarUrl?: string;
    bannerUrl?: string;
    totalScore?: number;
    rank?: number;
    attendance?: number;
    percentile?: number;
  };
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    if (typeof window !== 'undefined' && response.data?.access_token) {
      sessionStorage.setItem('access_token', response.data.access_token);
      if (response.data.refresh_token) {
        sessionStorage.setItem('refresh_token', response.data.refresh_token);
      }
    }
    return response.data;
  },

  register: async (data: SignupRequest): Promise<void> => {
    await api.post('/auth/register', data);
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
      }
    }
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: { fullName?: string; avatarUrl?: string; bannerUrl?: string }) => {
    const response = await api.patch('/auth/me', data);
    return response.data;
  },

  verifyEmail: async (data: { email: string; otp: string }) => {
    const response = await api.post('/auth/verify-email', data);
    return response.data;
  },

  resendOtp: async (data: { email: string; type: 'VERIFY_EMAIL' | 'RESET_PASSWORD' }) => {
    const response = await api.post('/auth/resend-otp', data);
    return response.data;
  },

  forgotPassword: async (data: { email: string }) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: { email: string; otp: string; newPassword: string; confirmPassword: string }) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  changePassword: async (data: { currentPassword?: string; newPassword?: string; confirmPassword?: string }) => {
    const response = await api.patch('/auth/change-password', data);
    return response.data;
  }
};
