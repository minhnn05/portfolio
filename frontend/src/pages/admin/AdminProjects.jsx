import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { projectService } from '../../services/projectService';

const STATUS_CLS = {
  completed:   'bg-emerald-500/10 text-emerald-400',
  in_progress: 'bg-amber-500/10 text-amber-400',
  archived:    'bg-zinc-700/60 text-zinc-400',
};

export default function AdminProjects() {
  const [data, setData]         = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [page, setPage]         = useState(1);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    projectService.adminGetAll({ page, page_size: 20 })
      .then(setData).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, [page]);

  const handleDelete = async (p) => {
    if (!confirm(`Xóa project "${p.title}"?`)) return;
    await projectService.delete(p.id);
    load();
  };
  const handleToggle = async (p) => {
    await projectService.update(p.id, { is_published: !p.is_published });
    load();
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="flex-1 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            {data && (
              <p className="text-xs font-mono text-zinc-600 mt-1">{data.total} projects</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/projects/new')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors shadow-md shadow-violet-900/30"
          >
            <Plus size={15} /> Thêm Project
          </button>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
        ) : (
          <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800/70 overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-zinc-800 bg-zinc-800/40">
                <tr>
                  {['Title / Slug', 'Status', 'Tech Stack', 'Visibility', 'Actions'].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.12em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.items?.map((p) => (
                  <tr key={p.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white text-sm">{p.title}</div>
                      <div className="text-[11px] font-mono text-zinc-600 mt-0.5">/{p.slug}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_CLS[p.status] ?? ''}`}>
                        {p.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-500 max-w-[180px] truncate">
                      {p.tech_stack?.slice(0, 4).join(', ')}
                      {p.tech_stack?.length > 4 && <span className="text-zinc-700"> +{p.tech_stack.length - 4}</span>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${p.is_published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-700/60 text-zinc-400'}`}>
                          {p.is_published ? 'Published' : 'Draft'}
                        </span>
                        {p.is_featured && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {/* Xem trang public */}
                        <a
                          href={`/projects/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Xem trang public"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                        >
                          <ExternalLink size={14} />
                        </a>
                        {/* Toggle publish */}
                        <button type="button" onClick={() => handleToggle(p)}
                          title={p.is_published ? 'Ẩn khỏi public' : 'Công khai'}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors">
                          {p.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        {/* Sửa */}
                        <button type="button" onClick={() => navigate(`/admin/projects/${p.id}/edit`)}
                          title="Chỉnh sửa"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors">
                          <Pencil size={14} />
                        </button>
                        {/* Xóa */}
                        <button type="button" onClick={() => handleDelete(p)}
                          title="Xóa"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data?.items?.length && (
              <p className="text-center text-zinc-600 py-16 text-sm">Chưa có project nào.</p>
            )}
          </div>
        )}

        {/* Pagination */}
        {data?.total_pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 rounded-full text-xs bg-zinc-800 text-zinc-300 border border-zinc-700/60 hover:bg-zinc-700 disabled:opacity-40 transition-all">
              Trước
            </button>
            <span className="text-xs text-zinc-500 self-center font-mono">{page} / {data.total_pages}</span>
            <button onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))} disabled={page === data.total_pages}
              className="px-4 py-2 rounded-full text-xs bg-zinc-800 text-zinc-300 border border-zinc-700/60 hover:bg-zinc-700 disabled:opacity-40 transition-all">
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
