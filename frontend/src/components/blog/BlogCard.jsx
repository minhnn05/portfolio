import { Link } from 'react-router-dom';
import { Clock, Eye, Heart } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatDateCompact } from '../../utils/formatDate';
import TagBadge from './TagBadge';

export default function BlogCard({ blog, className, onTagClick }) {
  const {
    title, slug, excerpt, cover_image_url,
    tags = [], category, reading_time_minutes,
    view_count, like_count, is_featured, created_at,
  } = blog;

  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-xl border border-zinc-800 bg-zinc-900',
        'overflow-hidden hover:border-violet-500/50 transition-all duration-300',
        'hover:shadow-lg hover:shadow-violet-500/5',
        className,
      )}
    >
      {/* Cover */}
      {cover_image_url && (
        <div className="aspect-video overflow-hidden bg-zinc-800">
          <img
            src={cover_image_url}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5">
        {/* Category + featured */}
        <div className="flex items-center gap-2 mb-3">
          {category && (
            <span className="text-xs font-medium text-violet-400 uppercase tracking-wider">
              {category}
            </span>
          )}
          {is_featured && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-violet-600/20 text-violet-300 border border-violet-500/30">
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-white text-base mb-2 line-clamp-2 leading-snug">
          <Link
            to={`/blog/${slug}`}
            className="hover:text-violet-400 transition-colors after:absolute after:inset-0"
          >
            {title}
          </Link>
        </h3>

        <p className="text-sm text-zinc-400 line-clamp-3 mb-4 flex-1">{excerpt}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <TagBadge
                key={tag}
                tag={tag}
                onClick={onTagClick ? (e) => { e.preventDefault(); onTagClick(tag); } : undefined}
              />
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs text-zinc-500">
          <time dateTime={created_at}>{formatDateCompact(created_at)}</time>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {reading_time_minutes} phút
            </span>
            <span className="flex items-center gap-1">
              <Eye size={11} />
              {view_count}
            </span>
            <span className="flex items-center gap-1">
              <Heart size={11} />
              {like_count}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
