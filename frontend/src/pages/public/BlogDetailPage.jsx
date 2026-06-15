import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Heart } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TagBadge from '../../components/blog/TagBadge';
import { useBlog } from '../../hooks/useBlogs';
import { blogService } from '../../services/blogService';
import { formatDate } from '../../utils/formatDate';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { blog, isLoading, error } = useBlog(slug);
  const [likeCount, setLikeCount] = useState(null);
  const [liked, setLiked] = useState(false);

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
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={14} /> Quay lại Blog
          </Link>

          {isLoading ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
          ) : error ? (
            <p className="text-center text-zinc-500 py-24">Không tìm thấy bài viết.</p>
          ) : blog ? (
            <article>
              {/* Cover */}
              {blog.cover_image_url && (
                <div className="aspect-video rounded-xl overflow-hidden mb-8 bg-zinc-800">
                  <img src={blog.cover_image_url} alt={blog.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Category */}
              {blog.category && (
                <p className="text-violet-400 text-sm font-medium uppercase tracking-wider mb-3">
                  {blog.category}
                </p>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                {blog.title}
              </h1>

              {/* Meta bar */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-6 pb-6 border-b border-zinc-800">
                <time dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
                <span className="flex items-center gap-1.5"><Clock size={13} /> {blog.reading_time_minutes} phút đọc</span>
                <span className="flex items-center gap-1.5"><Eye size={13} /> {blog.view_count}</span>
              </div>

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-8">
                  {blog.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
                </div>
              )}

              {/* Content */}
              <div className="prose prose-invert prose-zinc max-w-none">
                <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {blog.content}
                </div>
              </div>

              {/* Like button */}
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={handleLike}
                  disabled={liked}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full border text-sm font-medium transition-all ${
                    liked
                      ? 'bg-red-500/10 border-red-500/30 text-red-400 cursor-default'
                      : 'border-zinc-700 text-zinc-400 hover:border-red-500/50 hover:text-red-400'
                  }`}
                >
                  <Heart size={15} className={liked ? 'fill-red-400' : ''} />
                  {displayLikes} likes
                </button>
              </div>
            </article>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
