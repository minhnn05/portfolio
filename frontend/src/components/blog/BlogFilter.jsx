import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

const CATEGORIES = [
  'Tutorial',
  'Deep Dive',
  'Career',
  'Review',
  'Opinion',
];

/**
 * BlogFilter — đồng bộ pill style với ProjectFilter
 * - Category pills (All + each category)
 * - Active tag chip với nút clear
 */
export default function BlogFilter({
  activeCategory,
  activeTag,
  onCategoryChange,
  onTagRemove,
  className,
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Label */}
      <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.18em]">
        Filter by category
      </p>

      {/* Category pills */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter theo category"
      >
        {/* All pill */}
        <button
          type="button"
          onClick={() => onCategoryChange(null)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all',
            activeCategory == null
              ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
              : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 hover:border-zinc-600 hover:text-zinc-200',
          )}
        >
          All
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(activeCategory === cat ? null : cat)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all',
              activeCategory === cat
                ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
                : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 hover:border-zinc-600 hover:text-zinc-200',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active tag indicator */}
      {activeTag && (
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.18em]">
            Tag:
          </span>
          <button
            type="button"
            onClick={onTagRemove}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-violet-600/15 text-violet-300 border border-violet-500/25 hover:bg-violet-600/25 transition-all"
          >
            #{activeTag}
            <X size={10} className="opacity-70" />
          </button>
        </div>
      )}
    </div>
  );
}
