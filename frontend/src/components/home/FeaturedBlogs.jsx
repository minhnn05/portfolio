import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useFeaturedBlogs } from '../../hooks/useBlogs';
import BlogCard from '../blog/BlogCard';
import LoadingSpinner from '../common/LoadingSpinner';

export default function FeaturedBlogs() {
  const { blogs, isLoading } = useFeaturedBlogs();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (!blogs.length) return null;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-violet-400 text-sm font-medium uppercase tracking-wider mb-2">
            Writing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Latest Posts
          </h2>
        </div>
        <Link
          to="/blog"
          className="hidden sm:inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Xem tất cả <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.slice(0, 3).map((b) => (
          <BlogCard key={b.id} blog={b} />
        ))}
      </div>

      <div className="mt-8 flex justify-center sm:hidden">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Xem tất cả bài viết <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
