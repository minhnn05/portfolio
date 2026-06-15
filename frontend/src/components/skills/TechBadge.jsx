import { cn } from '../../utils/cn';

export default function TechBadge({ name, color, iconName, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium',
        'bg-zinc-800 text-zinc-200 border border-zinc-700',
        className,
      )}
      style={color ? { borderColor: `${color}40`, color } : undefined}
    >
      {iconName && (
        <img
          src={`https://cdn.simpleicons.org/${iconName}`}
          alt=""
          className="w-3.5 h-3.5"
          aria-hidden="true"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}
      {name}
    </span>
  );
}
