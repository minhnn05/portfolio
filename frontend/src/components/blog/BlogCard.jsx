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
        'group relative flex flex-col rounded-2xl border border-zinc-800',
        'bg-zinc-900/60 overflow-hidden',
        'hover:border-violet-500/40 hover:bg-zinc-900',
        'hover:shadow-xl hover:shadow-violet-950/30',
        'transition-all duration-300',
        className,
      )}
    >
      {/* Cover image */}
      <div className="relative aspect-video overflow-hidden bg-zinc-800/80">
        {cover_image_url ? (
          <img
            src={cover_image_url}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Placeholder — đồng bộ với ProjectCard */
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                'radial-gradient(ellipse at top, rgba(139,92,246,0.12) 0%, transparent 70%), #18181b',
            }}
          >
            <span className="text-4xl font-bold text-zinc-700 select-none font-mono">
              {title?.charAt(0) ?? 'B'}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {is_featured && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-violet-600 text-white tracking-wide">
              Featured
            </span>
          )}
        </div>

        {category && (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-900/80 text-violet-400 border border-violet-500/20 backdrop-blur-sm">
            {category}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h3 className="font-semibold text-white text-sm mb-1.5 line-clamp-2 leading-snug">
          <Link
            to={`/blog/${slug}`}
            className="hover:text-violet-400 transition-colors after:absolute after:inset-0"
          >
            {title}
          </Link>
        </h3>

        <p className="text-xs text-zinc-500 line-clamp-2 mb-4 flex-1 leading-relaxed">
          {excerpt}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <TagBadge
                key={tag}
                tag={tag}
                onClick={
                  onTagClick
                    ? (t) => {
                        // TagBadge's onClick receives the tag string
                        onTagClick(t);
                      }
                    : undefined
                }
              />
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] text-zinc-600 bg-zinc-800 border border-zinc-700/40">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Meta footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-600">
          <time dateTime={created_at}>{formatDateCompact(created_at)}</time>
          <div className="flex items-center gap-3">
            {reading_time_minutes != null && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {reading_time_minutes} phút
              </span>
            )}
            {view_count != null && (
              <span className="flex items-center gap-1">
                <Eye size={11} />
                {view_count}
              </span>
            )}
            {like_count != null && (
              <span className="flex items-center gap-1">
                <Heart size={11} />
                {like_count}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
