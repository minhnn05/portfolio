import { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import BlogCard from '../../components/blog/BlogCard';
import BlogFilter from '../../components/blog/BlogFilter';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useBlogs } from '../../hooks/useBlogs';

export default function BlogPage() {
  const [activeTag, setActiveTag]           = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [page, setPage]                     = useState(1);

  const { data, isLoading, error } = useBlogs({
    page,
    page_size: 9,
    ...(activeTag      ? { tag: activeTag }           : {}),
    ...(activeCategory ? { category: activeCategory } : {}),
  });

  const handleTag = (tag) => {
    setActiveTag((t) => (t === tag ? null : tag));
    setPage(1);
  };
  const handleCategory = (cat) => {
    setActiveCategory((c) => (c === cat ? null : cat));
    setPage(1);
  };
  const clearFilters = () => {
    setActiveTag(null);
    setActiveCategory(null);
    setPage(1);
  };

  const hasFilter = activeTag || activeCategory;

  return (
    <>
      <SEO
        title="Blog"
        description="Bài viết về lập trình, kinh nghiệm và công nghệ."
      />
      <Navbar />

      <main className="min-h-screen bg-zinc-950">

        {/* ── Page hero — đồng bộ với ProjectsPage ── */}
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
              Writing
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Blog
            </h1>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800/70" />

        {/* ── Main content ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Filter bar */}
          <BlogFilter
            activeCategory={activeCategory}
            activeTag={activeTag}
            onCategoryChange={handleCategory}
            onTagRemove={() => handleTag(activeTag)}
            className="mb-10"
          />

          {/* States */}
          {isLoading ? (
            <div className="flex justify-center py-32">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-32">
              <p className="text-zinc-600 text-sm">Không thể tải bài viết.</p>
            </div>
          ) : !data?.items?.length ? (
            <div className="text-center py-32">
              <BookOpen size={32} className="text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-600 text-sm mb-4">
                {hasFilter
                  ? 'Không có bài viết nào phù hợp với bộ lọc.'
                  : 'Chưa có bài viết nào.'}
              </p>
              {hasFilter && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-violet-500 hover:text-violet-400 transition-colors"
                >
                  Xoá filter
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Result count — đồng bộ mono style với ProjectsPage */}
              <p className="text-[11px] font-mono text-zinc-600 uppercase tracking-[0.15em] mb-6">
                {data.total} bài viết
                {activeCategory ? ` — ${activeCategory}` : ''}
                {activeTag ? ` — #${activeTag}` : ''}
              </p>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                {data.items.map((b) => (
                  <BlogCard key={b.id} blog={b} onTagClick={handleTag} />
                ))}
              </div>

              {/* Pagination — đồng bộ với ProjectsPage */}
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
                      .filter(
                        (p) =>
                          p === 1 ||
                          p === data.total_pages ||
                          Math.abs(p - page) <= 1,
                      )
                      .reduce((acc, p, idx, arr) => {
                        if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('...');
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((item, idx) =>
                        item === '...' ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="text-zinc-600 text-xs px-1"
                          >
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
