import api from './api';

export const messageService = {
  // ── Public ──────────────────────────────────────────────────────────────────

  /** Gửi contact form */
  send: (data) =>
    api.post('/messages', data).then((r) => r.data),

  // ── Admin ────────────────────────────────────────────────────────────────────

  adminGetAll: (params = {}) =>
    api.get('/messages/admin', { params }).then((r) => r.data),

  adminGetById: (id) =>
    api.get(`/messages/admin/${id}`).then((r) => r.data),

  updateStatus: (id, status) =>
    api.patch(`/messages/admin/${id}/status`, { status }).then((r) => r.data),

  toggleStar: (id, is_starred) =>
    api.patch(`/messages/admin/${id}/star`, { is_starred }).then((r) => r.data),

  saveReply: (id, reply_note) =>
    api.patch(`/messages/admin/${id}/reply`, { reply_note }).then((r) => r.data),

  delete: (id) =>
    api.delete(`/messages/admin/${id}`),
};
