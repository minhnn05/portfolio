import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import MarkdownEditor from '../../components/admin/MarkdownEditor';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { projectService } from '../../services/projectService';
import { slugify } from '../../utils/slugify';

const EMPTY_FORM = {
  title: '', slug: '', summary: '', description: '',
  tech_stack: '', tags: '',
  github_url: '', live_url: '', thumbnail_url: '', demo_video_url: '',
  status: 'completed', project_type: 'personal',
  is_featured: false, is_published: true,
  sort_order: 0, github_stars: '',
};

const inputCls = [
  'w-full px-3 py-2 rounded-xl bg-zinc-800/60 border border-zinc-700/70 text-white text-sm',
  'placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 hover:border-zinc-600/80',
  'transition-all duration-200',
].join(' ');

function Field({ label, hint, required, error, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-1.5">
        {label}{required && <span className="text-violet-400 ml-1">*</span>}
        {hint && <span className="text-zinc-600 ml-2 font-normal">{hint}</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

export default function AdminProjectForm() {
  const { id } = useParams();           // undefined → create mode
  const isEdit  = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm]       = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [slugManual, setSlugManual] = useState(false);

  /* Load existing project khi edit */
  useEffect(() => {
    if (!isEdit) return;
    projectService.adminGetById(id)
      .then((p) => {
        setForm({
          ...p,
          tech_stack: p.tech_stack?.join(', ') ?? '',
          tags:       p.tags?.join(', ')       ?? '',
          github_stars: p.github_stars ?? '',
        });
        setSlugManual(true); // đừng auto-gen slug khi edit
      })
      .catch(() => setError('Không tải được project.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !slugManual) {
        next.slug = slugify(value);
      }
      if (field === 'slug') setSlugManual(true);
      return next;
    });
  };
  const setContent = (val) => setForm((v) => ({ ...v, description: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        tech_stack: form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
        tags:       form.tags.split(',').map((s) => s.trim()).filter(Boolean),
        sort_order: Number(form.sort_order) || 0,
        github_stars: form.github_stars !== '' ? Number(form.github_stars) : null,
      };
      if (isEdit) await projectService.update(id, payload);
      else        await projectService.create(payload);
      navigate('/admin/projects');
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Lỗi lưu project.');
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
              onClick={() => navigate('/admin/projects')}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <ArrowLeft size={14} /> Projects
            </button>
            <span className="text-zinc-700">|</span>
            <h1 className="text-sm font-semibold text-white">
              {isEdit ? 'Chỉnh sửa Project' : 'Thêm Project mới'}
            </h1>
          </div>
          <button
            type="submit"
            form="project-form"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-md shadow-violet-900/30"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>

        {/* ── Form body ── */}
        <form
          id="project-form"
          onSubmit={handleSubmit}
          className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-0 min-h-0"
        >
          {/* LEFT: main content */}
          <div className="flex flex-col gap-6 p-8 border-r border-zinc-800/70 overflow-y-auto">

            <Field label="Title" required>
              <input
                value={form.title} onChange={set('title')} required
                placeholder="Tên dự án"
                className={inputCls}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Slug" hint="(tự tạo từ title)">
                <input
                  value={form.slug} onChange={set('slug')}
                  placeholder="ten-du-an"
                  className={inputCls}
                />
              </Field>
              <Field label="Sort Order" hint="(số nhỏ → hiển thị trước)">
                <input
                  type="number" min={0} value={form.sort_order} onChange={set('sort_order')}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Summary" required hint="(≤ 500 ký tự — hiển thị trên card)">
              <textarea
                value={form.summary} onChange={set('summary')} required
                rows={3} placeholder="Mô tả ngắn hiển thị trên card..."
                className={`${inputCls} resize-none`}
              />
            </Field>

            {/* Description — chiếm phần lớn không gian */}
            <div className="flex flex-col flex-1 gap-1.5">
              <label className="text-xs font-medium text-zinc-400">
                Description <span className="text-violet-400">*</span>
                <span className="text-zinc-600 ml-2 font-normal">(Markdown)</span>
              </label>
              <MarkdownEditor
                value={form.description}
                onChange={setContent}
                size="full"
                placeholder="Mô tả chi tiết dự án bằng Markdown..."
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 px-1">{error}</p>
            )}
          </div>

          {/* RIGHT: sidebar metadata */}
          <div className="flex flex-col gap-5 p-6 overflow-y-auto bg-zinc-900/30">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
              Metadata
            </p>

            <Field label="Tech Stack" required hint="(cách bằng dấu phẩy)">
              <input
                value={form.tech_stack} onChange={set('tech_stack')} required
                placeholder="React, FastAPI, PostgreSQL"
                className={inputCls}
              />
            </Field>

            <Field label="Tags" hint="(cách bằng dấu phẩy)">
              <input
                value={form.tags} onChange={set('tags')}
                placeholder="ai, fullstack, rag"
                className={inputCls}
              />
            </Field>

            <Field label="Status">
              <select value={form.status} onChange={set('status')} className={inputCls}>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="archived">Archived</option>
              </select>
            </Field>

            <Field label="Project Type">
              <select value={form.project_type} onChange={set('project_type')} className={inputCls}>
                <option value="personal">Personal</option>
                <option value="team">Team</option>
                <option value="freelance">Freelance</option>
                <option value="open_source">Open Source</option>
              </select>
            </Field>

            <div className="border-t border-zinc-800/70 pt-4 space-y-4">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
                Links
              </p>
              <Field label="GitHub URL">
                <input value={form.github_url} onChange={set('github_url')} placeholder="https://github.com/..." className={inputCls} />
              </Field>
              <Field label="Live URL">
                <input value={form.live_url} onChange={set('live_url')} placeholder="https://..." className={inputCls} />
              </Field>
              <Field label="Thumbnail URL">
                <input value={form.thumbnail_url} onChange={set('thumbnail_url')} placeholder="https://..." className={inputCls} />
              </Field>
              <Field label="Demo Video URL">
                <input value={form.demo_video_url} onChange={set('demo_video_url')} placeholder="https://youtube.com/..." className={inputCls} />
              </Field>
              <Field label="GitHub Stars">
                <input type="number" min={0} value={form.github_stars} onChange={set('github_stars')} placeholder="0" className={inputCls} />
              </Field>
            </div>

            <div className="border-t border-zinc-800/70 pt-4 space-y-3">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
                Visibility
              </p>
              {[
                { field: 'is_featured',  label: 'Featured', desc: 'Hiển thị trên trang Home' },
                { field: 'is_published', label: 'Published', desc: 'Công khai với người dùng' },
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
          </div>
        </form>
      </div>
    </div>
  );
}
