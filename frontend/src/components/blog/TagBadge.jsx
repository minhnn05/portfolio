import { cn } from '../../utils/cn';

export default function TagBadge({ tag, onClick, active = false, className }) {
  const base =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(tag)}
        className={cn(
          base,
          active
            ? 'bg-violet-500 text-white'
            : 'bg-zinc-800 text-zinc-300 hover:bg-violet-500/20 hover:text-violet-300',
          className,
        )}
      >
        #{tag}
      </button>
    );
  }

  return (
    <span className={cn(base, 'bg-zinc-800 text-zinc-300', className)}>
      #{tag}
    </span>
  );
}
