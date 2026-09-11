import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

api.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrftoken');
  if (csrfToken && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),
};

export const dashboardService = {
  getMetrics: () => api.get('/dashboard/metrics/'),
  getNotifications: () => api.get('/notifications/'),
  markNotificationRead: (id) => api.patch(`/notifications/${id}/read/`),
  markAllNotificationsRead: () => api.post('/notifications/mark-all-read/'),
};

export const coreService = {
  getSettings: () => api.get('/core/settings/'),
  getStatistics: () => api.get('/core/statistics/'),
  getFaqs: () => api.get('/core/faqs/'),
  getTeam: () => api.get('/core/team/'),
};

export const cmsService = {
  getPage: (slug) => api.get(`/cms/pages/${slug}/`),
};

export const servicesService = {
  getServices: (params) => api.get('/services/', { params }),
  getServiceBySlug: (slug) => api.get(`/services/${slug}/`),
};

export const projectsService = {
  getProjects: (params) => api.get('/projects/', { params }),
  getProjectBySlug: (slug) => api.get(`/projects/${slug}/`),
};

export const leadsService = {
  submitContact: (data) => api.post('/leads/contact/', data),
  submitQuote: (formData) => api.post('/leads/quote/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const blogService = {
  getPosts: (params) => api.get('/blog/posts/', { params }),
  getPostBySlug: (slug) => api.get(`/blog/posts/${slug}/`),
  getCategories: () => api.get('/blog/categories/'),
};

export const testimonialsService = {
  getApproved: () => api.get('/testimonials/'),
};

export const careersService = {
  getJobs: () => api.get('/careers/jobs/'),
  getJobBySlug: (slug) => api.get(`/careers/jobs/${slug}/`),
  submitApplication: (formData) => api.post('/careers/apply/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const assistantService = {
  calculateEstimate: (data) => api.post('/assistant/estimator/calculate/', data),
  chat: (data) => api.post('/assistant/chat/', data),
};

export default api;