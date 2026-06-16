import { useState } from 'react';
import SEO from '../../components/common/SEO';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ProjectCard from '../../components/projects/ProjectCard';
import ProjectFilter from '../../components/projects/ProjectFilter';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useProjects } from '../../hooks/useProjects';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProjectsPage() {
  const [activeTech, setActiveTech] = useState(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useProjects({
    page,
    page_size: 12,
    ...(activeTech ? { tech: activeTech } : {}),
  });

  const handleTechChange = (tech) => {
    setActiveTech(tech);
    setPage(1);
  };

  return (
    <>
      <SEO title="Projects" description="Các dự án tôi đã xây dựng." />
      <Navbar />

      <main className="min-h-screen bg-zinc-950">

        {/* ── Page hero — đồng bộ dot-grid với HeroSection ── */}
        <div className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Dot-grid */}
          <div
            className="absolute inset-0 opacity-[0.3]"
            style={{
              backgroundImage: 'radial-gradient(circle, #3f3f46 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          {/* Violet glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(139,92,246,0.14) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10 max-w-6xl mx-auto">
            <p className="text-xs font-mono text-violet-500 uppercase tracking-[0.2em] mb-3">
              Portfolio
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              My Projects
            </h1>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800/70" />

        {/* ── Main content ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Filter */}
          <ProjectFilter
            activeTech={activeTech}
            onTechChange={handleTechChange}
            totalCount={data?.total}
            className="mb-10"
          />

          {/* States */}
          {isLoading ? (
            <div className="flex justify-center py-32">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-32">
              <p className="text-zinc-600 text-sm">Không thể tải projects.</p>
            </div>
          ) : !data?.items?.length ? (
            <div className="text-center py-32">
              <p className="text-zinc-600 text-sm">
                {activeTech
                  ? `Không có project nào dùng ${activeTech}.`
                  : 'Chưa có project nào.'}
              </p>
              {activeTech && (
                <button
                  onClick={() => handleTechChange(null)}
                  className="mt-4 text-xs text-violet-500 hover:text-violet-400 transition-colors"
                >
                  Xoá filter
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Result count */}
              <p className="text-[11px] font-mono text-zinc-600 uppercase tracking-[0.15em] mb-6">
                {data.total} project{data.total !== 1 ? 's' : ''}
                {activeTech ? ` — ${activeTech}` : ''}
              </p>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                {data.items.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>

              {/* Pagination */}
              {data.total_pages > 1 && (
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 hover:border-zinc-600 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={14} /> Trước
                  </button>

                  {/* Page pills */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: data.total_pages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === data.total_pages || Math.abs(p - page) <= 1)
                      .reduce((acc, p, idx, arr) => {
                        if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('...');
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((item, idx) =>
                        item === '...' ? (
                          <span key={`ellipsis-${idx}`} className="text-zinc-600 text-xs px-1">
                            …
                          </span>
                        ) : (
                          <button
                            key={item}
                            onClick={() => setPage(item)}
                            className={
                              item === page
                                ? 'w-8 h-8 rounded-full text-xs font-semibold bg-violet-600 text-white shadow-md shadow-violet-900/40'
                                : 'w-8 h-8 rounded-full text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors'
                            }
                          >
                            {item}
                          </button>
                        ),
                      )}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                    disabled={page === data.total_pages}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 hover:border-zinc-600 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Sau <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}