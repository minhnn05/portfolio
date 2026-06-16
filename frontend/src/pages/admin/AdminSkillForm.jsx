import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { skillService } from '../../services/skillService';

const CATEGORIES = [
  { value: 'frontend',  label: 'Frontend'  },
  { value: 'backend',   label: 'Backend'   },
  { value: 'database',  label: 'Database'  },
  { value: 'devops',    label: 'DevOps'    },
  { value: 'language',  label: 'Languages' },
  { value: 'tool',      label: 'Tools'     },
  { value: 'ai_ml',     label: 'AI / ML'   },
  { value: 'other',     label: 'Other'     },
];

const PROFICIENCY = [
  { value: 'beginner',     label: 'Beginner',     color: 'bg-zinc-600/60 text-zinc-300'          },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-blue-500/20 text-blue-300'           },
  { value: 'advanced',     label: 'Advanced',     color: 'bg-violet-500/20 text-violet-300'       },
  { value: 'expert',       label: 'Expert',       color: 'bg-emerald-500/20 text-emerald-300'     },
];

const EMPTY_FORM = {
  name: '', category: 'frontend', proficiency: 'intermediate',
  proficiency_percent: 50, icon_name: '', color: '',
  sort_order: 0, years_of_experience: '', description: '',
};

const inputCls = [
  'w-full px-3 py-2 rounded-xl bg-zinc-800/60 border border-zinc-700/70 text-white text-sm',
  'placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 hover:border-zinc-600/80',
  'transition-all duration-200',
].join(' ');

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-1.5">
        {label}
        {hint && <span className="text-zinc-600 ml-2 font-normal">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

export default function AdminSkillForm() {
  const { id }   = useParams();
  const isEdit   = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm]       = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  /* Load khi edit */
  useEffect(() => {
    if (!isEdit) return;
    skillService.adminGetById(id)
      .then((s) => setForm({
        ...s,
        color:               s.color               ?? '',
        icon_name:           s.icon_name           ?? '',
        description:         s.description         ?? '',
        years_of_experience: s.years_of_experience ?? '',
      }))
      .catch(() => setError('Không tải được skill.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (field) => (e) =>
    setForm((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        proficiency_percent:  Number(form.proficiency_percent),
        sort_order:           Number(form.sort_order) || 0,
        years_of_experience:  form.years_of_experience !== '' ? Number(form.years_of_experience) : null,
        color:                form.color    || null,
        icon_name:            form.icon_name || null,
        description:          form.description || null,
      };
      if (isEdit) await skillService.update(id, payload);
      else        await skillService.create(payload);
      navigate('/admin/skills');
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Lỗi lưu skill.');
      setSaving(false);
    }
  };

  /* Icon preview live */
  const iconPreviewUrl = form.icon_name
    ? `https://cdn.simpleicons.org/${form.icon_name.trim().toLowerCase()}`
    : null;

  const colorValid = /^#[0-9A-Fa-f]{6}$/.test(form.color);

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

      <div className="flex-1 flex flex-col">
        {/* ── Top bar ── */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-8 py-4 bg-zinc-950/95 backdrop-blur border-b border-zinc-800/70">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/skills')}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <ArrowLeft size={14} /> Skills
            </button>
            <span className="text-zinc-700">|</span>
            <h1 className="text-sm font-semibold text-white">
              {isEdit ? 'Chỉnh sửa Skill' : 'Thêm Skill mới'}
            </h1>
          </div>
          <button
            type="submit"
            form="skill-form"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-md shadow-violet-900/30"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>

        {/* ── Body ── */}
        <form
          id="skill-form"
          onSubmit={handleSubmit}
          className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-0"
        >
          {/* LEFT: main fields */}
          <div className="flex flex-col gap-6 p-8 border-r border-zinc-800/70">

            {/* Name + preview */}
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Field label="Tên Skill" hint="*">
                  <input
                    value={form.name} onChange={set('name')} required
                    placeholder="React, Python, PostgreSQL..."
                    className={`${inputCls} text-base`}
                  />
                </Field>
              </div>
              {/* Live icon preview */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl border border-zinc-700/60 bg-zinc-800/60 flex items-center justify-center">
                {iconPreviewUrl ? (
                  <img
                    src={iconPreviewUrl}
                    alt="icon preview"
                    className="w-6 h-6"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-sm font-bold text-zinc-600">
                    {form.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <Field label="Category" hint="*">
                <select value={form.category} onChange={set('category')} className={inputCls}>
                  {CATEGORIES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </Field>

              <Field label="Proficiency">
                <select value={form.proficiency} onChange={set('proficiency')} className={inputCls}>
                  {PROFICIENCY.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Proficiency percent — slider + number */}
            <Field label="Phần trăm thành thạo" hint={`${form.proficiency_percent}%`}>
              <div className="space-y-2">
                <input
                  type="range" min={0} max={100} step={5}
                  value={form.proficiency_percent}
                  onChange={set('proficiency_percent')}
                  className="w-full accent-violet-500 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600">
                  <span>0%</span>
                  {/* Progress preview */}
                  <div className="flex-1 mx-4 h-1.5 rounded-full bg-zinc-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all duration-200"
                      style={{ width: `${form.proficiency_percent}%` }}
                    />
                  </div>
                  <span>100%</span>
                </div>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-5">
              <Field label="Số năm kinh nghiệm">
                <input
                  type="number" min={0} max={50}
                  value={form.years_of_experience}
                  onChange={set('years_of_experience')}
                  placeholder="0"
                  className={inputCls}
                />
              </Field>

              <Field label="Sort Order" hint="(số nhỏ → hiển thị trước)">
                <input
                  type="number" min={0}
                  value={form.sort_order}
                  onChange={set('sort_order')}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Mô tả ngắn" hint="(tùy chọn, ≤ 300 ký tự)">
              <textarea
                value={form.description}
                onChange={set('description')}
                rows={3}
                maxLength={300}
                placeholder="Đã dùng ở đâu, làm gì với công nghệ này..."
                className={`${inputCls} resize-none`}
              />
              <p className="mt-1 text-[10px] font-mono text-zinc-700 text-right">
                {form.description?.length ?? 0} / 300
              </p>
            </Field>

            {error && <p className="text-sm text-red-400 px-1">{error}</p>}
          </div>

          {/* RIGHT: icon + color sidebar */}
          <div className="flex flex-col gap-6 p-6 bg-zinc-900/30">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
              Appearance
            </p>

            {/* Icon name */}
            <div>
              <Field label="Icon Name" hint="(simpleicons.org)">
                <input
                  value={form.icon_name}
                  onChange={set('icon_name')}
                  placeholder="react, python, postgresql"
                  className={inputCls}
                />
              </Field>
              <p className="mt-1.5 text-[10px] text-zinc-600 leading-relaxed">
                Tìm tên icon tại{' '}
                <a
                  href="https://simpleicons.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-500 hover:text-violet-400 transition-colors"
                >
                  simpleicons.org
                </a>
                {' '}— dùng slug lowercase, ví dụ: <code className="text-zinc-500 font-mono">fastapi</code>
              </p>

              {/* Icon preview */}
              {form.icon_name && (
                <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
                  <img
                    src={`https://cdn.simpleicons.org/${form.icon_name.trim().toLowerCase()}`}
                    alt="icon"
                    className="w-8 h-8"
                    onError={(e) => {
                      e.currentTarget.replaceWith(
                        Object.assign(document.createElement('span'), {
                          textContent: '❌ Không tìm thấy icon',
                          className: 'text-xs text-red-400',
                        })
                      );
                    }}
                  />
                  <div>
                    <p className="text-xs text-white font-medium">{form.name || 'Skill'}</p>
                    <p className="text-[10px] font-mono text-zinc-600">{form.icon_name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Brand color */}
            <div>
              <Field label="Brand Color" hint="(hex, tùy chọn)">
                <div className="flex gap-2.5 items-center">
                  <input
                    type="color"
                    value={colorValid ? form.color : '#7c3aed'}
                    onChange={(e) => setForm((v) => ({ ...v, color: e.target.value }))}
                    className="w-10 h-10 rounded-lg border border-zinc-700/60 bg-zinc-800/60 cursor-pointer flex-shrink-0 p-0.5"
                  />
                  <input
                    value={form.color}
                    onChange={set('color')}
                    placeholder="#61DAFB"
                    maxLength={7}
                    className={`${inputCls} font-mono`}
                  />
                </div>
              </Field>
              {form.color && !colorValid && (
                <p className="mt-1 text-[11px] text-amber-400">Nhập hex hợp lệ: #RRGGBB</p>
              )}
              {/* Color preview pill */}
              {colorValid && (
                <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: form.color }} />
                  <span className="text-xs text-zinc-400 font-mono">{form.color}</span>
                </div>
              )}
            </div>

            {/* Summary preview card */}
            <div className="border-t border-zinc-800/70 pt-5">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-3">
                Preview
              </p>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div
                  className="w-9 h-9 rounded-lg border border-zinc-700/50 bg-zinc-800/80 flex items-center justify-center flex-shrink-0"
                >
                  {iconPreviewUrl ? (
                    <img
                      src={iconPreviewUrl}
                      alt=""
                      className="w-[18px] h-[18px]"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <span
                      className="text-xs font-bold"
                      style={colorValid ? { color: form.color } : { color: '#71717a' }}
                    >
                      {form.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-zinc-200 truncate">
                      {form.name || 'Skill name'}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-600 ml-2 flex-shrink-0">
                      {form.proficiency_percent}%
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all duration-300"
                      style={{ width: `${form.proficiency_percent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
