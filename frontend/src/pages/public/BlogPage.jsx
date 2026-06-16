import { useState } from 'react';
import SEO from '../../components/common/SEO';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import BlogCard from '../../components/blog/BlogCard';
import TagBadge from '../../components/blog/TagBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useBlogs } from '../../hooks/useBlogs';

const CATEGORIES = ['Tutorial', 'Deep Dive', 'Career', 'Review', 'Opinion'];

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useBlogs({
    page,
    page_size: 9,
    ...(activeTag ? { tag: activeTag } : {}),
    ...(activeCategory ? { category: activeCategory } : {}),
  });

  const handleTag = (tag) => { setActiveTag((t) => t === tag ? null : tag); setPage(1); };
  const handleCategory = (cat) => { setActiveCategory((c) => c === cat ? null : cat); setPage(1); };

  return (
    <>
      <SEO title="Blog" description="Bài viết về lập trình, kinh nghiệm và công nghệ." />
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-violet-400 text-sm font-medium uppercase tracking-wider mb-2">Writing</p>
            <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
            <p className="text-zinc-400 max-w-xl">Chia sẻ kinh nghiệm, tutorial và những thứ tôi học được.</p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              type="button"
              onClick={() => { setActiveCategory(null); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory == null ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active tag indicator */}
          {activeTag && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-zinc-400">Tag:</span>
              <TagBadge tag={activeTag} onClick={handleTag} active />
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
          ) : error ? (
            <p className="text-center text-zinc-500 py-24">Không thể tải bài viết.</p>
          ) : !data?.items?.length ? (
            <p className="text-center text-zinc-500 py-24">Chưa có bài viết nào.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {data.items.map((b) => (
                  <BlogCard key={b.id} blog={b} onTagClick={handleTag} />
                ))}
              </div>

              {data.total_pages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-4 py-2 rounded-lg text-sm bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed">
                    Trước
                  </button>
                  <span className="text-sm text-zinc-400">{page} / {data.total_pages}</span>
                  <button onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))} disabled={page === data.total_pages}
                    className="px-4 py-2 rounded-lg text-sm bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed">
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
