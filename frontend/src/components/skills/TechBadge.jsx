import { cn } from '../../utils/cn';

/**
 * TechBadge — đồng bộ pill style với ProjectCard tech stack
 * Dùng ở các nơi cần hiển thị tech/skill inline (không phải SkillGroup)
 */
export default function TechBadge({ name, color, iconName, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium',
        'bg-zinc-900/70 border border-zinc-700/50 text-zinc-300',
        className,
      )}
      style={color ? { borderColor: `${color}40`, color } : undefined}
    >
      {iconName && (
        <img
          src={`https://cdn.simpleicons.org/${iconName}`}
          alt=""
          className="w-3.5 h-3.5 flex-shrink-0"
          aria-hidden="true"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}
      {name}
    </span>
  );
}
