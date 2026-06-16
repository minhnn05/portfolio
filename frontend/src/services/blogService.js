import api from './api';

export const blogService = {
  // ── Public ──────────────────────────────────────────────────────────────────

  getAll: (params = {}) =>
    api.get('/blogs', { params }).then((r) => r.data),

  getFeatured: () =>
    api.get('/blogs/featured').then((r) => r.data),

  getBySlug: (slug) =>
    api.get(`/blogs/${slug}`).then((r) => r.data),

  getRelated: (slug) =>
    api.get(`/blogs/${slug}/related`).then((r) => r.data),

  like: (slug) =>
    api.post(`/blogs/${slug}/like`).then((r) => r.data),

  // ── Admin ────────────────────────────────────────────────────────────────────

  adminGetAll: (params = {}) =>
    api.get('/blogs/admin/list', { params }).then((r) => r.data),

  adminGetById: (id) =>
    api.get(`/blogs/admin/${id}`).then((r) => r.data),

  create: (data) =>
    api.post('/blogs/admin', data).then((r) => r.data),

  update: (id, data) =>
    api.put(`/blogs/admin/${id}`, data).then((r) => r.data),

  delete: (id) =>
    api.delete(`/blogs/admin/${id}`),
};
