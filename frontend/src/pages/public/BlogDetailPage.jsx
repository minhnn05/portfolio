import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Heart } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';
import TagBadge from '../../components/blog/TagBadge';
import BlogCard from '../../components/blog/BlogCard';
import { useBlog, useRelatedBlogs } from '../../hooks/useBlogs';
import { blogService } from '../../services/blogService';
import { formatDate } from '../../utils/formatDate';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { blog, isLoading, error } = useBlog(slug);
  const { blogs: relatedBlogs }    = useRelatedBlogs(slug);
  const [likeCount, setLikeCount]  = useState(null);
  const [liked, setLiked]          = useState(false);

  const handleLike = async () => {
    if (liked) return;
    try {
      const res = await blogService.like(slug);
      setLikeCount(res.like_count);
      setLiked(true);
    } catch { /* silent */ }
  };

  const displayLikes = likeCount ?? blog?.like_count ?? 0;

  return (
    <>
      <SEO
        title={blog?.meta_title ?? blog?.title}
        description={blog?.meta_description ?? blog?.excerpt}
        image={blog?.cover_image_url}
      />
      <Navbar />

      <main className="min-h-screen bg-zinc-950">

        {/* ── Page hero ── */}
        <div className="relative pt-32 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
                'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-violet-400 transition-colors mb-0"
            >
              <ArrowLeft size={13} /> Quay lại Blog
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800/70" />

        {/* ── Article content ── */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isLoading ? (
            <div className="flex justify-center py-32">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-32">
              <p className="text-zinc-600 text-sm">Không tìm thấy bài viết.</p>
              <Link
                to="/blog"
                className="mt-4 inline-block text-xs text-violet-500 hover:text-violet-400 transition-colors"
              >
                Xem tất cả bài viết
              </Link>
            </div>
          ) : blog ? (
            <article>
              {/* Cover image */}
              {blog.cover_image_url && (
                <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-zinc-800/80">
                  <img
                    src={blog.cover_image_url}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Category badge */}
              {blog.category && (
                <p className="text-xs font-mono text-violet-500 uppercase tracking-[0.2em] mb-3">
                  {blog.category}
                </p>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
                {blog.title}
              </h1>

              {/* Meta bar */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-zinc-600 uppercase tracking-[0.1em] mb-6 pb-6 border-b border-zinc-800/80">
                <time dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
                <span className="flex items-center gap-1.5">
                  <Clock size={11} /> {blog.reading_time_minutes} phút đọc
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye size={11} /> {blog.view_count} lượt xem
                </span>
              </div>

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-8">
                  {blog.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              )}

              {/* Article body */}
              <MarkdownRenderer content={blog.content} />

              {/* Like button */}
              <div className="mt-14 flex justify-center">
                <button
                  type="button"
                  onClick={handleLike}
                  disabled={liked}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full border text-sm font-medium transition-all ${
                    liked
                      ? 'bg-rose-500/10 border-rose-500/25 text-rose-400 cursor-default'
                      : 'bg-zinc-900/60 border-zinc-700/60 text-zinc-400 hover:border-rose-500/40 hover:text-rose-400 hover:bg-rose-500/5'
                  }`}
                >
                  <Heart size={14} className={liked ? 'fill-rose-400' : ''} />
                  {displayLikes} {displayLikes === 1 ? 'like' : 'likes'}
                </button>
              </div>

              {/* Related blogs */}
              {relatedBlogs.length > 0 && (
                <section className="mt-16 pt-12 border-t border-zinc-800/70">
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-2">
                    Đọc thêm
                  </p>
                  <h2 className="text-lg font-semibold text-white mb-8">
                    Bài viết liên quan
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {relatedBlogs.map((b) => (
                      <BlogCard key={b.id} blog={b} />
                    ))}
                  </div>
                </section>
              )}
            </article>
          ) : null}
        </div>
      </main>

      <Footer />
    </>
  );
}
