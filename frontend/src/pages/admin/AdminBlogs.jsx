import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { blogService } from '../../services/blogService';
import { formatDateShort } from '../../utils/formatDate';

const STATUS_CLS = {
  draft:     'bg-zinc-700/60 text-zinc-300',
  published: 'bg-emerald-500/10 text-emerald-400',
  archived:  'bg-red-500/10 text-red-400',
};

export default function AdminBlogs() {
  const [data, setData]         = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [page, setPage]         = useState(1);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    blogService.adminGetAll({ page, page_size: 20 })
      .then(setData).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, [page]);

  const handleDelete = async (b) => {
    if (!confirm(`Xóa bài "${b.title}"?`)) return;
    await blogService.delete(b.id);
    load();
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="flex-1 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
            {data && (
              <p className="text-xs font-mono text-zinc-600 mt-1">{data.total} bài viết</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/blogs/new')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors shadow-md shadow-violet-900/30"
          >
            <Plus size={15} /> Viết bài mới
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
                  {['Title / Slug', 'Category', 'Tags', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.12em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.items?.map((b) => (
                  <tr key={b.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="font-medium text-white text-sm truncate">{b.title}</div>
                      <div className="text-[11px] font-mono text-zinc-600 mt-0.5 truncate">/{b.slug}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-500">{b.category ?? '—'}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {b.tags?.slice(0, 2).map((t) => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-500 border border-zinc-700/50">
                            #{t}
                          </span>
                        ))}
                        {b.tags?.length > 2 && (
                          <span className="text-[10px] text-zinc-700">+{b.tags.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_CLS[b.status] ?? ''}`}>
                          {b.status}
                        </span>
                        {b.is_featured && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[11px] font-mono text-zinc-600">
                      {formatDateShort(b.created_at)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {/* Xem trang public — chỉ hiện khi published */}
                        <a
                          href={`/blog/${b.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Xem trang public"
                          className={`p-1.5 rounded-lg transition-colors ${b.status === 'published' ? 'text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10' : 'text-zinc-700 cursor-not-allowed pointer-events-none'}`}
                        >
                          <ExternalLink size={14} />
                        </a>
                        {/* Sửa */}
                        <button type="button" onClick={() => navigate(`/admin/blogs/${b.id}/edit`)}
                          title="Chỉnh sửa"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors">
                          <Pencil size={14} />
                        </button>
                        {/* Xóa */}
                        <button type="button" onClick={() => handleDelete(b)}
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
              <p className="text-center text-zinc-600 py-16 text-sm">Chưa có bài viết nào.</p>
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
