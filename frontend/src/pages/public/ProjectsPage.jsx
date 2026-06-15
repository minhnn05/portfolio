import { useState } from 'react';
import SEO from '../../components/common/SEO';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ProjectCard from '../../components/projects/ProjectCard';
import ProjectFilter from '../../components/projects/ProjectFilter';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useProjects } from '../../hooks/useProjects';

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
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <p className="text-violet-400 text-sm font-medium uppercase tracking-wider mb-2">
              Portfolio
            </p>
            <h1 className="text-4xl font-bold text-white mb-4">Projects</h1>
            <p className="text-zinc-400 max-w-xl">
              Những dự án tôi đã xây dựng — từ side projects đến freelance.
            </p>
          </div>

          {/* Filter */}
          <ProjectFilter
            activeTech={activeTech}
            onTechChange={handleTechChange}
            className="mb-8"
          />

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
          ) : error ? (
            <p className="text-center text-zinc-500 py-24">Không thể tải projects.</p>
          ) : !data?.items?.length ? (
            <p className="text-center text-zinc-500 py-24">Không tìm thấy project nào.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {data.items.map((p) => <ProjectCard key={p.id} project={p} />)}
              </div>

              {/* Pagination */}
              {data.total_pages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg text-sm bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Trước
                  </button>
                  <span className="text-sm text-zinc-400">
                    {page} / {data.total_pages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                    disabled={page === data.total_pages}
                    className="px-4 py-2 rounded-lg text-sm bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Sau
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
