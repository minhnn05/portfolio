import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { skillService } from '../../services/skillService';

const CATEGORIES = ['frontend', 'backend', 'database', 'devops', 'language', 'tool', 'ai_ml', 'other'];
const PROFICIENCY = ['beginner', 'intermediate', 'advanced', 'expert'];

const PROFICIENCY_COLOR = {
  beginner: 'bg-zinc-600 text-zinc-300',
  intermediate: 'bg-blue-500/20 text-blue-300',
  advanced: 'bg-violet-500/20 text-violet-300',
  expert: 'bg-emerald-500/20 text-emerald-300',
};

const EMPTY_FORM = {
  name: '', category: 'frontend', proficiency: 'intermediate',
  proficiency_percent: 50, icon_name: '', color: '',
  sort_order: 0, years_of_experience: '', description: '',
};

const inputCls = 'w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors';

export default function AdminSkills() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const load = () => {
    setIsLoading(true);
    skillService.getGrouped()
      .then(setGroups).catch(console.error).finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const setField = (f) => (e) =>
    setForm((v) => ({ ...v, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const openNew = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(true); };
  const openEdit = (skill) => {
    setForm({ ...skill, years_of_experience: skill.years_of_experience ?? '', color: skill.color ?? '', icon_name: skill.icon_name ?? '' });
    setEditingId(skill.id); setError(''); setShowForm(true);
  };

  const handleDelete = async (skill) => {
    if (!confirm(`Xóa skill "${skill.name}"?`)) return;
    await skillService.delete(skill.id);
    load();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        proficiency_percent: Number(form.proficiency_percent),
        sort_order: Number(form.sort_order),
        years_of_experience: form.years_of_experience !== '' ? Number(form.years_of_experience) : null,
        color: form.color || null,
        icon_name: form.icon_name || null,
      };
      if (editingId) await skillService.update(editingId, payload);
      else await skillService.create(payload);
      setShowForm(false); load();
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Lỗi lưu skill');
    } finally { setSaving(false); }
  };

  const allSkills = groups.flatMap((g) => g.skills);
  const filtered = activeCategory === 'all'
    ? allSkills
    : groups.find((g) => g.category === activeCategory)?.skills ?? [];

  const totalByCategory = Object.fromEntries(groups.map((g) => [g.category, g.skills.length]));

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Skills</h1>
            <p className="text-zinc-400 text-sm mt-0.5">{allSkills.length} skills tổng cộng</p>
          </div>
          <button type="button" onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">
            <Plus size={15} /> Thêm Skill
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === 'all' ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
            All ({allSkills.length})
          </button>
          {CATEGORIES.map((cat) => totalByCategory[cat] != null && (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${activeCategory === cat ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
              {cat} ({totalByCategory[cat]})
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
        ) : (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-zinc-800 bg-zinc-800/50">
                <tr>
                  {['Skill', 'Category', 'Proficiency', '%', 'Order', 'Actions'].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((skill) => (
                  <tr key={skill.id} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {skill.icon_name && (
                          <img src={`https://cdn.simpleicons.org/${skill.icon_name}`} alt={skill.name}
                            className="w-4 h-4" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        )}
                        {skill.color && !skill.icon_name && (
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: skill.color }} />
                        )}
                        <span className="text-sm font-medium text-white">{skill.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-400 capitalize">{skill.category}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${PROFICIENCY_COLOR[skill.proficiency] ?? ''}`}>
                        {skill.proficiency}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 w-24">
                        <div className="flex-1 h-1.5 rounded-full bg-zinc-700 overflow-hidden">
                          <div className="h-full rounded-full bg-violet-500" style={{ width: `${skill.proficiency_percent}%` }} />
                        </div>
                        <span className="text-xs text-zinc-500 w-6 text-right">{skill.proficiency_percent}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-500">{skill.sort_order}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => openEdit(skill)}
                          className="p-1.5 rounded text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors"><Pencil size={14} /></button>
                        <button type="button" onClick={() => handleDelete(skill)}
                          className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && <p className="text-center text-zinc-500 py-12 text-sm">Chưa có skill nào.</p>}
          </div>
        )}

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                <h2 className="text-lg font-semibold text-white">{editingId ? 'Sửa' : 'Thêm'} Skill</h2>
                <button type="button" onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white text-xl leading-none">×</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs text-zinc-400 mb-1">Tên skill *</label>
                    <input value={form.name} onChange={setField('name')} required placeholder="React, Python..." className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Category *</label>
                    <select value={form.category} onChange={setField('category')} className={inputCls}>
                      {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Proficiency</label>
                    <select value={form.proficiency} onChange={setField('proficiency')} className={inputCls}>
                      {PROFICIENCY.map((p) => <option key={p} value={p} className="capitalize">{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Phần trăm (0-100)</label>
                    <input type="number" min={0} max={100} value={form.proficiency_percent} onChange={setField('proficiency_percent')} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Số năm kinh nghiệm</label>
                    <input type="number" min={0} value={form.years_of_experience} onChange={setField('years_of_experience')} placeholder="0" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Icon name (simpleicons)</label>
                    <input value={form.icon_name} onChange={setField('icon_name')} placeholder="react, python, postgresql" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Brand color (hex)</label>
                    <div className="flex gap-2">
                      <input value={form.color} onChange={setField('color')} placeholder="#61DAFB" className={inputCls} />
                      {form.color && /^#[0-9A-Fa-f]{6}$/.test(form.color) && (
                        <div className="w-9 h-9 rounded-lg flex-shrink-0 border border-zinc-700" style={{ backgroundColor: form.color }} />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Sort order</label>
                    <input type="number" min={0} value={form.sort_order} onChange={setField('sort_order')} className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-zinc-400 mb-1">Mô tả ngắn</label>
                    <textarea value={form.description} onChange={setField('description')} rows={2} placeholder="Đã dùng ở đâu, làm gì..." className={`${inputCls} resize-none`} />
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
