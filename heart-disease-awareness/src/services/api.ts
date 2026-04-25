import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
  
  adminLogin: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/admin/login', credentials);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
  
  register: async (userData: { username: string; email: string; password: string; confirmPassword: string }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  forgotPassword: async (data: { email: string }) => {
    try {
      const response = await api.post('/auth/forgot-password', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  resetPassword: async (data: { token: string; newPassword: string; confirmPassword: string }) => {
    try {
      const response = await api.post('/auth/reset-password', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  changePassword: async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    try {
      const response = await api.post('/auth/change-password', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
};

export const assessmentAPI = {
  getQuestions: async () => {
    const response = await api.get('/assessment/questions');
    return response.data;
  },
  calculateRisk: async (responses: { questionId: number; value: string }[]) => {
    const response = await api.post('/assessment/calculate', { responses });
    return response.data;
  },
  saveAssessment: async (assessment: any) => {
    const response = await api.post('/assessment/save', assessment);
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/assessment/history');
    return response.data;
  },
};

export const userAPI = {
  saveLifestyleData: async (data: any) => {
    const response = await api.post('/user/lifestyle', data);
    return response.data;
  },
  getLifestyleData: async (params?: any) => {
    const response = await api.get('/user/lifestyle', { params });
    return response.data;
  },
  getHealthInsights: async () => {
    const response = await api.get('/user/insights');
    return response.data;
  },
};

export const doctorAPI = {
  submitVerification: async (data: any) => {
    const response = await api.post('/doctor/verify', data);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/doctor/profile');
    return response.data;
  },
  createArticle: async (data: any) => {
    const response = await api.post('/doctor/articles', data);
    return response.data;
  },
  updateArticle: async (id: string, data: any) => {
    const response = await api.put(`/doctor/articles/${id}`, data);
    return response.data;
  },
  getArticles: async () => {
    const response = await api.get('/doctor/articles');
    return response.data;
  },
  deleteArticle: async (id: string) => {
    const response = await api.delete(`/doctor/articles/${id}`);
    return response.data;
  },
  getPublishedArticles: async () => {
    const response = await api.get('/doctor/articles/published');
    return response.data;
  },
};

export const adminAPI = {
  getPendingVerifications: async () => {
    const response = await api.get('/admin/doctors/pending');
    return response.data;
  },
  getAllDoctors: async () => {
    const response = await api.get('/admin/doctors/all');
    return response.data;
  },
  approveDoctor: async (doctorId: string) => {
    const response = await api.post(`/admin/doctors/${doctorId}/approve`);
    return response.data;
  },
  rejectDoctor: async (doctorId: string, reason?: string) => {
    const response = await api.post(`/admin/doctors/${doctorId}/reject`, { reason });
    return response.data;
  },
  deleteDoctor: async (doctorId: string) => {
    const response = await api.delete(`/admin/doctors/${doctorId}`);
    return response.data;
  },
};
