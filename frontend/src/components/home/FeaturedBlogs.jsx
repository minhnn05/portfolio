import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useFeaturedBlogs } from '../../hooks/useBlogs';
import BlogCard from '../blog/BlogCard';
import LoadingSpinner from '../common/LoadingSpinner';

export default function FeaturedBlogs() {
  const { blogs, isLoading } = useFeaturedBlogs();

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (!blogs.length) return null;

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-xs font-mono text-violet-500 uppercase tracking-[0.2em] mb-3">
              03 — Writing
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Latest
              <br />
              Posts
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden sm:inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-violet-400 transition-colors group"
          >
            Xem tất cả
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.slice(0, 3).map((b) => (
            <BlogCard key={b.id} blog={b} />
          ))}
        </div>

        {/* Mobile "see all" */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
          >
            Xem tất cả bài viết <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}