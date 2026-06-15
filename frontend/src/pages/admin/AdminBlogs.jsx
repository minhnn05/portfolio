import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import MarkdownEditor from '../../components/admin/MarkdownEditor';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { blogService } from '../../services/blogService';
import { formatDateShort } from '../../utils/formatDate';

const EMPTY_FORM = {
  title: '', excerpt: '', content: '', cover_image_url: '',
  tags: '', category: '', status: 'draft', is_featured: false,
};

export default function AdminBlogs() {
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
    blogService.adminGetAll({ page, page_size: 20 })
      .then(setData).catch(console.error).finally(() => setIsLoading(false));
  };

  useEffect(load, [page]);

  const setField = (f) => (e) => setForm((v) => ({ ...v, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const setContent = (val) => setForm((v) => ({ ...v, content: val }));

  const openNew = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(true); };
  const openEdit = (b) => {
    setForm({ ...b, tags: b.tags?.join(', ') ?? '' });
    setEditingId(b.id); setError(''); setShowForm(true);
  };

  const handleDelete = async (b) => {
    if (!confirm(`Xóa bài "${b.title}"?`)) return;
    await blogService.delete(b.id);
    load();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = { ...form, tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean) };
      if (editingId) await blogService.update(editingId, payload);
      else await blogService.create(payload);
      setShowForm(false); load();
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Lỗi lưu bài viết');
    } finally { setSaving(false); }
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors';

  const STATUS_BADGE = { draft: 'bg-zinc-700 text-zinc-300', published: 'bg-emerald-500/10 text-emerald-400', archived: 'bg-red-500/10 text-red-400' };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <button type="button" onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">
            <Plus size={15} /> Thêm Bài viết
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
        ) : (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-zinc-800 bg-zinc-800/50">
                <tr>
                  {['Title', 'Category', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.items?.map((b) => (
                  <tr key={b.id} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white text-sm line-clamp-1">{b.title}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">/{b.slug}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-400">{b.category ?? '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_BADGE[b.status] ?? ''}`}>{b.status}</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-400">{formatDateShort(b.created_at)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => openEdit(b)}
                          className="p-1.5 rounded text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors"><Pencil size={14} /></button>
                        <button type="button" onClick={() => handleDelete(b)}
                          className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data?.items?.length && <p className="text-center text-zinc-500 py-12 text-sm">Chưa có bài viết nào.</p>}
          </div>
        )}

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
            <div className="w-full max-w-3xl bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
                <h2 className="text-lg font-semibold text-white">{editingId ? 'Sửa' : 'Thêm'} Bài viết</h2>
                <button type="button" onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white text-xl leading-none">×</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Title *</label>
                  <input value={form.title} onChange={setField('title')} required placeholder="Tiêu đề bài viết" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Excerpt *</label>
                  <textarea value={form.excerpt} onChange={setField('excerpt')} required rows={2} placeholder="Tóm tắt ngắn..." className={`${inputCls} resize-none`} />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-2">Content (Markdown) *</label>
                  <MarkdownEditor value={form.content} onChange={setContent} rows={14} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Category</label>
                    <input value={form.category} onChange={setField('category')} placeholder="Tutorial, Deep Dive..." className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Tags (cách nhau bằng dấu phẩy)</label>
                    <input value={form.tags} onChange={setField('tags')} placeholder="react, python, tutorial" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Cover Image URL</label>
                    <input value={form.cover_image_url} onChange={setField('cover_image_url')} placeholder="https://..." className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Status</label>
                    <select value={form.status} onChange={setField('status')} className={inputCls}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={setField('is_featured')} className="rounded" />
                  Featured
                </label>
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
