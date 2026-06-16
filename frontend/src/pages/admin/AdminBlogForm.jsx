import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import MarkdownEditor from '../../components/admin/MarkdownEditor';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { blogService } from '../../services/blogService';
import { slugify } from '../../utils/slugify';

const EMPTY_FORM = {
  title: '', slug: '', excerpt: '', content: '',
  cover_image_url: '', tags: '', category: '',
  status: 'draft', is_featured: false,
  reading_time_minutes: '',
};

const CATEGORIES = ['Tutorial', 'Deep Dive', 'Career', 'Review', 'Opinion'];

const inputCls = [
  'w-full px-3 py-2 rounded-xl bg-zinc-800/60 border border-zinc-700/70 text-white text-sm',
  'placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 hover:border-zinc-600/80',
  'transition-all duration-200',
].join(' ');

function Field({ label, hint, required, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-1.5">
        {label}{required && <span className="text-violet-400 ml-1">*</span>}
        {hint && <span className="text-zinc-600 ml-2 font-normal">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

export default function AdminBlogForm() {
  const { id } = useParams();
  const isEdit  = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm]       = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    blogService.adminGetById(id)
      .then((b) => {
        setForm({
          ...b,
          tags:                b.tags?.join(', ')      ?? '',
          reading_time_minutes: b.reading_time_minutes ?? '',
        });
        setSlugManual(true);
      })
      .catch(() => setError('Không tải được bài viết.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !slugManual) next.slug = slugify(value);
      if (field === 'slug') setSlugManual(true);
      return next;
    });
  };
  const setContent = (val) => setForm((v) => ({ ...v, content: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
        reading_time_minutes: form.reading_time_minutes !== ''
          ? Number(form.reading_time_minutes) : undefined,
      };
      if (isEdit) await blogService.update(id, payload);
      else        await blogService.create(payload);
      navigate('/admin/blogs');
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Lỗi lưu bài viết.');
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Top bar ── */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-8 py-4 bg-zinc-950/95 backdrop-blur border-b border-zinc-800/70">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/blogs')}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <ArrowLeft size={14} /> Blog Posts
            </button>
            <span className="text-zinc-700">|</span>
            <h1 className="text-sm font-semibold text-white">
              {isEdit ? 'Chỉnh sửa Bài viết' : 'Viết Bài viết mới'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Quick status toggle */}
            <select
              value={form.status}
              onChange={set('status')}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-800 border border-zinc-700/70 text-zinc-300 focus:outline-none focus:border-violet-500/60 transition-colors"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <button
              type="submit"
              form="blog-form"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-md shadow-violet-900/30"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </div>

        {/* ── Form body ── */}
        <form
          id="blog-form"
          onSubmit={handleSubmit}
          className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-0 min-h-0"
        >
          {/* LEFT: content */}
          <div className="flex flex-col gap-5 p-8 border-r border-zinc-800/70 overflow-y-auto">

            <Field label="Title" required>
              <input
                value={form.title} onChange={set('title')} required
                placeholder="Tiêu đề bài viết..."
                className={`${inputCls} text-base`}
              />
            </Field>

            <Field label="Slug" hint="(tự tạo từ title)">
              <input
                value={form.slug} onChange={set('slug')}
                placeholder="ten-bai-viet"
                className={inputCls}
              />
            </Field>

            <Field label="Excerpt" required hint="(tóm tắt ngắn hiển thị trên card)">
              <textarea
                value={form.excerpt} onChange={set('excerpt')} required
                rows={2} placeholder="Tóm tắt bài viết..."
                className={`${inputCls} resize-none`}
              />
            </Field>

            {/* Content — chiếm toàn bộ không gian còn lại */}
            <div className="flex flex-col flex-1 gap-1.5">
              <label className="text-xs font-medium text-zinc-400">
                Content <span className="text-violet-400">*</span>
                <span className="text-zinc-600 ml-2 font-normal">(Markdown — dùng Split để xem preview)</span>
              </label>
              <MarkdownEditor
                value={form.content}
                onChange={setContent}
                size="full"
                placeholder={`# Tiêu đề bài viết\n\nViết nội dung Markdown ở đây...\n\n## Mục 1\n\n...\n`}
              />
            </div>

            {error && <p className="text-sm text-red-400 px-1">{error}</p>}
          </div>

          {/* RIGHT: sidebar */}
          <div className="flex flex-col gap-5 p-6 overflow-y-auto bg-zinc-900/30">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
              Post Settings
            </p>

            <Field label="Category">
              <select value={form.category} onChange={set('category')} className={inputCls}>
                <option value="">— Chọn category —</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>

            <Field label="Tags" hint="(cách bằng dấu phẩy)">
              <input
                value={form.tags} onChange={set('tags')}
                placeholder="react, python, tutorial"
                className={inputCls}
              />
            </Field>

            <Field label="Cover Image URL">
              <input
                value={form.cover_image_url} onChange={set('cover_image_url')}
                placeholder="https://..."
                className={inputCls}
              />
              {form.cover_image_url && (
                <img
                  src={form.cover_image_url}
                  alt="cover preview"
                  className="mt-2 w-full aspect-video object-cover rounded-lg border border-zinc-700/50"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}
            </Field>

            <Field label="Reading Time" hint="(phút — để trống để tự tính)">
              <input
                type="number" min={1} value={form.reading_time_minutes}
                onChange={set('reading_time_minutes')}
                placeholder="5"
                className={inputCls}
              />
            </Field>

            <div className="border-t border-zinc-800/70 pt-4 space-y-3">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
                Visibility
              </p>
              {[
                { field: 'is_featured', label: 'Featured', desc: 'Hiển thị trên trang Home' },
              ].map(({ field, label, desc }) => (
                <label key={field} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form[field]}
                    onChange={set(field)}
                    className="mt-0.5 accent-violet-500 w-4 h-4 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm text-zinc-200 group-hover:text-white transition-colors">{label}</p>
                    <p className="text-xs text-zinc-600">{desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Word count */}
            <div className="border-t border-zinc-800/70 pt-4">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-3">
                Stats
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Characters</span>
                  <span className="font-mono text-zinc-400">{form.content?.length ?? 0}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Words (approx.)</span>
                  <span className="font-mono text-zinc-400">
                    {form.content ? form.content.trim().split(/\s+/).filter(Boolean).length : 0}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Read time (est.)</span>
                  <span className="font-mono text-zinc-400">
                    {form.content
                      ? `~${Math.max(1, Math.ceil(form.content.trim().split(/\s+/).filter(Boolean).length / 200))} phút`
                      : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
