import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { skillService } from '../../services/skillService';

const CATEGORIES = ['frontend', 'backend', 'database', 'devops', 'language', 'tool', 'ai_ml', 'other'];

const PROFICIENCY_CLS = {
  beginner:     'bg-zinc-600/60 text-zinc-300',
  intermediate: 'bg-blue-500/20 text-blue-300',
  advanced:     'bg-violet-500/20 text-violet-300',
  expert:       'bg-emerald-500/20 text-emerald-300',
};

const CATEGORY_LABEL = {
  frontend: 'Frontend', backend: 'Backend', database: 'Database',
  devops: 'DevOps', language: 'Languages', tool: 'Tools', ai_ml: 'AI / ML', other: 'Other',
};

export default function AdminSkills() {
  const [groups, setGroups]               = useState([]);
  const [isLoading, setLoading]           = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    skillService.getGrouped()
      .then(setGroups).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (skill) => {
    if (!confirm(`Xóa skill "${skill.name}"?`)) return;
    await skillService.delete(skill.id);
    load();
  };

  const allSkills = groups.flatMap((g) => g.skills ?? []);
  const filtered  = activeCategory === 'all'
    ? allSkills
    : (groups.find((g) => g.category === activeCategory)?.skills ?? []);

  const countByCategory = Object.fromEntries(
    groups.map((g) => [g.category, (g.skills ?? []).length])
  );

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="flex-1 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Skills</h1>
            <p className="text-xs font-mono text-zinc-600 mt-1">
              {allSkills.length} skills — {groups.length} categories
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/skills/new')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors shadow-md shadow-violet-900/30"
          >
            <Plus size={15} /> Thêm Skill
          </button>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === 'all' ? 'bg-violet-600 text-white shadow-sm shadow-violet-900/40' : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 hover:border-zinc-600 hover:text-zinc-200'}`}
          >
            All ({allSkills.length})
          </button>
          {CATEGORIES.filter((c) => countByCategory[c] != null).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === cat ? 'bg-violet-600 text-white shadow-sm shadow-violet-900/40' : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 hover:border-zinc-600 hover:text-zinc-200'}`}
            >
              {CATEGORY_LABEL[cat] ?? cat} ({countByCategory[cat]})
            </button>
          ))}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
        ) : (
          <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800/70 overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-zinc-800 bg-zinc-800/40">
                <tr>
                  {['Skill', 'Category', 'Proficiency', 'Progress', 'Exp', 'Order', 'Actions'].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.12em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((skill) => (
                  <tr key={skill.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors">
                    {/* Skill name + icon */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center flex-shrink-0">
                          {skill.icon_name ? (
                            <img
                              src={`https://cdn.simpleicons.org/${skill.icon_name}`}
                              alt={skill.name}
                              className="w-[14px] h-[14px]"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : (
                            <span
                              className="text-[10px] font-bold text-zinc-500"
                              style={skill.color ? { color: skill.color } : undefined}
                            >
                              {skill.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium text-white">{skill.name}</span>
                        {skill.color && (
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: skill.color }} />
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50 capitalize">
                        {CATEGORY_LABEL[skill.category] ?? skill.category}
                      </span>
                    </td>

                    {/* Proficiency badge */}
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${PROFICIENCY_CLS[skill.proficiency] ?? ''}`}>
                        {skill.proficiency}
                      </span>
                    </td>

                    {/* Progress bar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <div className="flex-1 h-1 rounded-full bg-zinc-800 overflow-hidden">
                          <div className="h-full rounded-full bg-violet-500" style={{ width: `${skill.proficiency_percent}%` }} />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-600 w-7 text-right flex-shrink-0">
                          {skill.proficiency_percent}%
                        </span>
                      </div>
                    </td>

                    {/* Years */}
                    <td className="py-3 px-4 text-[11px] font-mono text-zinc-600">
                      {skill.years_of_experience != null ? `${skill.years_of_experience}y` : '—'}
                    </td>

                    {/* Sort order */}
                    <td className="py-3 px-4 text-[11px] font-mono text-zinc-600">
                      {skill.sort_order}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/skills/${skill.id}/edit`)}
                          title="Chỉnh sửa"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(skill)}
                          title="Xóa"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && (
              <p className="text-center text-zinc-600 py-16 text-sm">Chưa có skill nào.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
