import { cn } from '../../utils/cn';

/**
 * TagBadge — đồng bộ pill style với ProjectFilter
 * - Khi có onClick: interactive button (active / inactive states)
 * - Khi không có onClick: static span
 */
export default function TagBadge({ tag, onClick, active = false, className }) {
  const base =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(tag)}
        className={cn(
          base,
          active
            ? 'bg-violet-600 text-white shadow-sm shadow-violet-900/40'
            : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 hover:border-zinc-600 hover:text-zinc-200',
          className,
        )}
      >
        #{tag}
      </button>
    );
  }

  return (
    <span
      className={cn(
        base,
        'bg-zinc-800/80 text-zinc-400 border border-zinc-700/60',
        className,
      )}
    >
      #{tag}
    </span>
  );
}
