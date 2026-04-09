import api from './client';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const mealsAPI = {
  getAll: (params) => api.get('/meals', { params }),
  getById: (id) => api.get(`/meals/${id}`),
  create: (data) => api.post('/meals', data),
  update: (id, data) => api.put(`/meals/${id}`, data),
  delete: (id) => api.delete(`/meals/${id}`),
};

export const ordersAPI = {
  getAll: (params) => api.get('/orders', { params }),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export const subscriptionsAPI = {
  getAll: (params) => api.get('/subscriptions', { params }),
  create: (data) => api.post('/subscriptions', data),
  pause: (id) => api.patch(`/subscriptions/${id}/pause`),
  resume: (id) => api.patch(`/subscriptions/${id}/resume`),
  cancel: (id) => api.patch(`/subscriptions/${id}/cancel`),
};

export const businessAPI = {
  get: () => api.get('/business'),
  update: (data) => api.put('/business', data),
  getBySubdomain: (subdomain) => api.get(`/business/subdomain/${subdomain}`),
  getWebsiteConfig: (businessId) => api.get(`/business/${businessId}/website-config`),
  updateWebsiteConfig: (data) => api.put('/business/website-config', data),
  getPublicMeals: (businessId) => api.get(`/business/${businessId}/meals`),
};
