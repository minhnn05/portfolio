import api from './api';

export const skillService = {
  // ── Public ──────────────────────────────────────────────────────────────────

  getAll: () =>
    api.get('/skills').then((r) => r.data),

  getGrouped: () =>
    api.get('/skills/grouped').then((r) => r.data),

  // ── Admin ────────────────────────────────────────────────────────────────────

  adminGetById: (id) =>
    api.get(`/skills/admin/${id}`).then((r) => r.data),

  create: (data) =>
    api.post('/skills/admin', data).then((r) => r.data),

  update: (id, data) =>
    api.put(`/skills/admin/${id}`, data).then((r) => r.data),

  delete: (id) =>
    api.delete(`/skills/admin/${id}`),

  updateSortOrder: (order) =>
    api.patch('/skills/admin/sort-order', order),
};
