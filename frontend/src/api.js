// src/api.js — Axios instance with JWT auth
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
API.interceptors.request.use(config => {
  const token = localStorage.getItem('dst_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const msg = err.response?.data?.message || '';
      if (msg.includes('expired') || msg.includes('revoked') || msg.includes('Invalid token')) {
        localStorage.removeItem('dst_token');
        localStorage.removeItem('dst_admin');
        window.dispatchEvent(new Event('dst_logout'));
      }
    }
    return Promise.reject(err);
  }
);

// ── Public ────────────────────────────────────────────────────
export const submitEnquiry = (data) => API.post('/enquiries', data);

// ── Auth ──────────────────────────────────────────────────────
export const login          = (data) => API.post('/auth/login', data);
export const logout         = ()     => API.post('/auth/logout');
export const getMe          = ()     => API.get('/auth/me');
export const updateProfile  = (data) => API.put('/auth/profile', data);
export const changePassword = (data) => API.put('/auth/change-password', data);

// ── Admin Enquiries ───────────────────────────────────────────
export const getEnquiries   = (params) => API.get('/admin/enquiries', { params });
export const getEnquiry     = (id)     => API.get(`/admin/enquiries/${id}`);
export const updateStatus   = (id, status) => API.patch(`/admin/enquiries/${id}/status`, { status });
export const deleteEnquiry  = (id)     => API.delete(`/admin/enquiries/${id}`);
export const getStats       = ()       => API.get('/admin/stats');

// ── Admin Users ───────────────────────────────────────────────
export const getAdminUsers   = ()       => API.get('/admin/users');
export const createAdminUser = (data)   => API.post('/admin/users', data);
export const toggleUser      = (id, is_active) => API.patch(`/admin/users/${id}/status`, { is_active });
export const deleteAdminUser = (id)     => API.delete(`/admin/users/${id}`);

export default API;
