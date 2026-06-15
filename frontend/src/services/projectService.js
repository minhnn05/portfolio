import api from './api';

// ── Public ────────────────────────────────────────────────────────────────────

export const projectService = {
  /** Danh sách projects published với filter + pagination */
  getAll: (params = {}) =>
    api.get('/projects', { params }).then((r) => r.data),

  /** Featured projects cho Home */
  getFeatured: () =>
    api.get('/projects/featured').then((r) => r.data),

  /** Chi tiết project theo slug */
  getBySlug: (slug) =>
    api.get(`/projects/${slug}`).then((r) => r.data),

  // ── Admin ─────────────────────────────────────────────────────────────────

  /** [Admin] Tất cả projects kể cả unpublished */
  adminGetAll: (params = {}) =>
    api.get('/projects/admin/list', { params }).then((r) => r.data),

  /** [Admin] Chi tiết project theo ID */
  adminGetById: (id) =>
    api.get(`/projects/admin/${id}`).then((r) => r.data),

  /** [Admin] Tạo project mới */
  create: (data) =>
    api.post('/projects/admin', data).then((r) => r.data),

  /** [Admin] Cập nhật project */
  update: (id, data) =>
    api.put(`/projects/admin/${id}`, data).then((r) => r.data),

  /** [Admin] Xóa project */
  delete: (id) =>
    api.delete(`/projects/admin/${id}`),
};
