import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { projectService } from '../../services/projectService';

function ProjectRow({ project, onEdit, onDelete, onTogglePublish }) {
  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors">
      <td className="py-3 px-4">
        <div className="font-medium text-white text-sm">{project.title}</div>
        <div className="text-xs text-zinc-500 mt-0.5">/{project.slug}</div>
      </td>
      <td className="py-3 px-4 text-xs text-zinc-400">{project.status}</td>
      <td className="py-3 px-4 text-xs text-zinc-400">{project.tech_stack?.slice(0, 3).join(', ')}</td>
      <td className="py-3 px-4">
        <span className={`text-xs px-2 py-0.5 rounded-full ${project.is_published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-700 text-zinc-400'}`}>
          {project.is_published ? 'Published' : 'Draft'}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onTogglePublish(project)}
            className="p-1.5 rounded text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors" title="Toggle publish">
            {project.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button type="button" onClick={() => onEdit(project)}
            className="p-1.5 rounded text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors">
            <Pencil size={14} />
          </button>
          <button type="button" onClick={() => onDelete(project)}
            className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

const EMPTY_FORM = {
  title: '', summary: '', description: '', tech_stack: '',
  github_url: '', live_url: '', thumbnail_url: '',
  status: 'completed', project_type: 'personal',
  is_featured: false, is_published: true, sort_order: 0,
};

export default function AdminProjects() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setIsLoading(true);
    projectService.adminGetAll({ page, page_size: 20 })
      .then(setData).catch(console.error).finally(() => setIsLoading(false));
  };

  useEffect(load, [page]);

  const setField = (f) => (e) => setForm((v) => ({ ...v, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const openNew = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(true); };
  const openEdit = (p) => {
    setForm({ ...p, tech_stack: p.tech_stack?.join(', ') ?? '' });
    setEditingId(p.id); setError(''); setShowForm(true);
  };

  const handleDelete = async (p) => {
    if (!confirm(`Xóa project "${p.title}"?`)) return;
    await projectService.delete(p.id);
    load();
  };

  const handleTogglePublish = async (p) => {
    await projectService.update(p.id, { is_published: !p.is_published });
    load();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = { ...form, tech_stack: form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean) };
      if (editingId) await projectService.update(editingId, payload);
      else await projectService.create(payload);
      setShowForm(false); load();
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Lỗi lưu project');
    } finally { setSaving(false); }
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors';

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <button type="button" onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">
            <Plus size={15} /> Thêm Project
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
        ) : (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-zinc-800 bg-zinc-800/50">
                <tr>
                  {['Title', 'Status', 'Tech', 'Published', 'Actions'].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.items?.map((p) => (
                  <ProjectRow key={p.id} project={p} onEdit={openEdit} onDelete={handleDelete} onTogglePublish={handleTogglePublish} />
                ))}
              </tbody>
            </table>
            {!data?.items?.length && <p className="text-center text-zinc-500 py-12 text-sm">Chưa có project nào.</p>}
          </div>
        )}

        {/* Pagination */}
        {data?.total_pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 rounded-lg text-sm bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40">Trước</button>
            <span className="text-sm text-zinc-400 self-center">{page} / {data.total_pages}</span>
            <button onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))} disabled={page === data.total_pages}
              className="px-4 py-2 rounded-lg text-sm bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40">Sau</button>
          </div>
        )}

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                <h2 className="text-lg font-semibold text-white">{editingId ? 'Sửa' : 'Thêm'} Project</h2>
                <button type="button" onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white text-xl leading-none">×</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs text-zinc-400 mb-1">Title *</label>
                    <input value={form.title} onChange={setField('title')} required placeholder="Project title" className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-zinc-400 mb-1">Summary *</label>
                    <input value={form.summary} onChange={setField('summary')} required placeholder="Mô tả ngắn (≤500 ký tự)" className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-zinc-400 mb-1">Description (Markdown) *</label>
                    <textarea value={form.description} onChange={setField('description')} required rows={5} className={`${inputCls} resize-none`} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-zinc-400 mb-1">Tech Stack (cách nhau bằng dấu phẩy) *</label>
                    <input value={form.tech_stack} onChange={setField('tech_stack')} required placeholder="React, FastAPI, PostgreSQL" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">GitHub URL</label>
                    <input value={form.github_url} onChange={setField('github_url')} placeholder="https://github.com/..." className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Live URL</label>
                    <input value={form.live_url} onChange={setField('live_url')} placeholder="https://..." className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Thumbnail URL</label>
                    <input value={form.thumbnail_url} onChange={setField('thumbnail_url')} placeholder="https://..." className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Sort Order</label>
                    <input type="number" value={form.sort_order} onChange={setField('sort_order')} min={0} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Status</label>
                    <select value={form.status} onChange={setField('status')} className={inputCls}>
                      <option value="completed">Completed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Type</label>
                    <select value={form.project_type} onChange={setField('project_type')} className={inputCls}>
                      <option value="personal">Personal</option>
                      <option value="team">Team</option>
                      <option value="freelance">Freelance</option>
                      <option value="open_source">Open Source</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4 col-span-2">
                    <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                      <input type="checkbox" checked={form.is_featured} onChange={setField('is_featured')} className="rounded" />
                      Featured
                    </label>
                    <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                      <input type="checkbox" checked={form.is_published} onChange={setField('is_published')} className="rounded" />
                      Published
                    </label>
                  </div>
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded-lg text-sm bg-zinc-800 text-zinc-300 hover:bg-zinc-700">Hủy</button>
                  <button type="submit" disabled={saving}
                    className="px-4 py-2 rounded-lg text-sm bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white">
                    {saving ? 'Đang lưu...' : 'Lưu'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
