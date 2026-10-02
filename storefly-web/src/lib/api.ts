import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1` 
  : 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('storefly_admin_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // If unauthorized on an admin page, clear token
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('storefly_admin_token');
        localStorage.removeItem('storefly_admin_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Public API endpoints
export const publicApi = {
  getHero: () => api.get('/hero').then(r => r.data),
  getAnnouncements: () => api.get('/announcements').then(r => r.data),
  getStatistics: () => api.get('/statistics').then(r => r.data),
  getCategories: () => api.get('/categories').then(r => r.data),
  getServices: (params?: { category_id?: number; search?: string; featured?: boolean }) => 
    api.get('/services', { params }).then(r => r.data),
  getServiceBySlug: (slug: string) => api.get(`/services/${slug}`).then(r => r.data),
  getFeatures: () => api.get('/features').then(r => r.data),
  getHowItWorks: () => api.get('/how-it-works').then(r => r.data),
  getFounder: () => api.get('/founder').then(r => r.data),
  getTestimonials: () => api.get('/testimonials').then(r => r.data),
  getComingSoon: () => api.get('/coming-soon').then(r => r.data),
  getSettings: () => api.get('/settings').then(r => r.data),
  getSocialLinks: () => api.get('/social-links').then(r => r.data),
  createBooking: (data: any) => api.post('/bookings', data).then(r => r.data),
  submitContact: (data: any) => api.post('/contact', data).then(r => r.data),
};

// Admin API endpoints
export const adminApi = {
  // Auth
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials).then(r => r.data),
  getProfile: () => api.get('/auth/profile').then(r => r.data),
  changePassword: (data: { currentPassword: string; newPassword: string }) => 
    api.post('/auth/change-password', data).then(r => r.data),

  // Services
  getServices: () => api.get('/admin/services').then(r => r.data),
  createService: (data: any) => api.post('/admin/services', data).then(r => r.data),
  updateService: (id: number, data: any) => api.put(`/admin/services/${id}`, data).then(r => r.data),
  deleteService: (id: number) => api.delete(`/admin/services/${id}`).then(r => r.data),

  // Categories
  getCategories: () => api.get('/admin/categories').then(r => r.data),
  createCategory: (data: any) => api.post('/admin/categories', data).then(r => r.data),
  updateCategory: (id: number, data: any) => api.put(`/admin/categories/${id}`, data).then(r => r.data),
  deleteCategory: (id: number) => api.delete(`/admin/categories/${id}`).then(r => r.data),

  // Bookings
  getBookings: (params?: { status?: string; page?: number; limit?: number }) => 
    api.get('/admin/bookings', { params }).then(r => r.data),
  getBooking: (id: number) => api.get(`/admin/bookings/${id}`).then(r => r.data),
  updateBookingStatus: (id: number, status: string, notes?: string) => 
    api.put(`/admin/bookings/${id}/status`, { status, notes }).then(r => r.data),
  deleteBooking: (id: number) => api.delete(`/admin/bookings/${id}`).then(r => r.data),

  // Contact Messages
  getMessages: (params?: { status?: string; page?: number; limit?: number }) => 
    api.get('/admin/contact-messages', { params }).then(r => r.data),
  updateMessageStatus: (id: number, status: string) => 
    api.put(`/admin/contact-messages/${id}/status`, { status }).then(r => r.data),
  deleteMessage: (id: number) => api.delete(`/admin/contact-messages/${id}`).then(r => r.data),

  // Content Sections
  getHero: () => api.get('/admin/hero').then(r => r.data),
  updateHero: (data: any) => api.put('/admin/hero', data).then(r => r.data),

  getAnnouncements: () => api.get('/admin/announcements').then(r => r.data),
  createAnnouncement: (data: any) => api.post('/admin/announcements', data).then(r => r.data),
  updateAnnouncement: (id: number, data: any) => api.put(`/admin/announcements/${id}`, data).then(r => r.data),
  deleteAnnouncement: (id: number) => api.delete(`/admin/announcements/${id}`).then(r => r.data),

  getStatistics: () => api.get('/admin/statistics').then(r => r.data),
  updateStatistic: (id: number, data: any) => api.put(`/admin/statistics/${id}`, data).then(r => r.data),
  createStatistic: (data: any) => api.post('/admin/statistics', data).then(r => r.data),
  deleteStatistic: (id: number) => api.delete(`/admin/statistics/${id}`).then(r => r.data),

  getFeatures: () => api.get('/admin/features').then(r => r.data),
  createFeature: (data: any) => api.post('/admin/features', data).then(r => r.data),
  updateFeature: (id: number, data: any) => api.put(`/admin/features/${id}`, data).then(r => r.data),
  deleteFeature: (id: number) => api.delete(`/admin/features/${id}`).then(r => r.data),

  getHowItWorks: () => api.get('/admin/how-it-works').then(r => r.data),
  createHowItWorks: (data: any) => api.post('/admin/how-it-works', data).then(r => r.data),
  updateHowItWorks: (id: number, data: any) => api.put(`/admin/how-it-works/${id}`, data).then(r => r.data),
  deleteHowItWorks: (id: number) => api.delete(`/admin/how-it-works/${id}`).then(r => r.data),

  getFounder: () => api.get('/admin/founder').then(r => r.data),
  updateFounder: (data: any) => api.put('/admin/founder', data).then(r => r.data),

  getTestimonials: () => api.get('/admin/testimonials').then(r => r.data),
  createTestimonial: (data: any) => api.post('/admin/testimonials', data).then(r => r.data),
  updateTestimonial: (id: number, data: any) => api.put(`/admin/testimonials/${id}`, data).then(r => r.data),
  deleteTestimonial: (id: number) => api.delete(`/admin/testimonials/${id}`).then(r => r.data),

  getComingSoon: () => api.get('/admin/coming-soon').then(r => r.data),
  createComingSoon: (data: any) => api.post('/admin/coming-soon', data).then(r => r.data),
  updateComingSoon: (id: number, data: any) => api.put(`/admin/coming-soon/${id}`, data).then(r => r.data),
  deleteComingSoon: (id: number) => api.delete(`/admin/coming-soon/${id}`).then(r => r.data),

  getMedia: () => api.get('/admin/media').then(r => r.data),
  uploadMedia: (formData: FormData) => 
    api.post('/admin/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data),
  deleteMedia: (id: number) => api.delete(`/admin/media/${id}`).then(r => r.data),

  getSettings: () => api.get('/admin/settings').then(r => r.data),
  updateSettings: (data: Record<string, string>) => api.put('/admin/settings', data).then(r => r.data),

  getSocialLinks: () => api.get('/admin/social-links').then(r => r.data),
  updateSocialLinks: (links: any[]) => api.put('/admin/social-links', { links }).then(r => r.data),
};
